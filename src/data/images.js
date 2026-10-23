const scenes = {
  indian: ['🍛', '#c68758', '#f4d9a7'],
  rajasthani: ['🥘', '#b96846', '#f1c67f'],
  chinese: ['🥡', '#7c8b56', '#e5c888'],
  continental: ['🍕', '#b87552', '#edc18c'],
  cafe: ['🥪', '#8a7952', '#e3d1a4'],
  beverages: ['☕', '#76614b', '#dcc5a1'],
  desserts: ['🍰', '#a66d76', '#efd0c8'],
  breakfast: ['🥞', '#a47b49', '#f2d595'],
  hero: ['☕', '#687044', '#e7d5b7'],
  story: ['🍰', '#8b684f', '#e7c9a2'],
};

function makeIllustration([emoji, dark, light], title) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 650"><defs><linearGradient id="g" x2="1" y2="1"><stop stop-color="${light}"/><stop offset="1" stop-color="${dark}"/></linearGradient></defs><rect width="900" height="650" fill="url(#g)"/><circle cx="720" cy="120" r="190" fill="#fff" opacity=".13"/><circle cx="150" cy="570" r="230" fill="#fff" opacity=".1"/><path d="M0 485 Q220 430 450 490 T900 470 V650 H0Z" fill="#fff" opacity=".16"/><text x="450" y="365" text-anchor="middle" font-size="190" font-family="'Apple Color Emoji','Segoe UI Emoji',sans-serif">${emoji}</text><text x="450" y="565" text-anchor="middle" font-size="25" letter-spacing="5" font-family="Georgia,serif" fill="#fff" opacity=".9">${title}</text></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

const images = Object.fromEntries(Object.entries(scenes).map(([key, scene]) => [key, makeIllustration(scene, key === 'hero' ? 'A LITTLE CORNER FOR GOOD THINGS' : key === 'story' ? 'FRESH FROM OUR KITCHEN' : key.toUpperCase())]));

export function categoryImage(category = '') {
  const value = category.toLowerCase();
  if (value.includes('rajasthani')) return images.rajasthani;
  if (value.includes('chinese')) return images.chinese;
  if (value.includes('continental')) return images.continental;
  if (value.includes('cafe') || value.includes('snack')) return images.cafe;
  if (value.includes('coffee') || value.includes('tea') || value.includes('cooler')) return images.beverages;
  if (value.includes('sweet') || value.includes('dessert')) return images.desserts;
  if (value.includes('breakfast')) return images.breakfast;
  if (value.includes('indian')) return images.indian;
  return images.cafe;
}

export const cafeHeroImage = images.hero;
export const cafeStoryImage = images.story;
