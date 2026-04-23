/**
 * 🍪 Dough & Co - Centralized Product Data & Utilities
 * 📁 Recommended Path: /doughandco/js/products.js
 * 🔗 Usage: Include this exact script on BOTH Hive Times & DOUGH & CO pages.
 * ✅ Edit the RAW_PRODUCTS array below → Auto-syncs across all linked sites.
 */
(function () {
  // 📌 ASSET CONFIGURATION (Adjust if folder structure changes)
  const CONFIG = {
    basePath: "/doughandco",
    imageDir: "/images",
    fallbackImage: "/images-logo/hive-times-logo.png",
    businessName: "Dough & Co",
    businessLogo: "/images-logo/doughandco-logo.png"
  };

  // 📦 RAW PRODUCT DATA - ✏️ EDIT THIS ARRAY TO UPDATE EVERYWHERE
  const RAW_PRODUCTS = [
    // === 🍪 BUTTER BISCUITS (category: "butter-biscuits") ===
    { id: "flake", name: "Flake Butter Biscuits", price: 125.00, category: "butter-biscuits", description: "Premium flake butter biscuits with layers of delicate, buttery goodness.", badge: "🔥 Best Seller" },
    { id: "nuttyflakes", name: "Nutty Flake Butter Biscuits", price: 125.00, category: "butter-biscuits", description: "Classic flake biscuits topped with roasted nuts for extra crunch.", badge: "🔥 Best Seller" },
    { id: "butter-ferrero", name: "Ferrero Butter Biscuits", price: 125.00, category: "butter-biscuits", description: "Rich butter biscuits inspired by Ferrero, with hazelnut and chocolate notes." },
    { id: "1kgassorted", name: "Assorted Butter Biscuits", price: 130.00, category: "butter-biscuits", description: "A curated selection of our most popular butter biscuit flavours.", badge: "✨ Value Pack" },
     { id: "mintaero", name: "Mint Aero Butter Biscuits", price: 115.00, category: "butter-biscuits", description: "Refreshing mint-infused butter biscuits with a light, airy texture.", badge: "🔥 Best Seller" },
      { id: "peppermint", name: "Peppermint Butter Biscuits", price: 115.00, category: "butter-biscuits", description: "Classic peppermint flavour in a crisp, buttery biscuit base.", badge: "🔥 Best Seller" },
    { id: "burfee", name: "Burfee Butter Biscuits", price: 115.00, category: "butter-biscuits", description: "Traditional South Asian burfee flavour in a modern butter biscuit." },

    // === 🌰 ALMOND ROCCA (category: "almond-rocca") ===
    { id: "almondroca", name: "Classic Almond Rocca", price: 40.00, category: "almond-rocca", description: "Fan-favourite toffee-almond clusters in a cute clear tin with handle.", badge: "🎁 Gift Ready" }
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
  window.DOUGH_AND_CO_PRODUCTS = PROCESSED;
  
  // 🔄 Backward compatibility for legacy scripts
  window.DOUGHANDCO_DATA = PROCESSED;

  // 🛠️ Utility API for both sites
  window.DoughCoProducts = {
    getAll: () => window.DOUGH_AND_CO_PRODUCTS,
    getById: (id) => window.DOUGH_AND_CO_PRODUCTS.find(p => p.id === id),
    getByCategory: (category) => window.DOUGH_AND_CO_PRODUCTS.filter(p => p.categorySlug === category.toLowerCase()),
    getImageUrl: (productId, useFallback = true) => {
      const product = window.DOUGH_AND_CO_PRODUCTS.find(p => p.id === productId);
      return product ? product.image : (useFallback ? `${CONFIG.basePath}${CONFIG.fallbackImage}` : null);
    },
    // Optional: Lightweight HTML generator (both sites can use or override)
    renderCard: (p) => `
      <div class="product-card" data-id="${p.id}">
        <img src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.src='${p.imageFallback}'">
        ${p.badge ? `<span class="badge">${p.badge}</span>` : ""}
        <h3>${p.name}</h3>
        <p class="desc">${p.description}</p>
        <div class="price">R${p.price.toFixed(2)}</div>
        <button class="btn-add" data-product-id="${p.id}">Add to Cart</button>
      </div>
    `
  };

  // 📊 Dev Console (Remove in production)
  console.group("🍪 Dough & Co Products Synced");
  console.log(`✅ ${PROCESSED.length} products loaded`);
  const grouped = {};
  PROCESSED.forEach(p => (grouped[p.categorySlug] = grouped[p.categorySlug] || []).push(p.name));
  Object.entries(grouped).forEach(([cat, items]) => console.log(`📁 ${cat}: ${items.length} items`));
  console.groupEnd();
})();