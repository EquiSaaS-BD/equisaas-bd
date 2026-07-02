const DISTRICTS = {
  barguna: { id: "barguna", nameBn: "বরগুনা", nameEn: "Barguna" },
  barisal: { id: "barisal", nameBn: "বরিশাল", nameEn: "Barisal" },
  bhola: { id: "bhola", nameBn: "ভোলা", nameEn: "Bhola" },
  jhalokati: { id: "jhalokati", nameBn: "ঝালকাঠি", nameEn: "Jhalokati" },
  patuakhali: { id: "patuakhali", nameBn: "পটুয়াখালী", nameEn: "Patuakhali" },
  pirojpur: { id: "pirojpur", nameBn: "পিরোজপুর", nameEn: "Pirojpur" },
  bandarban: { id: "bandarban", nameBn: "বান্দরবান", nameEn: "Bandarban" },
  brahmanbaria: { id: "brahmanbaria", nameBn: "ব্রাহ্মণবাড়িয়া", nameEn: "Brahmanbaria" },
  chandpur: { id: "chandpur", nameBn: "চাঁদপুর", nameEn: "Chandpur" },
  chattogram: { id: "chattogram", nameBn: "চট্টগ্রাম", nameEn: "Chattogram" },
  comilla: { id: "comilla", nameBn: "কুমিল্লা", nameEn: "Cumilla" },
  "coxs-bazar": { id: "coxs-bazar", nameBn: "কক্সবাজার", nameEn: "Cox's Bazar" },
  feni: { id: "feni", nameBn: "ফেনী", nameEn: "Feni" },
  khagrachhari: { id: "khagrachhari", nameBn: "খাগড়াছড়ি", nameEn: "Khagrachhari" },
  lakshmipur: { id: "lakshmipur", nameBn: "লক্ষ্মীপুর", nameEn: "Lakshmipur" },
  noakhali: { id: "noakhali", nameBn: "নোয়াখালী", nameEn: "Noakhali" },
  rangamati: { id: "rangamati", nameBn: "রাঙ্গামাটি", nameEn: "Rangamati" },
  dhaka: { id: "dhaka", nameBn: "ঢাকা", nameEn: "Dhaka" },
  faridpur: { id: "faridpur", nameBn: "ফরিদপুর", nameEn: "Faridpur" },
  gazipur: { id: "gazipur", nameBn: "গাজীপুর", nameEn: "Gazipur" },
  gopalganj: { id: "gopalganj", nameBn: "গোপালগঞ্জ", nameEn: "Gopalganj" },
  kishoreganj: { id: "kishoreganj", nameBn: "কিশোরগঞ্জ", nameEn: "Kishoreganj" },
  madaripur: { id: "madaripur", nameBn: "মাদারীপুর", nameEn: "Madaripur" },
  manikganj: { id: "manikganj", nameBn: "মানিকগঞ্জ", nameEn: "Manikganj" },
  munshiganj: { id: "munshiganj", nameBn: "মুন্সিগঞ্জ", nameEn: "Munshiganj" },
  narayanganj: { id: "narayanganj", nameBn: "নারায়ণগঞ্জ", nameEn: "Narayanganj" },
  narsingdi: { id: "narsingdi", nameBn: "নরসিংদী", nameEn: "Narsingdi" },
  rajbari: { id: "rajbari", nameBn: "রাজবাড়ী", nameEn: "Rajbari" },
  shariatpur: { id: "shariatpur", nameBn: "শরীয়তপুর", nameEn: "Shariatpur" },
  tangail: { id: "tangail", nameBn: "টাঙ্গাইল", nameEn: "Tangail" },
  bagerhat: { id: "bagerhat", nameBn: "বাগেরহাট", nameEn: "Bagerhat" },
  chuadanga: { id: "chuadanga", nameBn: "চুয়াডাঙ্গা", nameEn: "Chuadanga" },
  jessore: { id: "jessore", nameBn: "যশোর", nameEn: "Jashore" },
  jhenaidah: { id: "jhenaidah", nameBn: "ঝিনাইদহ", nameEn: "Jhenaidah" },
  khulna: { id: "khulna", nameBn: "খুলনা", nameEn: "Khulna" },
  kushtia: { id: "kushtia", nameBn: "কুষ্টিয়া", nameEn: "Kushtia" },
  magura: { id: "magura", nameBn: "মাগুরা", nameEn: "Magura" },
  meherpur: { id: "meherpur", nameBn: "মেহেরপুর", nameEn: "Meherpur" },
  narail: { id: "narail", nameBn: "নড়াইল", nameEn: "Narail" },
  satkhira: { id: "satkhira", nameBn: "সাতক্ষীরা", nameEn: "Satkhira" },
  jamalpur: { id: "jamalpur", nameBn: "জামালপুর", nameEn: "Jamalpur" },
  mymensingh: { id: "mymensingh", nameBn: "ময়মনসিংহ", nameEn: "Mymensingh" },
  netrokona: { id: "netrokona", nameBn: "নেত্রকোণা", nameEn: "Netrokona" },
  sherpur: { id: "sherpur", nameBn: "শেরপুর", nameEn: "Sherpur" },
  bogura: { id: "bogura", nameBn: "বগুড়া", nameEn: "Bogura" },
  "chapai-nawabganj": { id: "chapai-nawabganj", nameBn: "চাঁপাইনবাবগঞ্জ", nameEn: "Chapai Nawabganj" },
  joypurhat: { id: "joypurhat", nameBn: "জয়পুরহাট", nameEn: "Joypurhat" },
  naogaon: { id: "naogaon", nameBn: "নওগাঁ", nameEn: "Naogaon" },
  natore: { id: "natore", nameBn: "নাটোর", nameEn: "Natore" },
  pabna: { id: "pabna", nameBn: "পাবনা", nameEn: "Pabna" },
  rajshahi: { id: "rajshahi", nameBn: "রাজশাহী", nameEn: "Rajshahi" },
  sirajganj: { id: "sirajganj", nameBn: "সিরাজগঞ্জ", nameEn: "Sirajganj" },
  dinajpur: { id: "dinajpur", nameBn: "দিনাজপুর", nameEn: "Dinajpur" },
  gaibandha: { id: "gaibandha", nameBn: "গাইবান্ধা", nameEn: "Gaibandha" },
  kurigram: { id: "kurigram", nameBn: "কুড়িগ্রাম", nameEn: "Kurigram" },
  lalmonirhat: { id: "lalmonirhat", nameBn: "লালমনিরহাট", nameEn: "Lalmonirhat" },
  nilphamari: { id: "nilphamari", nameBn: "নীলফামারী", nameEn: "Nilphamari" },
  panchagarh: { id: "panchagarh", nameBn: "পঞ্চগড়", nameEn: "Panchagarh" },
  rangpur: { id: "rangpur", nameBn: "রংপুর", nameEn: "Rangpur" },
  thakurgaon: { id: "thakurgaon", nameBn: "ঠাকুরগাঁও", nameEn: "Thakurgaon" },
  habiganj: { id: "habiganj", nameBn: "হবিগঞ্জ", nameEn: "Habiganj" },
  maulvibazar: { id: "maulvibazar", nameBn: "মৌলভীবাজার", nameEn: "Maulvibazar" },
  sunamganj: { id: "sunamganj", nameBn: "সুনামগঞ্জ", nameEn: "Sunamganj" },
  sylhet: { id: "sylhet", nameBn: "সিলেট", nameEn: "Sylhet" }
};

const DIVISION_COLORS = {
  sky: {
    badge: "bg-sky-500/10 text-sky-700 border-sky-500/20",
    node: "bg-sky-500 text-white shadow-sky-500/20",
    halo: "bg-sky-500/10"
  },
  emerald: {
    badge: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
    node: "bg-emerald-500 text-white shadow-emerald-500/20",
    halo: "bg-emerald-500/10"
  },
  amber: {
    badge: "bg-amber-500/10 text-amber-700 border-amber-500/20",
    node: "bg-amber-500 text-white shadow-amber-500/20",
    halo: "bg-amber-500/10"
  },
  rose: {
    badge: "bg-rose-500/10 text-rose-700 border-rose-500/20",
    node: "bg-rose-500 text-white shadow-rose-500/20",
    halo: "bg-rose-500/10"
  },
  violet: {
    badge: "bg-violet-500/10 text-violet-700 border-violet-500/20",
    node: "bg-violet-500 text-white shadow-violet-500/20",
    halo: "bg-violet-500/10"
  },
  indigo: {
    badge: "bg-indigo-500/10 text-indigo-700 border-indigo-500/20",
    node: "bg-indigo-500 text-white shadow-indigo-500/20",
    halo: "bg-indigo-500/10"
  },
  teal: {
    badge: "bg-teal-500/10 text-teal-700 border-teal-500/20",
    node: "bg-teal-500 text-white shadow-teal-500/20",
    halo: "bg-teal-500/10"
  },
  cyan: {
    badge: "bg-cyan-500/10 text-cyan-700 border-cyan-500/20",
    node: "bg-cyan-500 text-white shadow-cyan-500/20",
    halo: "bg-cyan-500/10"
  }
};

const DIVISION_LAYOUTS = [
  {
    id: "rangpur",
    nameBn: "রংপুর বিভাগ",
    nameEn: "Rangpur Division",
    color: "sky",
    anchorX: 22,
    anchorY: 12,
    columns: 3,
    districts: ["panchagarh", "thakurgaon", "dinajpur", "nilphamari", "lalmonirhat", "rangpur", "gaibandha", "kurigram"]
  },
  {
    id: "rajshahi",
    nameBn: "রাজশাহী বিভাগ",
    nameEn: "Rajshahi Division",
    color: "amber",
    anchorX: 21,
    anchorY: 33,
    columns: 4,
    districts: ["chapai-nawabganj", "rajshahi", "naogaon", "joypurhat", "natore", "pabna", "bogura", "sirajganj"]
  },
  {
    id: "khulna",
    nameBn: "খুলনা বিভাগ",
    nameEn: "Khulna Division",
    color: "rose",
    anchorX: 25,
    anchorY: 60,
    columns: 4,
    districts: ["satkhira", "jessore", "narail", "khulna", "bagerhat", "jhenaidah", "magura", "kushtia", "chuadanga", "meherpur"]
  },
  {
    id: "barishal",
    nameBn: "বরিশাল বিভাগ",
    nameEn: "Barishal Division",
    color: "teal",
    anchorX: 48,
    anchorY: 77,
    columns: 3,
    districts: ["jhalokati", "barisal", "bhola", "barguna", "patuakhali", "pirojpur"]
  },
  {
    id: "mymensingh",
    nameBn: "ময়মনসিংহ বিভাগ",
    nameEn: "Mymensingh Division",
    color: "indigo",
    anchorX: 53,
    anchorY: 15,
    columns: 2,
    districts: ["sherpur", "jamalpur", "mymensingh", "netrokona"]
  },
  {
    id: "dhaka",
    nameBn: "ঢাকা বিভাগ",
    nameEn: "Dhaka Division",
    color: "violet",
    anchorX: 50,
    anchorY: 35,
    columns: 4,
    districts: ["tangail", "gazipur", "kishoreganj", "narsingdi", "manikganj", "dhaka", "narayanganj", "munshiganj", "faridpur", "rajbari", "gopalganj", "madaripur", "shariatpur"]
  },
  {
    id: "sylhet",
    nameBn: "সিলেট বিভাগ",
    nameEn: "Sylhet Division",
    color: "cyan",
    anchorX: 76,
    anchorY: 18,
    columns: 2,
    districts: ["sunamganj", "sylhet", "maulvibazar", "habiganj"]
  },
  {
    id: "chattogram",
    nameBn: "চট্টগ্রাম বিভাগ",
    nameEn: "Chattogram Division",
    color: "emerald",
    anchorX: 73,
    anchorY: 49,
    columns: 4,
    districts: ["brahmanbaria", "comilla", "chandpur", "lakshmipur", "feni", "noakhali", "chattogram", "khagrachhari", "rangamati", "bandarban", "coxs-bazar"]
  }
];

function buildDistrictNodes(division) {
  const spacingX = 6;
  const spacingY = 6.5;
  return division.districts.map((districtId, index) => {
    const district = DISTRICTS[districtId];
    const row = Math.floor(index / division.columns);
    const col = index % division.columns;
    const rowSize = Math.min(division.columns, division.districts.length - row * division.columns);
    const xOffset = (col - (rowSize - 1) / 2) * spacingX + (row % 2 === 1 ? 1.5 : 0);
    const yOffset = row * spacingY;
    return {
      ...district,
      divisionId: division.id,
      x: Number((division.anchorX + xOffset).toFixed(2)),
      y: Number((division.anchorY + yOffset).toFixed(2))
    };
  });
}

export const DISTRICT_MAP_DIVISIONS = DIVISION_LAYOUTS.map((division) => ({
  id: division.id,
  nameBn: division.nameBn,
  nameEn: division.nameEn,
  colors: DIVISION_COLORS[division.color] || DIVISION_COLORS.sky,
  districts: buildDistrictNodes(division)
}));

export const DISTRICT_MAP_NODES = DISTRICT_MAP_DIVISIONS.flatMap((division) => division.districts);

const DISTRICT_BY_ID = Object.fromEntries(DISTRICT_MAP_NODES.map((district) => [district.id, district]));

export function getDistrictNode(id) {
  return id ? DISTRICT_BY_ID[id] || null : null;
}

export function formatDistrictLabel(id, lang = "en") {
  const district = getDistrictNode(id);
  if (!district) return "";
  return lang === "bn" ? district.nameBn : district.nameEn;
}
