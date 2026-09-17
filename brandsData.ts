export type Brand = {
  name: string;
  slug: string;
  blurb: string;
  categories: string[];
  highlights: string[];
};

export const BRANDS: Brand[] = [
  {
    name: "APPLE",
    slug: "apple",
    blurb:
      "MacBooks, iPhones and iPads with genuine warranty, setup and data migration handled in store.",
    categories: ["Laptops", "Mobiles", "Accessories"],
    highlights: ["MacBook Air & Pro", "iPhone full range", "iPad & accessories", "Data transfer on purchase"],
  },
  {
    name: "SAMSUNG",
    slug: "samsung",
    blurb:
      "Galaxy phones, tablets and monitors — flagship to budget, with genuine accessories and exchange options.",
    categories: ["Mobiles", "Monitors", "Accessories"],
    highlights: ["Galaxy S & A series", "Tablets & wearables", "Monitors & SSDs", "Exchange available"],
  },
  {
    name: "DELL",
    slug: "dell",
    blurb:
      "Business laptops, workstations and desktops built to run all day, with on-site service support.",
    categories: ["Laptops", "Desktops", "Monitors"],
    highlights: ["Inspiron & Vostro", "XPS & Alienware", "Business desktops", "On-site warranty options"],
  },
  {
    name: "HP",
    slug: "hp",
    blurb:
      "Reliable laptops, all-in-ones and printers for home, office and education, with consumables in stock.",
    categories: ["Laptops", "Desktops", "Printers"],
    highlights: ["Pavilion & Victus", "EliteBook business range", "Printers & cartridges", "AMC for offices"],
  },
  {
    name: "LENOVO",
    slug: "lenovo",
    blurb:
      "ThinkPad durability and IdeaPad value — solid machines for work, study and everything in between.",
    categories: ["Laptops", "Desktops", "Tablets"],
    highlights: ["ThinkPad series", "IdeaPad & Legion", "Tiny desktops", "Bulk orders for offices"],
  },
  {
    name: "ASUS",
    slug: "asus",
    blurb:
      "ROG gaming machines, ZenBooks and motherboards — the core of most custom builds we ship.",
    categories: ["Laptops", "Components", "Gaming"],
    highlights: ["ROG gaming laptops", "ZenBook & VivoBook", "Motherboards & GPUs", "Custom build support"],
  },
  {
    name: "SONY",
    slug: "sony",
    blurb:
      "Audio, cameras and displays from a brand that still gets sound and picture right.",
    categories: ["Audio", "Cameras", "Displays"],
    highlights: ["WH & WF headphones", "Bravia displays", "Alpha cameras", "Genuine accessories"],
  },
  {
    name: "HIKVISION",
    slug: "hikvision",
    blurb:
      "Surveillance systems for homes, shops and offices — cameras, DVRs and full installation.",
    categories: ["CCTV", "Security", "Storage"],
    highlights: ["Dome & bullet cameras", "DVR / NVR systems", "Mobile app viewing", "Installation + AMC"],
  },
  {
    name: "CP PLUS",
    slug: "cp-plus",
    blurb:
      "Value-focused security systems that cover the basics well, with easy service and spares.",
    categories: ["CCTV", "Security"],
    highlights: ["HD camera kits", "Night vision range", "Easy mobile setup", "Affordable AMC"],
  },
  {
    name: "LOGITECH",
    slug: "logitech",
    blurb:
      "Keyboards, mice, webcams and headsets that quietly make every setup better.",
    categories: ["Accessories", "Audio", "Gaming"],
    highlights: ["MX productivity range", "G gaming series", "Webcams & headsets", "Wireless combos"],
  },
  {
    name: "MSI",
    slug: "msi",
    blurb:
      "Gaming laptops, motherboards and graphics cards for builds that need headroom.",
    categories: ["Laptops", "Components", "Gaming"],
    highlights: ["Gaming laptops", "Motherboards", "Graphics cards", "Build & overclock help"],
  },
  {
    name: "ACER",
    slug: "acer",
    blurb:
      "Everyday laptops and monitors that deliver more than their price suggests.",
    categories: ["Laptops", "Monitors", "Gaming"],
    highlights: ["Aspire & Swift", "Nitro & Predator", "Gaming monitors", "Student-friendly pricing"],
  },
];

export const getBrand = (slug: string) => BRANDS.find((b) => b.slug === slug);
