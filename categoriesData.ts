export type Category = {
  n: string;
  slug: string;
  title: string;
  tag: string;
  img: string;
  copy: string;
  points: string[];
  brands: string;
  items: { name: string; spec: string }[];
};

export const CATEGORIES: Category[] = [
  {
    n: "01",
    slug: "laptops",
    title: "Laptops",
    tag: "Power for every possibility",
    img: "/cat-laptops.jpg",
    copy:
      "Gaming rigs, business ultrabooks and everyday machines — configured, tested and handed over ready to work.",
    points: [
      "Gaming & creator laptops",
      "Business ultrabooks",
      "On-site setup & data transfer",
      "In-house service support",
    ],
    brands: "APPLE · DELL · HP · LENOVO · ASUS · MSI · ACER",
    items: [
      { name: "Gaming Laptops", spec: "RTX graphics · 144Hz+ displays" },
      { name: "Business Ultrabooks", spec: "Light, long battery, warranty" },
      { name: "Student Laptops", spec: "Budget friendly · everyday use" },
      { name: "Creator Machines", spec: "Colour accurate · high RAM" },
      { name: "Refurbished Stock", spec: "Tested · short warranty" },
      { name: "Accessories", spec: "Bags, docks, cooling pads" },
    ],
  },
  {
    n: "02",
    slug: "mobiles",
    title: "Mobiles",
    tag: "Next-gen connectivity",
    img: "/cat-mobiles.jpg",
    copy:
      "Latest flagships and dependable everyday phones, with genuine accessories and real warranty support.",
    points: [
      "Flagship & mid-range phones",
      "Genuine accessories",
      "Screen guard & case fitting",
      "Exchange options available",
    ],
    brands: "APPLE · SAMSUNG · ONEPLUS · VIVO · OPPO · XIAOMI",
    items: [
      { name: "Flagship Phones", spec: "Latest launches in stock" },
      { name: "Mid-range Phones", spec: "Best value picks" },
      { name: "Budget Phones", spec: "Reliable daily drivers" },
      { name: "Tablets", spec: "Study, work and media" },
      { name: "Smart Watches", spec: "Fitness & notifications" },
      { name: "Phone Accessories", spec: "Cases, chargers, guards" },
    ],
  },
  {
    n: "03",
    slug: "cctv",
    title: "CCTV & Security",
    tag: "Watch what matters",
    img: "/cat-cctv.jpg",
    copy:
      "Complete surveillance setups for homes, shops and offices — survey, installation and mobile viewing included.",
    points: [
      "Home & shop camera setups",
      "Night vision & HD systems",
      "Mobile app viewing",
      "Installation + AMC",
    ],
    brands: "HIKVISION · CP PLUS · DAHUA · EZVIZ",
    items: [
      { name: "Home Camera Kits", spec: "2–4 cameras · DVR · install" },
      { name: "Shop & Office Setups", spec: "6–16 cameras · NVR" },
      { name: "Wireless Cameras", spec: "Wi-Fi · app controlled" },
      { name: "Night Vision Range", spec: "Colour at night" },
      { name: "Storage & DVR", spec: "Surveillance-grade drives" },
      { name: "AMC & Service", spec: "Yearly maintenance plans" },
    ],
  },
  {
    n: "04",
    slug: "gadgets",
    title: "Gadgets",
    tag: "Gear up. Stay ahead.",
    img: "/cat-gadgets.jpg",
    copy:
      "Keyboards, headsets, storage, smart devices — everything that makes your setup actually work the way you want.",
    points: [
      "Audio & headsets",
      "Keyboards, mice, monitors",
      "Storage & networking",
      "Smart home devices",
    ],
    brands: "LOGITECH · RAZER · CORSAIR · BOAT · JBL · WD · SEAGATE",
    items: [
      { name: "Headphones & Earbuds", spec: "Wired and wireless" },
      { name: "Keyboards & Mice", spec: "Mechanical & wireless combos" },
      { name: "Monitors", spec: "Office, gaming, colour work" },
      { name: "Storage", spec: "SSD, HDD, pen drives" },
      { name: "Networking", spec: "Routers, extenders, cables" },
      { name: "Smart Devices", spec: "Speakers, plugs, lights" },
    ],
  },
];

export const getCategory = (slug: string) =>
  CATEGORIES.find((c) => c.slug === slug);
