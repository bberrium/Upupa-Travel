// Central tour manifest: search/filter metadata + tiered pricing.
// Used by the tour listings AND each tour page's price calculator, so pricing
// lives in exactly one place.
//
// Pricing tables are keyed by exact headcount 1-10 (AMD, total group price —
// not per person). Beyond 10 people, `extraPerPerson` AMD is added per extra
// person, up to `maxPeople`.
//
// `pricing: null` means real numbers aren't in yet — the site shows
// "Contact for price" for that tour until they are.
//
// IMAGES: paths are local and relative to /public. Never paste a Facebook,
// Google or other site's image URL here — those links expire and break the
// page. Run `npm run images:fetch` to pull everything into /public/images.

export const TOURS = [
  {
    slug: "garni-geghard",
    tourNumber: 1,
    label: "Day Tour",
    category: "day",
    title: "Garni, Geghard & Symphony of Stones",
    desc: "Temple, cliffside monastery & basalt gorge in a day. Discover the pre-Christian roots and unique geology of Armenia.",
    images: [
      "images/tours/garni-geghard/garni2.webp",
      "images/tours/garni-geghard/monastery3.webp",
      "images/tours/garni-geghard/stones1.webp",
      "images/tours/garni-geghard/arch1.webp",
    ],
    languages: ["en", "ru", "am"],
    duration: "6-7 hours",
    region: "Yerevan",
    pricing: {
      noGuide: {
        1: 30000, 2: 31000, 3: 32000, 4: 34000, 5: 35000, 6: 36000,
        7: 47000, 8: 48000, 9: 49000, 10: 58000,
        extraPerPerson: 1000, maxPeople: 19,
      },
      guide: {
        1: 50000, 2: 51000, 3: 52000, 4: 59000, 5: 60000, 6: 61000,
        7: 82000, 8: 83000, 9: 84000, 10: 88000,
        extraPerPerson: 1000, maxPeople: 18,
      },
    },
  },
  {
    slug: "tsaghkadzor-sevan",
    tourNumber: 2,
    label: "Day Tour",
    category: "day",
    title: "Tsaghkadzor, Kecharis Monastery, Ropeway & Lake Sevan",
    desc: "Ride a mountain ropeway above Tsaghkadzor, then unwind at Lake Sevan's ancient clifftop monastery — with time on the water.",
    images: [
          "images/tours/tsaghkadzor-sevan/kecharis1.webp",
          "images/tours/tsaghkadzor-sevan/ropeway1.webp",
          "images/tours/sevan-dilijan/sevan2.webp",
          "images/tours/sevan-dilijan/sevanavank2.webp",
          "images/tours/tsaghkadzor-sevan/kecharis2.webp"
    ],
    languages: ["en", "ru", "am"],
    duration: "7-8 hours",
    region: "Yerevan",
    pricing: {
      noGuide: {
        1: 34000, 2: 34000, 3: 36000, 4: 38000, 5: 44000, 6: 46000,
        7: 48000, 8: 48000, 9: 50000, 10: 72000,
        extraPerPerson: 2000, maxPeople: 20,
      },
      guide: {
        1: 64000, 2: 64000, 3: 66000, 4: 68000, 5: 74000, 6: 76000,
        7: 78000, 8: 78000, 9: 80000, 10: 102000,
        extraPerPerson: 2000, maxPeople: 20,
      },
    },
  },
  {
    slug: "garni-geghard-sevan",
    tourNumber: 3,
    label: "Day Tour",
    category: "day",
    title: "Charents' Arch, Garni, Geghard, Symphony of Stones, Lavash & Lake Sevan",
    desc: "The full pre-Christian-to-medieval route in one day: Garni Temple, Geghard Monastery, the Symphony of Stones and a lavash-baking stop, capped off at Lake Sevan and Sevanavank.",
    images: [
      "images/tours/garni-geghard/garni1.webp",
      "images/tours/garni-geghard/monastery3.webp",
      "images/tours/sevan-dilijan/sevanavank3.webp",
      "images/tours/sevan-dilijan/sevan1.webp",
    ],
    languages: ["en", "ru", "am"],
    duration: "9-10 hours",
    region: "Yerevan",
    pricing: {
      // NOTE: the source form gave a base price for 2 people (no guide) but
      // no 1-person price, and guide pricing only from 3 people up (no
      // 2-person guide price). Those cells are left out on purpose —
      // priceFor() returns null below the table's lowest key, so the site
      // shows "Contact for price" for 1 person (no guide) and for 2 people
      // with a guide until real numbers come in.
      noGuide: {
        2: 40000, 3: 42000, 4: 44000, 5: 50000, 6: 52000,
        7: 60000, 8: 62000, 9: 64000, 10: 74000,
        extraPerPerson: 2000, maxPeople: 20,
      },
      guide: {
        2: 70000, 3: 72000, 4: 74000, 5: 80000, 6: 82000,
        7: 90000, 8: 92000, 9: 94000, 10: 104000,
        extraPerPerson: 2000, maxPeople: 20,
      },
    },
  },
  {
    slug: "sevan-dilijan",
    tourNumber: 4,
    label: "Day Tour",
    category: "day",
    title: "Lake Sevan, Sevanavank, Dilijan, Goshavank, Haghartsin",
    desc: "Explore the 'Blue Pearl of Armenia' and discover medieval monasteries hidden deep within the lush forests of the Armenian Switzerland.",
    images: [
          "images/tours/sevan-dilijan/sevanavank3.webp",
          "images/tours/sevan-dilijan/dilijan4.webp",
          "images/tours/sevan-dilijan/dilijan5.webp",
          "images/tours/sevan-dilijan/goshavank2.webp",
          "images/tours/sevan-dilijan/haghartsin1.webp",
          "images/tours/sevan-dilijan/haghartsin9.webp"

        ],
    languages: ["en", "ru", "am"],
    duration: "10-11 hours",
    region: "Yerevan",
    pricing: {
      noGuide: {
        1: 44000, 2: 44000, 3: 46000, 4: 48000, 5: 54000,
        6: 56000, 7: 66000, 8: 68000, 9: 70000, 10: 78000,
        extraPerPerson: 2000, maxPeople: 20,
      },
      guide: {
        1: 74000, 2: 74000, 3: 76000, 4: 78000, 5: 84000,
        6: 86000, 7: 96000, 8: 98000, 9: 100000, 10: 108000,
        extraPerPerson: 2000, maxPeople: 20,
      },
    },
  },
];


export function priceFor(pricing, people, withGuide) {
  if (!pricing) return null;
  const table = withGuide ? pricing.guide : pricing.noGuide;
  if (!table) return null;
  if (people < 1 || people > table.maxPeople) return null;
  if (people <= 10) {
    const val = table[people];
    return val == null ? null : val;
  }
  const base = table[10];
  if (base == null) return null;
  return base + (people - 10) * table.extraPerPerson;
}

export function formatAMD(n) {
  return n.toLocaleString("en-US") + " AMD";
}

// Rough second-currency hint so inbound guests can size the price up quickly.
// Update when the rate drifts; it is labelled as approximate on the page.
export const AMD_PER_USD = 385;

export function approxUSD(amd) {
  if (!amd) return null;
  return "≈ $" + Math.round(amd / AMD_PER_USD / 5) * 5;
}

export function lowestPrice(tour) {
  if (!tour.pricing) return null;
  return priceFor(tour.pricing, 2, false);
}