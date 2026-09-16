// Single source of truth for business details, links and integrations.
// Edit here once; header, footer, forms, SEO tags and structured data follow.
export const SITE = {
  name: "Upupa Travel",
  legalName: "Upupa Travel",
  tagline: "Private guides in Armenia",
  description:
    "Private guide service in Yerevan. Day trips and multi-day journeys to Armenia's monasteries, volcanic highlands and hidden valleys, led by local guides.",

  // Public address of the live site (used for canonical + share tags).
  url: "https://bberrium.github.io/Upupa-Travel",

  // --- Contact ------------------------------------------------------------
  email: "info@upupatravel.com",
  phoneDisplay: "+374 95 988 188",
  phoneE164: "+37495988188",
  whatsapp: "https://wa.me/37495988188",
  city: "Yerevan",
  country: "AM",
  languages: ["English", "Russian", "Armenian"],

  // --- Logo ---------------------------------------------------------------
  // "lockup" — the hoopoe mark beside a typeset "UPUPA TRAVEL" wordmark.
  //            Recommended: at the same header height the brand name reads
  //            roughly 3x larger than it does inside the circular badge, and
  //            live text stays razor sharp on every screen.
  // "badge"  — the original circular badge image, shown large.
  //            Use it if the client insists on the badge itself; the header
  //            grows taller to keep the arched text legible.
  logo: {
    style: "lockup",
    wordmark: "UPUPA TRAVEL",
    taglineLead: "discover",
    taglineName: "ARMENIA",
  },

  // --- Social -------------------------------------------------------------
  // Leave a value empty and the link disappears instead of rendering href="#".
  social: {
    instagram: "",
    facebook: "",
    tripadvisor: "",
  },

  // --- Forms --------------------------------------------------------------
  // Paste a Formspree / Getform / Web3Forms endpoint here and both forms start
  // working. Empty string = forms fall back to opening the visitor's mail app,
  // so an enquiry is never silently lost.
  formEndpoint: "",

  // Netlify Forms: set to true if you deploy on Netlify instead.
  netlifyForms: false,
};

export const SOCIAL_LINKS = Object.entries(SITE.social)
  .filter(([, href]) => Boolean(href))
  .map(([key, href]) => ({
    key,
    href,
    label: key.charAt(0).toUpperCase() + key.slice(1).replace("advisor", "Advisor"),
  }));
