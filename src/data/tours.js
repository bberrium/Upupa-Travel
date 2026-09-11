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
    images: [
      "https://janarmenia.com/uploads/0000/32/2023/01/24/armenia-garni.webp",
      "https://armeniaplanet.com/Content/Img/Sight/monument/arch-of-charents/1.jpg",
      "https://lh3.googleusercontent.com/gps-cs-s/AHRPTWkqHmX-eyncB-b4Cp0hnSgzqK2UiNr_leZsUaa6V2hq90zeWLS9f3x0Akdk0VtFztBtV9O49pLixF_NhuJ5vEt2DwBoDg1aZW2lcARwQkjqDJE8z-JbFwmg6m8TPupUUI0-BsTZ=s680-w680-h510-rw",
      "https://www.armeniaplanet.com/Content/Img/sight/natural/mount/symphony-of-stones/4.jpg",
    ],
    languages: ["en", "ru", "am"],
    duration: "5-6 hours",
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
    slug: "sevan-dilijan",
    label: "Day Tour",
    title: "Lake Sevan, Sevanavank, Dilijan, Goshavank, Haghartsin",
    desc: "Explore the 'Blue Pearl of Armenia' and discover medieval monasteries hidden deep within the lush forests of the Armenian Switzerland.",
    images: [
      "https://scontent.fevn1-1.fna.fbcdn.net/v/t39.30808-6/786470446_28615325578059990_7028218772950370974_n.jpg?stp=dst-jpg_tt6&cstp=mx2048x1536&ctp=s2048x1536&_nc_cat=111&ccb=1-7&_nc_sid=833d8c&_nc_ohc=VPRSOhmJv-0Q7kNvwHfVIUg&_nc_oc=AdqD7bLtIeQquovzpzlGpUHTiwA2NLO6UaXzdjC_wr9tT-UMbP-pbV8GtCT3Mr4y3QI&_nc_zt=23&_nc_ht=scontent.fevn1-1.fna&_nc_gid=H7Z-jJwyq2N_pGn8AZpC0w&_nc_ss=7b2a8&oh=00_AQJtiSZZRVo99EX2Z-iz9z8YHsH700ANYKm-wisy0tyYpA&oe=6AA61BD6",
      "https://scontent.fevn1-1.fna.fbcdn.net/v/t39.30808-6/786315444_28615366024722612_1781015908407719212_n.jpg?stp=dst-jpg_tt6&cstp=mx2048x1536&ctp=s2048x1536&_nc_cat=107&ccb=1-7&_nc_sid=833d8c&_nc_ohc=7wpiWCJYZ8YQ7kNvwFlVTo7&_nc_oc=AdqXmprX13klrbimQFJuk0AVhkjHZ64NhowXwNcJOkCejWfpUAaM0QV7iTMbWl0a-bo&_nc_zt=23&_nc_ht=scontent.fevn1-1.fna&_nc_gid=a0sdcma9kLmR0hFftGU5rg&_nc_ss=7b2a8&oh=00_AQK7MjZubVtYes2JFEfLI7mctOwVsUJCapiNDO3_ObG7yQ&oe=6AA6B9DF",
      "https://scontent.fevn1-1.fna.fbcdn.net/v/t39.30808-6/787557697_28616783727914175_6617701244682080060_n.jpg?stp=dst-jpg_tt6&cstp=mx2048x1536&ctp=s2048x1536&_nc_cat=101&ccb=1-7&_nc_sid=833d8c&_nc_ohc=3BCBuI42ChUQ7kNvwEHavbL&_nc_oc=AdqyJm3frJO2EXaeh99a6RC8Y9X33MpSHGhL7CUpFgRXNwv6vP-HJIlalgUZ-pA0GxY&_nc_zt=23&_nc_ht=scontent.fevn1-1.fna&_nc_gid=Pt558nIVQQLoAIF3_GpxGA&_nc_ss=7b2a8&oh=00_AQIb8GBgQpm9qukuf1xd0uylRjxuNk8Oc3fDn2PXNtMWmQ&oe=6AA64191"
    ],
    duration: "9-10 hours",
    region: "Yerevan",
    languages: ["en", "ru", "am"],
    pricing: {
      noGuide: {
        1: 44000, 2: 44000, 3: 46000, 4: 48000, 5: 54000, 
        6: 56000, 7: 66000, 8: 68000, 9: 70000, 10: 78000,
        extraPerPerson: 2000,
        maxPeople: 20
      },
      guide: {
        1: 74000, 2: 74000, 3: 76000, 4: 78000, 5: 84000, 
        6: 86000, 7: 96000, 8: 98000, 9: 100000, 10: 108000,
        extraPerPerson: 2000,
        maxPeople: 20
      }
    }
  }
];

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