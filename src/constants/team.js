/**
 * STATIC_MEMBERS — always shown at the top for every order.
 * These never change based on API data.
 */
export const STATIC_MEMBERS = [
  {
    id: "founder",
    role: "Founder & Head Designer",
    name: "Neelima Babber",
    icon: "👑",
    description:
      "Neelima Babber started Qurvii with a vision to make fashion truly inclusive and confidence boosting for every woman. She leads the design team with a focus on flattering fits, thoughtful details, and styles that celebrate women across sizes XXS to 5XL.",
    gradient: "from-pink-500 to-rose-500",
    bgLight: "bg-pink-50",
    textColor: "text-pink-700",
    borderColor: "border-pink-200",
    isStatic: true,
  },
  {
    id: "senior_designer",
    role: "Senior Designer",
    name: "Parul Gupta",
    icon: "🎨",
    description:
      "Parul Gupta designs styles that blend trend, comfort, and confidence in every Qurvii piece.",
    gradient: "from-fuchsia-400 to-pink-400",
    bgLight: "bg-fuchsia-50",
    textColor: "text-fuchsia-700",
    borderColor: "border-fuchsia-200",
    isStatic: true,
  },
  {
    id: "assistant_designer",
    role: "Assistant Designer",
    name: "Annu Jain",
    icon: "✏️",
    description:
      "Annu Jain supports the design process by helping turn creative ideas into thoughtfully crafted Qurvii styles.",
    gradient: "from-purple-400 to-violet-500",
    bgLight: "bg-purple-50",
    textColor: "text-purple-700",
    borderColor: "border-purple-200",
    isStatic: true,
  },
  {
    id: "pattern_master",
    role: "Pattern Master",
    name: "Bhoop Singh",
    icon: "📐",
    description:
      "Bhoop Singh creates and grades every pattern with precision to ensure the perfect fit, comfort, and silhouette across all Qurvii sizes.",
    gradient: "from-indigo-400 to-blue-500",
    bgLight: "bg-indigo-50",
    textColor: "text-indigo-700",
    borderColor: "border-indigo-200",
    isStatic: true,
  },
  {
    id: "sample_tailor",
    role: "Sample Tailor",
    name: "Indrish",
    icon: "🪡",
    description:
      "Indrish brings new patterns to life by stitching the very first sample garment, helping transform ideas into wearable designs.",
    gradient: "from-blue-400 to-cyan-400",
    bgLight: "bg-blue-50",
    textColor: "text-blue-700",
    borderColor: "border-blue-200",
    isStatic: true,
  },
];

/**
 * TEAM_ROLES — dynamic roles resolved from the API per order.
 *
 * locationKeys: lowercase location names from the API `locations.name` field.
 *               The first match found in the scanned records wins.
 * defaultName:  fallback shown when no scan found for this role.
 */
export const TEAM_ROLES = [
  {
    id: "store_helper",
    role: "Store Helper",
    locationKeys: ["store helper"],
    defaultName: "Sneha",
    icon: "🧺",
    description: (name) =>
      `${name} manages and provides the fabrics, trims, and materials needed to bring every Qurvii outfit to life.`,
    gradient: "from-amber-400 to-orange-400",
    bgLight: "bg-amber-50",
    textColor: "text-amber-700",
    borderColor: "border-amber-200",
    isStatic: false,
  },
  {
    id: "production_flow",
    role: "Production Flow",
    locationKeys: ["cuting helper", "cutting helper"],
    defaultName: "Sanjeet",
    icon: "⚙️",
    description: (name) =>
      `${name} manages the movement of fabrics and garments through cutting, stitching, and finishing to keep every Qurvii outfit moving smoothly through production.`,
    gradient: "from-rose-400 to-pink-500",
    bgLight: "bg-rose-50",
    textColor: "text-rose-700",
    borderColor: "border-rose-200",
    isStatic: false,
  },
  {
    id: "cutting_master",
    role: "Cutting Master",
    locationKeys: ["cutting master"],
    defaultName: "Mahesh",
    icon: "✂️",
    description: (name) =>
      `${name} carefully traces patterns and cuts every fabric with precision to ensure each Qurvii outfit is crafted accurately from the very first step.`,
    gradient: "from-sky-400 to-cyan-400",
    bgLight: "bg-sky-50",
    textColor: "text-sky-700",
    borderColor: "border-sky-200",
    isStatic: false,
  },
  {
    id: "tailor",
    role: "Tailor",
    locationKeys: ["tailor scan 2"],
    defaultName: "Shamshool",
    icon: "🧵",
    description: (name) =>
      `${name} transforms flat pieces of fabric into beautifully shaped garments, giving every Qurvii outfit its final form and fit.`,
    gradient: "from-violet-400 to-purple-500",
    bgLight: "bg-violet-50",
    textColor: "text-violet-700",
    borderColor: "border-violet-200",
    isStatic: false,
  },
  {
    id: "finishing_team",
    role: "Finishing Team",
    locationKeys: ["dhaga cutting"],
    defaultName: "Shahjahan",
    icon: "✨",
    description: (name) =>
      `${name} adds the final touches to every outfit by cutting extra threads, attaching buttons, and preparing each Qurvii piece before it reaches you.`,
    gradient: "from-emerald-400 to-teal-400",
    bgLight: "bg-emerald-50",
    textColor: "text-emerald-700",
    borderColor: "border-emerald-200",
    isStatic: false,
  },
  {
    id: "quality_check",
    role: "Quality Check Team",
    locationKeys: ["final checking"],
    defaultName: "Satinder Soni",
    icon: "🔍",
    description: (name) =>
      `${name} carefully checks every garment for fit, stitching, finishing, and style details to ensure each Qurvii outfit meets our quality standards.`,
    gradient: "from-teal-400 to-green-500",
    bgLight: "bg-teal-50",
    textColor: "text-teal-700",
    borderColor: "border-teal-200",
    isStatic: false,
  },
  {
    id: "operation_team",
    role: "Operations Team",
    locationKeys: ["shipping table"],
    defaultName: "Tanishq",
    icon: "📦",
    description: (name) =>
      `${name} carefully packs and ships every Qurvii order, making sure each outfit reaches you safely and with care.`,
    gradient: "from-orange-400 to-amber-500",
    bgLight: "bg-orange-50",
    textColor: "text-orange-700",
    borderColor: "border-orange-200",
    isStatic: false,
  },
];

/**
 * Location names that are intentionally ignored (not shown in the timeline).
 */
export const IGNORED_LOCATIONS = ["kharcha", "kaaj", "ironing & packing"];
