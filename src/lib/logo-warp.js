/**
 * Smooth "feather unfold" for the Upupa logo.
 *
 * Why this exists: the previous animation cut the crest into loose pieces and
 * crossfaded between them, so half the crest disappeared mid-animation and the
 * feathers looked detached. This version never cuts the logo apart. It bends
 * the ONE complete logo image like a flexible sheet: the feathers fan out a
 * little and a soft ripple travels up them, then everything settles back.
 * Because every pixel moves smoothly, nothing can tear or ghost.
 *
 * Usage:
 *   const warp = createLogoWarp(canvas, img, { bleed: 0.12, pixelScale: 1.15 });
 *   warp.draw(0.5);        // draw the frame at 50% of the animation (0..1)
 *   warp.draw(0);          // identical to the still logo
 *   warp.resize();         // call if the logo's on-screen size changed
 */

const TAU = Math.PI * 2;
const DEG = Math.PI / 180;

// Where the crest fans out from, and which way it points (image fractions).
const PIVOT = { x: 0.52, y: 0.66 };
const AXIS = -115 * DEG; // crest centre direction (up and to the left)

// How much it moves. Small numbers = subtle and smooth.
const FAN = 0.30; // extra spread: feathers at +-55deg move about +-9deg
const RIPPLE = 5 * DEG; // size of the travelling wave
const LIFT = 0.05; // feathers stretch outward by 3.5%

const smooth = (a, b, x) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

// Sharpness: the logo is stored at SS x the canvas resolution and every output
// pixel averages several samples (when the canvas is small enough to afford it),
// so moving feathers keep crisp edges instead of getting softer.
const SS = 2;

export function createLogoWarp(canvas, img, opts = {}) {
  const bleed = opts.bleed ?? 0.12; // extra room around the logo for the fan-out
  const pixelScale = opts.pixelScale ?? 1; // CSS will enlarge the logo by this much; draw that many more pixels
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  let W = 0, H = 0; // canvas pixels
  let src = null; // premultiplied source pixels at SS x resolution (Float32Array RGBA)
  let SW = 0, SH = 0; // source size in pixels (= canvas size * SS)
  let taps = 4; // samples per output pixel
  let out = null; // ImageData we write each frame
  let box = 0; // logo box size in canvas pixels
  let ox = 0, oy = 0; // where the logo sits inside the canvas
  let iw = 0, ih = 0; // logo size in canvas pixels

  function resize() {
    // offsetWidth ignores CSS transforms, so this is the same whether or not the
    // logo is currently enlarged by hover.
    const dpr = Math.min(window.devicePixelRatio || 1, 3);
    W = Math.max(8, Math.round(canvas.offsetWidth * dpr * pixelScale));
    H = Math.max(8, Math.round(canvas.offsetHeight * dpr * pixelScale));
    canvas.width = W;
    canvas.height = H;
    // The visible logo box is the canvas minus the bleed on every side.
    box = Math.min(W, H) / (1 + bleed * 2);
    const ratio = img.naturalWidth / img.naturalHeight;
    ih = ratio >= 1 ? box / ratio : box;
    iw = ratio >= 1 ? box : box * ratio;
    ox = Math.round((W - iw) / 2);
    oy = Math.round((H - ih) / 2);

    // Draw the logo once at SS x its final size, then read the pixels.
    SW = W * SS;
    SH = H * SS;
    const off = document.createElement("canvas");
    off.width = SW;
    off.height = SH;
    const octx = off.getContext("2d", { willReadFrequently: true });
    octx.imageSmoothingEnabled = true;
    octx.imageSmoothingQuality = "high";
    octx.drawImage(img, ox * SS, oy * SS, iw * SS, ih * SS);
    const data = octx.getImageData(0, 0, SW, SH).data;
    src = new Float32Array(SW * SH * 4);
    for (let i = 0; i < SW * SH; i++) {
      const a = data[i * 4 + 3] / 255;
      src[i * 4] = (data[i * 4] / 255) * a; // premultiply so edges blend cleanly
      src[i * 4 + 1] = (data[i * 4 + 1] / 255) * a;
      src[i * 4 + 2] = (data[i * 4 + 2] / 255) * a;
      src[i * 4 + 3] = a;
    }
    taps = W * H > 260000 ? 1 : 4; // big canvases use 1 sample to stay fast
    out = ctx.createImageData(W, H);
  }

  function sample(x, y, o) {
    // Bilinear sample of the hi-res premultiplied source. (x, y) are in
    // canvas pixels; pixel centres sit at +0.5.
    const fxp = x * SS - 0.5, fyp = y * SS - 0.5;
    if (fxp < 0 || fyp < 0 || fxp >= SW - 1 || fyp >= SH - 1) {
      o[0] = o[1] = o[2] = o[3] = 0;
      return;
    }
    const x0 = fxp | 0, y0 = fyp | 0;
    const fx = fxp - x0, fy = fyp - y0;
    const i00 = (y0 * SW + x0) * 4, i10 = i00 + 4;
    const i01 = i00 + SW * 4, i11 = i01 + 4;
    const w00 = (1 - fx) * (1 - fy), w10 = fx * (1 - fy), w01 = (1 - fx) * fy, w11 = fx * fy;
    for (let c = 0; c < 4; c++) {
      o[c] = src[i00 + c] * w00 + src[i10 + c] * w10 + src[i01 + c] * w01 + src[i11 + c] * w11;
    }
  }

  const tmp = [0, 0, 0, 0];

  /** progress: 0..1 through the animation. */
  function draw(progress) {
    if (!src) resize();
    const q = Math.min(1, Math.max(0, progress));
    // Starts and ends at rest with zero speed: no snap at either end.
    const s = Math.sin(Math.PI * q) ** 2;
    const px = ox + PIVOT.x * iw;
    const py = oy + PIVOT.y * ih;
    const data = out.data;

    const offs = taps === 4 ? [0.25, 0.75] : [0.5];
    const inv = 1 / (offs.length * offs.length);

    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        let r0 = 0, g0 = 0, b0 = 0, a0 = 0;
        for (const oy2 of offs) {
          for (const ox2 of offs) {
            const X = x + ox2, Y = y + oy2;
            const dx = X - px, dy = Y - py;
            let sx = X, sy = Y;
            const r = Math.hypot(dx, dy);
            const rn = r / ih; // distance in logo heights

            if (s > 0.0005 && rn > 0.05) {
              const a = Math.atan2(dy, dx);
              // Signed angle from the crest axis, wrapped to -pi..pi.
              let d = a - AXIS;
              d = Math.atan2(Math.sin(d), Math.cos(d));
              // Only the crest moves; head, beak and body stay put.
              const wa = 1 - smooth(55 * DEG, 100 * DEG, Math.abs(d));
              const wr = smooth(0.1, 0.3, rn);
              const w = s * wa * wr;
              if (w > 0.0005) {
                const wave = Math.sin(TAU * (rn / 0.55 - q * 1.15));
                const shift = FAN * w * d + RIPPLE * w * wave; // angular displacement
                const rs = r / (1 + LIFT * w);
                const as = a - shift;
                sx = px + rs * Math.cos(as);
                sy = py + rs * Math.sin(as);
              }
            }
            sample(sx, sy, tmp);
            r0 += tmp[0]; g0 += tmp[1]; b0 += tmp[2]; a0 += tmp[3];
          }
        }
        const a = a0 * inv;
        const i = (y * W + x) * 4;
        if (a > 0.001) {
          data[i] = Math.min(255, (r0 * inv / a) * 255);
          data[i + 1] = Math.min(255, (g0 * inv / a) * 255);
          data[i + 2] = Math.min(255, (b0 * inv / a) * 255);
          data[i + 3] = Math.min(255, a * 255);
        } else {
          data[i] = data[i + 1] = data[i + 2] = data[i + 3] = 0;
        }
      }
    }
    ctx.putImageData(out, 0, 0);
  }

  resize();
  return { draw, resize };
}