/**
🧁 Dainty Delicacies - Centralized Product Data & Utilities
📁 Recommended Path: /daintydelicacies/js/products.js
🔗 Usage: Include this exact script on BOTH Hive Times & DAINTY DELICACIES pages.
✅ Edit the RAW_PRODUCTS array below → Auto-syncs across all linked sites.
*/
(function () {
// 📌 ASSET CONFIGURATION (Adjust if folder structure changes)
const CONFIG = {
  basePath: "",
  imageDir: "/daintydelicacies/images",
  fallbackImage: "/daintydelicacies/images/daintydelicacies-logo.jpg",
  businessName: "Dainty Delicacies",
  businessLogo: "/daintydelicacies/images/daintydelicacies-logo.jpg"
};

// 📦 RAW PRODUCT DATA - ✏️ EDIT THIS ARRAY TO UPDATE EVERYWHERE
const RAW_PRODUCTS = [
  // === 🎂 MINI CAKES (category: "mini-cakes") ===
  
  { id: "minicakes1", name: "Chocolate & Vanilla Mini Cakes", price: 17.00, category: "mini-cakes", description: "Moist carrot cakes with cream cheese frosting.", badge: "🥕 Popular" },
  { id: "minicakes2", name: "Mini Carrot Cakes", price: 17.00, category: "mini-cakes", description: "Moist carrot cakes with cream cheese frosting.", badge: "🥕 Popular" },
  { id: "minicakes3", name: "Sweetie Pie Cupcakes", price: 18.00, category: "mini-cakes", description: "Adorable cupcakes perfect for any celebration.", badge: "🧁 New" },
  { id: "minicakes4", name: "Chocolate & Vanilla Drips", price: 17.00, category: "mini-cakes", description: "Beautiful drip cakes with chocolate and vanilla.", badge: "🥕 Popular" },
  { id: "peanut-drip", name: "Chocolate Peanut Drips", price: 17.00, category: "mini-cakes", description: "Rich chocolate with peanut butter drizzle.", badge: "🥜 Fan Favorite" },
  
  // === 🧁 MINI BUNDTS (category: "mini-bundts") ===
  { id: "choc-bundts", name: "Chocolate & Vanilla Bundts (No Cream)", price: 16.00, category: "mini-bundts", description: "Classic bundt cakes without cream.", badge: "🍊 New" },
  { id: "vanilla-bundts", name: "Vanilla Bundts with Cream", price: 17.00, category: "mini-bundts", description: "Delicious bundts topped with cream.", badge: "🍊 New" },
  { id: "orange-bundt", name: "Orange Bundt with Cream Cheese", price: 16.00, category: "mini-bundts", description: "Zesty orange bundt with cream cheese frosting and pistachio topping.", badge: "🍊 New" },
  
  // === 🪵 MINI LOGS (category: "mini-logs") ===
  { id: "logs", name: "Chocolate & Vanilla Logs (Ganache & Strawberry)", price: 16.00, category: "mini-logs", description: "Classic bundt cakes without cream.", badge: "🍊 New" },
 { id: "vanilla-logs", name: "Chocolate & Vanilla Logs (Full Toppings)", price: 16.00, category: "mini-logs", description: "With ganache, cream and toppings.", badge: "🍊 New" },
 
  // === 🎁 PROMO BOXES (category: "promo-boxes") ===
  { id: "box6", name: "Box of 6 Mini Carrot Cakes", price: 100.00, category: "promo-boxes", description: "Perfect gift box with 6 mini carrot cakes.", badge: "🎁 Gift Ready" },
  { id: "box32", name: "Box of 32 Cakes (Assorted)", price: 570.00, category: "promo-boxes", description: "8 mini cakes, 8 mini bundts, 8 mini logs, 8 mini drips.", badge: "💰 Best Value" },
   { id: "box24", name: "Box of 24 Cakes (Mixed)", price: 570.00, category: "promo-boxes", description: "12 mini cakes & 12 mini bundts.", badge: "💰 Best Value" },
  
];

// 🔄 Process & Attach Metadata + Image Paths
const PROCESSED = RAW_PRODUCTS.map(product => ({
  ...product,
  image: `${CONFIG.basePath}${CONFIG.imageDir}/${product.id}.jpg`,
  imageFallback: `${CONFIG.basePath}${CONFIG.fallbackImage}`,
  businessName: CONFIG.businessName,
  businessLogo: `${CONFIG.basePath}${CONFIG.businessLogo}`,
  categorySlug: product.category.trim().toLowerCase()
}));

// 🌐 Global Export (Used by both websites)
window.DAINTY_DELICACIES_PRODUCTS = PROCESSED;

// 🔄 Backward compatibility for legacy scripts
window.DAINTY_DATA = PROCESSED;

// 🛠️ Utility API for both sites
window.DaintyProducts = {
  getAll: () => window.DAINTY_DELICACIES_PRODUCTS,
  getById: (id) => window.DAINTY_DELICACIES_PRODUCTS.find(p => p.id === id),
  getByCategory: (category) => window.DAINTY_DELICACIES_PRODUCTS.filter(p => p.categorySlug === category.toLowerCase()),
  getImageUrl: (productId, useFallback = true) => {
    const product = window.DAINTY_DELICACIES_PRODUCTS.find(p => p.id === productId);
    return product ? product.image : (useFallback ? `${CONFIG.basePath}${CONFIG.fallbackImage}` : null);
  },
  // Optional: Lightweight HTML generator (both sites can use or override)
  renderCard: (p) => `<div class="product-card" data-id="${p.id}"><img src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.src='${p.imageFallback}'">${p.badge ? `<span class="badge">${p.badge}</span>` : ''}<h3>${p.name}</h3><p class="desc">${p.description}</p><div class="price">R${p.price.toFixed(2)}</div><button class="btn-add" data-product-id="${p.id}">Add to Cart</button></div>`
};

// 📊 Dev Console (Remove in production)
console.group("🧁 Dainty Delicacies Products Synced");
console.log(`✅ ${PROCESSED.length} products loaded`);
const grouped = {};
PROCESSED.forEach(p => (grouped[p.categorySlug] = grouped[p.categorySlug] || []).push(p.name));
Object.entries(grouped).forEach(([cat, items]) => console.log(`📁 ${cat}: ${items.length} items`));
console.groupEnd();
})();