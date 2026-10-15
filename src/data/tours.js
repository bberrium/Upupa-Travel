// Central tour manifest: search/filter metadata + tiered pricing.
// Used by the tour listings AND each tour page's price calculator, so pricing
// lives in exactly one place.
//
// Pricing tables are keyed by exact headcount (AMD, total group price —
// not per person). If a headcount has its own key (e.g. 11: 110000), that
// price is used. Otherwise, beyond 10 people, `extraPerPerson` AMD is added
// per extra person on top of the 10-person price, up to `maxPeople`.
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
      "images/tours/garni-geghard/monastery3.webp",
      "images/tours/garni-geghard/stones2.webp",
      "images/tours/garni-geghard/arch2.webp",
      "images/tours/garni-geghard/lavash2.webp"
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
      "images/tours/sevan-dilijan/sevan1.webp",
      "images/tours/garni-geghard/stones1.webp",
      "images/tours/garni-geghard/arch1.webp",
      "images/tours/garni-geghard/lavash1.webp"
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
          "images/tours/sevan-dilijan/goshavank.webp",
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
  {
    slug: "haghpat-sanahin-akhtala",
    tourNumber: 5,
    label: "Day Tour",
    category: "day",
    title: "Haghpat and Sanahin Monasteries, Akhtala Fortress",
    // DRAFT teaser — the client left this blank.
    desc: "Two UNESCO-listed monasteries and a fortress with Byzantine frescoes, in the forested canyons of Lori.",
    images: [
      "images/tours/sanahin-haghpat-akhtala/haghpat7.webp",
      "images/tours/sanahin-haghpat-akhtala/sanahin4.webp",
      "images/tours/sanahin-haghpat-akhtala/haghpat1.webp",
      "images/tours/sanahin-haghpat-akhtala/akhtala1.webp",
      "images/tours/sanahin-haghpat-akhtala/sanahin2.webp",
    ],
    languages: ["en", "ru", "am"],
    duration: "11-12 hours",
    region: "Yerevan",
    pricing: {
      // NOTE: the client gave no 1-person price, so 1 person shows
      // "Contact for price". From 11 people the client gave a separate price
      // for every headcount, so each one is listed explicitly.
      noGuide: {
        2: 50000, 3: 52000, 4: 54000, 5: 66000, 6: 68000,
        7: 88000, 8: 90000, 9: 92000, 10: 94000,
        11: 110000, 12: 112000, 13: 114000, 14: 116000, 15: 118000,
        16: 120000, 17: 122000, 18: 124000, 19: 126000, 20: 128000,
        extraPerPerson: 2000, maxPeople: 20,
      },
      guide: {
        2: 84000, 3: 86000, 4: 100000, 5: 102000, 6: 122000,
        7: 124000, 8: 126000, 9: 128000, 10: 144000,
        11: 146000, 12: 148000, 13: 150000, 14: 152000, 15: 154000,
        16: 156000, 17: 158000, 18: 160000, 19: 162000,
        extraPerPerson: 2000, maxPeople: 19,
      },
    },
  },
  {
    slug: "noravank-shaki-tatev",
    tourNumber: 6,
    label: "Day Tour",
    category: "day",
    title: "Noravank, Shaki Waterfall, Wings of Tatev Ropeway, Tatev Monastery",
    // DRAFT teaser — the client left this blank.
    desc: "Brick-red Noravank gorge, Shaki Waterfall and the world's longest non-stop ropeway to Tatev Monastery.",
    images: [
      "images/tours/noravank-shaki-tatev/tatev27.webp",
      "images/tours/noravank-shaki-tatev/noravank1.webp",
      "images/tours/noravank-shaki-tatev/shaki1.webp",
      "images/tours/noravank-shaki-tatev/tatev1.webp",
      "images/tours/noravank-shaki-tatev/tatev9.webp",
      "images/tours/noravank-shaki-tatev/tatev25.webp",
    ],
    languages: ["en", "ru", "am"],
    duration: "14-15 hours",
    region: "Yerevan",
    pricing: {
      // NOTE: the client gave no 1-person price, so 1 person shows
      // "Contact for price". Guide: 14 and 15 people are both 188000 in the
      // form — confirm 15 is not a typo (the pattern suggests 190000).
      noGuide: {
        2: 66000, 3: 68000, 4: 70000, 5: 88000, 6: 90000,
        7: 122000, 8: 124000, 9: 126000, 10: 128000,
        11: 154000, 12: 156000, 13: 158000, 14: 160000, 15: 162000,
        16: 164000, 17: 166000, 18: 168000, 19: 170000, 20: 172000,
        extraPerPerson: 2000, maxPeople: 20,
      },
      guide: {
        2: 106000, 3: 108000, 4: 128000, 5: 130000, 6: 150000,
        7: 152000, 8: 154000, 9: 156000, 10: 180000,
        11: 182000, 12: 184000, 13: 186000, 14: 188000, 15: 188000,
        16: 190000, 17: 192000, 18: 194000, 19: 196000,
        extraPerPerson: 2000, maxPeople: 19,
      },
    },
  },

  {
    slug: "khorvirap-birdscave-noravank",
    tourNumber: 7,
    label: "Day Tour",
    category: "day",
    title: "Khor Virap Monastery, Birds' Cave (Areni-1), Noravank Monastery",
    // DRAFT teaser — the client left this blank.
    desc: "Ararat views at Khor Virap, the world's oldest winery in Areni-1 and Noravank's red cliffs.",
    images: [
      "images/tours/noravank-shaki-tatev/noravank7.webp",
      "images/tours/khorvirap-birdscave-noravank/khorvirap1.webp",
      "images/tours/khorvirap-birdscave-noravank/birdscave1.webp",
      "images/tours/noravank-shaki-tatev/noravank1.webp",
      "images/tours/khorvirap-birdscave-noravank/khorvirap3.webp",
      "images/tours/khorvirap-birdscave-noravank/birdscave3.webp",
    ],
    languages: ["en", "ru", "am"],
    duration: "9-10 hours",
    region: "Yerevan",
    pricing: {
      // NOTE: the client gave no 1-person price, so 1 person shows
      // "Contact for price".
      noGuide: {
        2: 38000, 3: 40000, 4: 42000, 5: 54000, 6: 56000,
        7: 66000, 8: 68000, 9: 70000, 10: 72000,
        11: 76000, 12: 78000, 13: 80000, 14: 82000, 15: 84000,
        16: 86000, 17: 88000, 18: 90000, 19: 92000, 20: 94000,
        extraPerPerson: 2000, maxPeople: 20,
      },
      guide: {
        2: 74000, 3: 76000, 4: 88000, 5: 90000, 6: 100000,
        7: 102000, 8: 104000, 9: 106000, 10: 110000,
        11: 112000, 12: 114000, 13: 116000, 14: 118000, 15: 120000,
        16: 122000, 17: 124000, 18: 126000, 19: 128000,
        extraPerPerson: 2000, maxPeople: 19,
      },
    },
  },
];


export function priceFor(pricing, people, withGuide) {
  if (!pricing) return null;
  const table = withGuide ? pricing.guide : pricing.noGuide;
  if (!table) return null;
  if (people < 1 || people > table.maxPeople) return null;
  // An explicit price for this exact headcount always wins.
  if (table[people] != null) return table[people];
  if (people <= 10) return null;
  const base = table[10];
  if (base == null) return null;
  return base + (people - 10) * table.extraPerPerson;
}

// Vehicles, smallest first. `maxSeats` counts EVERYONE who rides in the
// vehicle (travellers + the guide, if there is one; the driver is not counted).
// These limits follow the price jumps in Tour 5's table — change them here and
// every page (tour pages + home calculator) follows.
export const VEHICLES = [
  { id: "sedan", label: "Comfort sedan", maxSeats: 4 },
  { id: "minivan", label: "Minivan", maxSeats: 6 },
  { id: "minibus", label: "Minibus", maxSeats: 10 },
  { id: "sprinter", label: "Sprinter", maxSeats: 20 },
];

// A guide takes a seat, so a tour with a guide needs one seat more.
export function seatsNeeded(people, withGuide) {
  return people + (withGuide ? 1 : 0);
}

export function vehicleFor(people, withGuide) {
  const seats = seatsNeeded(people, withGuide);
  return VEHICLES.find((v) => seats <= v.maxSeats) || VEHICLES[VEHICLES.length - 1];
}

export function vehicleLabel(vehicle) {
  return `${vehicle.label} (up to ${vehicle.maxSeats})`;
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