// Real, authentic high-resolution cafe & food photography from Unsplash
const unsplash = (id, width = 900, q = 85) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=${q}`;

export const realImages = {
  hero: unsplash('photo-1554118811-1e0d58224f24', 1400, 90),
  story: unsplash('photo-1445116572660-236099ec97a0', 1100, 85),
  indian: unsplash('photo-1589302168068-964664d93dc0', 800),
  rajasthani: unsplash('photo-1601050690597-df0568f70950', 800),
  chinese: unsplash('photo-1585032226651-759b368d7246', 800),
  continental: unsplash('photo-1604382355076-af4b0eb60143', 800),
  cafe: unsplash('photo-1553909489-cd47e0ef937f', 800),
  beverages: unsplash('photo-1534778101976-62847782c213', 800),
  desserts: unsplash('photo-1578985545062-69928b1d9587', 800),
  breakfast: unsplash('photo-1528207776546-365bb710ee93', 800),
  coolers: unsplash('photo-1513558161293-cdaf765ed2fd', 800),
};

export function fallbackSvg(label = 'The Good Cup') {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#4e5637"/><stop offset="1" stop-color="#2c301f"/></linearGradient></defs><rect width="800" height="600" fill="url(#g)"/><circle cx="400" cy="270" r="110" fill="#ffffff18"/><text x="400" y="295" font-size="80" text-anchor="middle" fill="#f4f1e9">☕</text><text x="400" y="440" font-family="Georgia,serif" font-size="28" letter-spacing="4" text-anchor="middle" fill="#eae7dc" opacity=".95">${label.toUpperCase()}</text></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

export function categoryImage(category = '') {
  const value = String(category).toLowerCase();
  if (value.includes('rajasthani')) return realImages.rajasthani;
  if (value.includes('chinese') || value.includes('wok')) return realImages.chinese;
  if (value.includes('continental') || value.includes('pizza') || value.includes('pasta')) return realImages.continental;
  if (value.includes('dessert') || value.includes('sweet') || value.includes('cake')) return realImages.desserts;
  if (value.includes('breakfast')) return realImages.breakfast;
  if (value.includes('cooler') || value.includes('soda')) return realImages.coolers;
  if (value.includes('coffee') || value.includes('tea') || value.includes('beverage')) return realImages.beverages;
  if (value.includes('indian')) return realImages.indian;
  return realImages.cafe;
}

export const cafeHeroImage = realImages.hero;
export const cafeStoryImage = realImages.story;
export const defaultFoodPlaceholder = realImages.cafe;
