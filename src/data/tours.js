// Central tour manifest: search/filter metadata + tiered pricing.
// Used by the homepage tours search bar AND each individual tour page's
// price calculator, so pricing only lives in one place.
//
// Pricing tables are keyed by exact headcount 1-10 (AMD, total group price —
// not per-person). Beyond 10 people, `extraPerPerson` AMD is added per
// additional person, up to `maxPeople`.
//
// `pricing: null` means real numbers haven't been provided yet — the site
// will show "Contact for price" for that tour until it's filled in.

export const TOURS = [
  {
    slug: "garni-geghard",
    label: "Day Tour",
    title: "Garni, Geghard & Symphony of Stones",
    desc: "Temple, cliffside monastery & basalt gorge in a day. Discover the pre-Christian roots and unique geology of Armenia.",
    image:
      "http://armenia-travel.com/uploads/a/armenia-travel/large/garnitour_8a8fc.jpeg",
    languages: ["en", "ru"],
    duration: "5-6 hours",
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
    slug: "khorvirap-noravank",
    label: "Day Tour",
    title: "Khor Virap, Areni Cave & Noravank",
    desc: "Ararat views, an ancient wine cave & canyon monastery. A journey through the Vayots Dzor wine region.",
    image: "https://images.pexels.com/photos/34146317/pexels-photo-34146317.jpeg?auto=compress&cs=tinysrgb&w=1200",
    languages: ["en", "ru"],
    duration: "8-9 hours",
    pricing: null, // TODO: add tiered pricing (sedan/minivan/minibus/sprinter, guide + no-guide)
  },
  {
    slug: "tatev-syunik",
    label: "Expedition",
    title: "Tatev & Syunik South Expedition",
    desc: "World's longest cable car & a mountain overnight. Explore the rugged beauty of Southern Armenia.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCK_36TTsV_gF1AekA8u6_Ew-906lf2J_7gyWWoGqLqw2QmTMy4OxhlKihZl4_HbigK3wT9aBT3WgAfZl2wOWy7CZuYZinaWHL0YYVMtchBBDtA97sgXwySclHT_UT7wBCUtZHY3NBTPXclNWbo3WPGaKghf0jbmiV7c5wT9-9m8TxyK8FQ1UO2KT6hD5OPon0Cjbz4h0ZeRckUULOy9D0hp0HGk4sBDa2v457Zc7TNhmBDP28JIszQ",
    languages: ["en", "ru"],
    duration: "2 days",
    pricing: null, // TODO: add tiered pricing
  },
];

// Total group price (AMD) for a given tour, headcount, and guide option.
// Returns null if that pricing table doesn't exist (unknown or headcount
// out of range).
export function priceFor(pricing, people, withGuide) {
  if (!pricing) return null;
  const table = withGuide ? pricing.guide : pricing.noGuide;
  if (!table) return null;
  if (people < 1 || people > table.maxPeople) return null;
  if (people <= 10) return table[people];
  return table[10] + (people - 10) * table.extraPerPerson;
}

export function formatAMD(n) {
  return n.toLocaleString("en-US") + " AMD";
}