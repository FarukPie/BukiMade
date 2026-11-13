import type { L } from "./i18n";

export type Category = "bracelet" | "necklace" | "earrings" | "anklet";
export type Pattern = "square" | "spiral" | "chevron";

export type Art = {
  kind: Category;
  cord: string;
  accent: string;
  bead: string;
  pattern: Pattern;
  bg: [string, string];
};

export type Product = {
  slug: string;
  name: L;
  category: Category;
  price: number;
  short: L;
  description: L;
  materials: L[];
  size: L;
  art: Art;
  /** Gerçek fotoğraflar: public/images/products/... yolları. Boşsa illüstrasyon gösterilir. */
  images?: string[];
  isNew?: boolean;
  isBestseller?: boolean;
  oneOfAKind?: boolean;
};

export const categories: { id: Category; label: L }[] = [
  { id: "bracelet", label: { tr: "Bileklik", en: "Bracelets" } },
  { id: "necklace", label: { tr: "Kolye", en: "Necklaces" } },
  { id: "earrings", label: { tr: "Küpe", en: "Earrings" } },
  { id: "anklet", label: { tr: "Halhal", en: "Anklets" } },
];

/** Özel sipariş için seçilebilir ip renkleri */
export const cordColors: { id: string; hex: string; label: L }[] = [
  { id: "terracotta", hex: "#c2643c", label: { tr: "Kiremit", en: "Terracotta" } },
  { id: "sand", hex: "#e3cba8", label: { tr: "Kum", en: "Sand" } },
  { id: "sage", hex: "#8a9a5b", label: { tr: "Adaçayı", en: "Sage" } },
  { id: "mustard", hex: "#d9a441", label: { tr: "Hardal", en: "Mustard" } },
  { id: "sea", hex: "#3f8f8c", label: { tr: "Deniz", en: "Sea" } },
  { id: "lilac", hex: "#a68bb8", label: { tr: "Lila", en: "Lilac" } },
  { id: "indigo", hex: "#34416e", label: { tr: "Gece Mavisi", en: "Indigo" } },
  { id: "rose", hex: "#d98f8f", label: { tr: "Gül Kurusu", en: "Dusty Rose" } },
];

export const beadOptions: { id: string; hex: string; label: L }[] = [
  { id: "wood", hex: "#8b5a3c", label: { tr: "Ahşap", en: "Wood" } },
  { id: "gold", hex: "#d4af37", label: { tr: "Altın Kaplama", en: "Gold Plated" } },
  { id: "amethyst", hex: "#8e5ba6", label: { tr: "Ametist", en: "Amethyst" } },
  { id: "turquoise", hex: "#40b5ad", label: { tr: "Turkuaz", en: "Turquoise" } },
  { id: "pearl", hex: "#f3ece0", label: { tr: "İnci", en: "Pearl" } },
];

export const products: Product[] = [
  {
    slug: "toprak-ana-bileklik",
    name: { tr: "Toprak Ana", en: "Mother Earth" },
    category: "bracelet",
    price: 340,
    short: { tr: "Ahşap boncuklu kiremit makrome bileklik", en: "Terracotta macramé bracelet with wooden beads" },
    description: {
      tr: "Anadolu topraklarının sıcak tonlarından ilham alan bu bileklik, yüzlerce düğümün sabırla bir araya gelmesiyle doğdu. Ayarlanabilir kayar düğümü sayesinde her bileğe kusursuz oturur.",
      en: "Inspired by the warm hues of Anatolian soil, this bracelet was born from hundreds of patiently tied knots. Its adjustable sliding knot fits every wrist perfectly.",
    },
    materials: [
      { tr: "%100 pamuk makrome ip", en: "100% cotton macramé cord" },
      { tr: "Doğal ceviz ağacı boncuk", en: "Natural walnut wood beads" },
    ],
    size: { tr: "Ayarlanabilir · 15–21 cm", en: "Adjustable · 15–21 cm" },
    art: { kind: "bracelet", cord: "#c2643c", accent: "#e3cba8", bead: "#8b5a3c", pattern: "square", bg: ["#f6e3cf", "#e9b896"] },
    isBestseller: true,
  },
  {
    slug: "ege-esintisi-bileklik",
    name: { tr: "Ege Esintisi", en: "Aegean Breeze" },
    category: "bracelet",
    price: 290,
    short: { tr: "Deniz kabuklu turkuaz zikzak bileklik", en: "Turquoise chevron bracelet with seashell" },
    description: {
      tr: "Bodrum kıyılarında topladığım deniz kabuklarıyla süslenen, dalgaları andıran zikzak örgülü bir bileklik. Yazın tuzlu kokusunu bileğinizde taşıyın.",
      en: "A chevron-woven bracelet resembling waves, adorned with seashells collected on the shores of Bodrum. Carry the salty scent of summer on your wrist.",
    },
    materials: [
      { tr: "Mumlu pamuk ip", en: "Waxed cotton cord" },
      { tr: "Doğal deniz kabuğu", en: "Natural seashell" },
    ],
    size: { tr: "Ayarlanabilir · 15–20 cm", en: "Adjustable · 15–20 cm" },
    art: { kind: "bracelet", cord: "#3f8f8c", accent: "#f3ece0", bead: "#f3ece0", pattern: "chevron", bg: ["#e2f0ec", "#9fd0c6"] },
    isNew: true,
  },
  {
    slug: "gunes-kolye",
    name: { tr: "Güneş", en: "Sun" },
    category: "necklace",
    price: 520,
    short: { tr: "Sitrin taşlı spiral makrome kolye", en: "Spiral macramé necklace with citrine" },
    description: {
      tr: "Merkezinde parlayan sitrin taşı, etrafını saran spiral düğümlerle küçük bir güneşe dönüşüyor. Her biri tek tek elde örülen bu kolye, bolluk ve neşenin sembolü.",
      en: "The citrine glowing at its heart becomes a tiny sun, embraced by spiral knots. Each one hand-woven, this necklace is a symbol of abundance and joy.",
    },
    materials: [
      { tr: "Pamuk makrome ip", en: "Cotton macramé cord" },
      { tr: "Doğal sitrin taşı", en: "Natural citrine stone" },
      { tr: "Altın kaplama aparat", en: "Gold-plated findings" },
    ],
    size: { tr: "Zincir boyu 45 cm · Uç 4 cm", en: "Length 45 cm · Pendant 4 cm" },
    art: { kind: "necklace", cord: "#d9a441", accent: "#c2643c", bead: "#f2c14e", pattern: "spiral", bg: ["#fbefd5", "#f0c987"] },
    isBestseller: true,
    oneOfAKind: true,
  },
  {
    slug: "orman-yolu-kolye",
    name: { tr: "Orman Yolu", en: "Forest Path" },
    category: "necklace",
    price: 480,
    short: { tr: "Yeşim boncuklu adaçayı kolye", en: "Sage necklace with jade bead" },
    description: {
      tr: "Sabah çiyinde bir orman yürüyüşünün huzuru. Adaçayı yeşili ip ve yeşim taşı, sizi doğaya bağlayan sakin bir eşlikçi.",
      en: "The calm of a forest walk in morning dew. Sage-green cord and jade stone make a peaceful companion connecting you to nature.",
    },
    materials: [
      { tr: "Organik pamuk ip", en: "Organic cotton cord" },
      { tr: "Yeşim taşı", en: "Jade stone" },
    ],
    size: { tr: "Ayarlanabilir · 40–60 cm", en: "Adjustable · 40–60 cm" },
    art: { kind: "necklace", cord: "#8a9a5b", accent: "#e3cba8", bead: "#5e8c61", pattern: "square", bg: ["#eaefdc", "#bccb9a"] },
  },
  {
    slug: "gun-batimi-kupe",
    name: { tr: "Gün Batımı", en: "Sunset" },
    category: "earrings",
    price: 260,
    short: { tr: "İki tonlu püsküllü makrome küpe", en: "Two-tone fringe macramé earrings" },
    description: {
      tr: "Kiremit ve hardalın ufukta buluştuğu o an. Hafif yapısıyla bütün gün rahatça takabileceğiniz, hareket ettikçe dans eden püsküller.",
      en: "That moment terracotta meets mustard on the horizon. Lightweight for all-day comfort, with fringes that dance as you move.",
    },
    materials: [
      { tr: "Yumuşak pamuk ip", en: "Soft cotton cord" },
      { tr: "Nikel içermeyen kanca", en: "Nickel-free hooks" },
    ],
    size: { tr: "Uzunluk 7 cm", en: "Length 7 cm" },
    art: { kind: "earrings", cord: "#c2643c", accent: "#d9a441", bead: "#d4af37", pattern: "chevron", bg: ["#f9e0cf", "#eda97f"] },
    isNew: true,
  },
  {
    slug: "kum-tepesi-kupe",
    name: { tr: "Kum Tepesi", en: "Dune" },
    category: "earrings",
    price: 240,
    short: { tr: "Altın boncuklu krem püskül küpe", en: "Cream fringe earrings with gold bead" },
    description: {
      tr: "Çölün sessiz zarafeti. Krem tonlu yumuşak püsküller ve altın kaplama boncuk, hem gündüz hem gece kombinlerinize uyum sağlar.",
      en: "The quiet elegance of the desert. Soft cream fringes and a gold-plated bead suit both day and evening looks.",
    },
    materials: [
      { tr: "Pamuk ip", en: "Cotton cord" },
      { tr: "Altın kaplama boncuk", en: "Gold-plated bead" },
    ],
    size: { tr: "Uzunluk 6 cm", en: "Length 6 cm" },
    art: { kind: "earrings", cord: "#e3cba8", accent: "#c9a27e", bead: "#d4af37", pattern: "square", bg: ["#f7efe4", "#e2cdb0"] },
  },
  {
    slug: "deniz-kabugu-halhal",
    name: { tr: "Deniz Kabuğu", en: "Seashell" },
    category: "anklet",
    price: 220,
    short: { tr: "Kauri kabuklu doğal halhal", en: "Natural anklet with cowrie shells" },
    description: {
      tr: "Kumda çıplak ayakla yürümenin özgürlüğü. Suya dayanıklı mumlu ip ve kauri kabuklarıyla yaz boyu sizinle.",
      en: "The freedom of walking barefoot on sand. With water-resistant waxed cord and cowrie shells, it stays with you all summer.",
    },
    materials: [
      { tr: "Mumlu ip (suya dayanıklı)", en: "Waxed cord (water-resistant)" },
      { tr: "Kauri deniz kabuğu", en: "Cowrie shells" },
    ],
    size: { tr: "Ayarlanabilir · 21–27 cm", en: "Adjustable · 21–27 cm" },
    art: { kind: "anklet", cord: "#e3cba8", accent: "#c9a27e", bead: "#f3ece0", pattern: "square", bg: ["#eef4f3", "#c4dfdc"] },
    isNew: true,
  },
  {
    slug: "lavanta-bileklik",
    name: { tr: "Lavanta", en: "Lavender" },
    category: "bracelet",
    price: 310,
    short: { tr: "Ametist taşlı lila spiral bileklik", en: "Lilac spiral bracelet with amethyst" },
    description: {
      tr: "Isparta'nın mor tarlalarından ilhamla. Sakinleştirici enerjisiyle bilinen ametist taşı, spiral düğümlerle sarmalanıyor.",
      en: "Inspired by the purple fields of Isparta. Amethyst, known for its calming energy, is wrapped in spiral knots.",
    },
    materials: [
      { tr: "Pamuk makrome ip", en: "Cotton macramé cord" },
      { tr: "Doğal ametist", en: "Natural amethyst" },
    ],
    size: { tr: "Ayarlanabilir · 15–21 cm", en: "Adjustable · 15–21 cm" },
    art: { kind: "bracelet", cord: "#a68bb8", accent: "#f3ece0", bead: "#8e5ba6", pattern: "spiral", bg: ["#f1e9f5", "#cdb6dc"] },
  },
  {
    slug: "gece-yarisi-kolye",
    name: { tr: "Gece Yarısı", en: "Midnight" },
    category: "necklace",
    price: 560,
    short: { tr: "Ay taşlı gece mavisi kolye", en: "Indigo necklace with moonstone" },
    description: {
      tr: "Yıldızlı bir gecenin derinliği. Gece mavisi ipin içinde parıldayan ay taşı, koleksiyonun en gizemli parçası. Yalnızca tek adet üretildi.",
      en: "The depth of a starry night. A moonstone shimmering within indigo cord — the most mysterious piece of the collection. Only one was made.",
    },
    materials: [
      { tr: "İpek karışımlı ip", en: "Silk-blend cord" },
      { tr: "Doğal ay taşı", en: "Natural moonstone" },
      { tr: "Gümüş aparat", en: "Silver findings" },
    ],
    size: { tr: "Zincir boyu 50 cm · Uç 5 cm", en: "Length 50 cm · Pendant 5 cm" },
    art: { kind: "necklace", cord: "#34416e", accent: "#a9b4d6", bead: "#dfe6f2", pattern: "chevron", bg: ["#e3e6f1", "#9aa6cb"] },
    oneOfAKind: true,
  },
  {
    slug: "bal-damlasi-kupe",
    name: { tr: "Bal Damlası", en: "Honey Drop" },
    category: "earrings",
    price: 250,
    short: { tr: "Kehribar boncuklu hardal küpe", en: "Mustard earrings with amber bead" },
    description: {
      tr: "Bir kavanoz balın içinden süzülen güneş ışığı. Hardal tonlu düğümler ve kehribar renkli boncuk ile sıcacık bir dokunuş.",
      en: "Sunlight filtering through a jar of honey. Mustard knots and an amber-coloured bead for a warm touch.",
    },
    materials: [
      { tr: "Pamuk ip", en: "Cotton cord" },
      { tr: "Kehribar renkli cam boncuk", en: "Amber glass bead" },
    ],
    size: { tr: "Uzunluk 6,5 cm", en: "Length 6.5 cm" },
    art: { kind: "earrings", cord: "#d9a441", accent: "#b9772f", bead: "#c46a1f", pattern: "spiral", bg: ["#fcefd8", "#f0c784"] },
  },
  {
    slug: "kiraz-halhal",
    name: { tr: "Kiraz", en: "Cherry" },
    category: "anklet",
    price: 230,
    short: { tr: "Kırmızı boncuklu bordo halhal", en: "Burgundy anklet with red beads" },
    description: {
      tr: "Haziran bahçelerinin en tatlı rengi. İnce örgüsü ve minik kırmızı boncuklarıyla yaz akşamlarının vazgeçilmezi.",
      en: "The sweetest colour of June gardens. Delicate weave and tiny red beads make it a summer-evening essential.",
    },
    materials: [
      { tr: "Mumlu ip", en: "Waxed cord" },
      { tr: "Cam boncuk", en: "Glass beads" },
    ],
    size: { tr: "Ayarlanabilir · 21–27 cm", en: "Adjustable · 21–27 cm" },
    art: { kind: "anklet", cord: "#7a2e3a", accent: "#c94a4a", bead: "#d63a3a", pattern: "square", bg: ["#f8e2e0", "#e6a9a5"] },
  },
  {
    slug: "cift-kalp-bileklik-seti",
    name: { tr: "Çift Kalp Seti", en: "Two Hearts Set" },
    category: "bracelet",
    price: 450,
    short: { tr: "İkili gül kurusu & krem bileklik seti", en: "Dusty rose & cream bracelet pair" },
    description: {
      tr: "Sevdiğinizle, en yakın arkadaşınızla ya da annenizle paylaşmak için. Birbirini tamamlayan iki renk, bir bağın sembolü.",
      en: "To share with your loved one, best friend or mother. Two complementary colours, a symbol of a bond.",
    },
    materials: [
      { tr: "Pamuk makrome ip", en: "Cotton macramé cord" },
      { tr: "İnci boncuk", en: "Pearl beads" },
    ],
    size: { tr: "Ayarlanabilir · 15–21 cm (2 adet)", en: "Adjustable · 15–21 cm (set of 2)" },
    art: { kind: "bracelet", cord: "#d98f8f", accent: "#f3ece0", bead: "#f3ece0", pattern: "square", bg: ["#fbe8e4", "#eeb7ae"] },
    isBestseller: true,
  },
];

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}
