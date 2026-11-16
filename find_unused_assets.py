#!/usr/bin/env python3
"""Find potentially unused website assets without deleting anything by default.

Run in your Astro project root:
    python3 find_unused_assets.py
    python3 find_unused_assets.py --move

--move puts candidates in a dated sibling folder for review, not the trash.
Static-reference scanning is heuristic: dynamic paths, CSS-generated names,
CMS URLs, and runtime naming conventions may not be discoverable.
"""

from __future__ import annotations

import argparse
import fnmatch
import os
import re
import shutil
from datetime import datetime
from pathlib import Path

SKIP_DIRS = {
    ".git", ".astro", "node_modules", "dist", "build", "coverage",
    ".venv", "venv", ".next", ".cache", ".turbo", "__pycache__",
    "vendor", ".output", "target",
}
TEXT_EXTS = {
    ".astro", ".js", ".mjs", ".cjs", ".jsx", ".ts", ".tsx",
    ".css", ".scss", ".sass", ".less", ".html", ".htm", ".mdx",
    ".vue", ".svelte", ".json", ".jsonc", ".yml", ".yaml",
    ".toml", ".xml", ".py", ".sh", ".txt",
}
ASSET_EXTS = {
    ".png", ".jpg", ".jpeg", ".webp", ".avif", ".gif", ".svg",
    ".ico", ".bmp", ".tiff", ".heic", ".woff", ".woff2", ".ttf",
    ".otf", ".mp4", ".webm", ".mov", ".mp3", ".ogg", ".wav",
    ".pdf", ".glb", ".gltf",
}
IMAGE_EXTS = {".png", ".jpg", ".jpeg", ".webp", ".avif", ".gif"}
DEFAULT_DIRS = ("public/images", "src/assets")


def walk_files(root: Path):
    # Prune dependency and build folders instead of walking through them.
    for directory, subdirs, files in os.walk(root):
        subdirs[:] = [name for name in subdirs if name not in SKIP_DIRS]
        for name in files:
            file = Path(directory) / name
            if file.is_file():
                yield file


def normalize_path(p: str) -> str:
    return p.replace("\\\\", "/").lstrip("/")


def scan_source(root: Path, self_path: Path):
    """Only inspect executable/config data, not README/docs or generated output."""
    parts = []
    templates = set()
    globs = set()
    scanned = 0
    for file in walk_files(root):
        if file.resolve() == self_path.resolve() or file.suffix.lower() not in TEXT_EXTS:
            continue
        rel = file.relative_to(root)
        # Documentation may mention assets that aren't actually in use.
        if rel.suffix.lower() == '.txt' and rel.parts[0] not in ('src', 'scripts'):
            continue
        # Ignore package lock, node_modules, and project documentation.
        if rel.name in ('package-lock.json', 'pnpm-lock.yaml', 'yarn.lock'):
            continue
        if rel.parts[0] not in ('src', 'public', 'scripts', '.github') and len(rel.parts) > 1:
            continue
        if len(rel.parts) == 1 and rel.suffix.lower() in ('.md', '.mdx'):
            continue
        if file.stat().st_size > 4_000_000:
            continue
        try:
            content = file.read_text(encoding="utf-8", errors="replace")
        except OSError:
            continue
        scanned += 1
        parts.append(content)
        # Capture strings containing Astro/Vite dynamic references, e.g.
        # `images/brand/upupa-flame/layer-${n}.webp`
        for token in re.findall(r'[\x27"`]([^\x27"`]*\$\{[^\x27"`]+?\}[^\x27"`]*)[\x27"`]', content):
            if '/' in token and '${' in token:
                templates.add(token)
        # Capture static import.meta.glob patterns (globs are entry points).
        for pattern in re.findall(r'import\.meta\.glob\s*\(\s*[\x27"`]([^\x27"`]+)[\x27"`]', content):
            globs.add(pattern)
    return '\n'.join(parts), templates, globs, scanned


def candidate_names(rel: Path):
    """Alternate URL forms (with and without public/) and image extensions."""
    p = rel.as_posix()
    forms = {p}
    if p.startswith('public/'):
        forms.add(p[len('public/'):])
    if p.startswith('src/'):
        forms.add('/' + p)
    variants = set(forms)
    if rel.suffix.lower() in IMAGE_EXTS:
        for form in forms:
            base = form.rsplit('.', 1)[0]
            for ext in IMAGE_EXTS:
                variants.add(base + ext)
    # Filename-only reference protects assets referenced via helper-generated paths.
    variants.add(rel.name)
    if rel.suffix.lower() in IMAGE_EXTS:
        variants.update(rel.stem + e for e in IMAGE_EXTS)
    return variants


def is_dynamic_match(rel: Path, templates: set[str], globs: set[str]) -> bool:
    paths = candidate_names(rel)
    for token in templates:
        # Keep the dynamically interpolated portions as one path segment.
        regex = re.escape(token)
        regex = re.sub(r'\\\$\\\{[^}]+\\\}', r'[^/]+', regex)
        regex = re.compile('^' + regex + '$')
        if any(regex.fullmatch(p) for p in paths):
            return True
    for pattern in globs:
        pattern = pattern.lstrip('./')
        if pattern.startswith('public/'):
            patterns = {pattern, pattern[len('public/'): ]}
        else:
            patterns = {pattern}
        for p in paths:
            for pat in patterns:
                if fnmatch.fnmatchcase(p, pat):
                    return True
    return False


def main():
    parser = argparse.ArgumentParser(description='Find likely unused static website assets')
    parser.add_argument('--root', type=Path, default=Path.cwd(), help='Astro project root (default: cwd)')
    parser.add_argument('--dirs', nargs='+', default=list(DEFAULT_DIRS), help='Asset folders to inspect')
    parser.add_argument('--move', action='store_true', help='Move candidates to external review folder')
    args = parser.parse_args()
    root = args.root.expanduser().resolve()
    if not (root / 'package.json').is_file():
        parser.error(f'No package.json found in {root}. Run from your project root.')

    source, templates, globs, source_count = scan_source(root, Path(__file__))
    assets = []
    for folder in args.dirs:
        d = (root / folder).resolve()
        if not d.is_relative_to(root) or not d.exists():
            continue
        assets.extend(p for p in walk_files(d) if p.suffix.lower() in ASSET_EXTS)
    assets = sorted(set(assets))

    suspects = []
    for asset in assets:
        rel = asset.relative_to(root)
        names = candidate_names(rel)
        if not any(name in source for name in names) and not is_dynamic_match(rel, templates, globs):
            suspects.append(asset)

    print(f'Checked {len(assets)} assets and {source_count} source/config files.')
    if not suspects:
        print('No likely unused assets detected.')
        return
    print(f'\nPOSSIBLY UNUSED ({len(suspects)}). Review before removal:')
    for item in suspects:
        print(f'  {item.relative_to(root)}   ({item.stat().st_size // 1024} KiB)')

    if args.move:
        backup = root.parent / f'{root.name}-unused-assets-review-{datetime.now().strftime("%Y%m%d-%H%M%S")}'
        for item in suspects:
            target = backup / item.relative_to(root)
            target.parent.mkdir(parents=True, exist_ok=True)
            shutil.move(str(item), str(target))
        print(f'\nMoved {len(suspects)} files to: {backup}')
        print('Now run `npm run build` and preview the whole site before deleting that backup.')
    else:
        print('\nNo files were modified. Use --move to quarantine candidates, not delete them.')
        print('CAUTION: dynamically generated filenames, CMS assets, and third-party URLs may be missed.')


if __name__ == '__main__':
    main()
