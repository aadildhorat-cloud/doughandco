/**
🍪 DOUGH & CO - Centralized Product Data & Utilities
📁 Recommended Path: /doughandco/js/products-dough-co.js
🔗 Usage: Include this exact script on BOTH Hive Times & DOUGH & CO pages.
✅ Edit the RAW_PRODUCTS array below → Auto-syncs across all linked sites.
*/
(function () {
  // 📌 ASSET CONFIGURATION
  const CONFIG = {
    basePath: "",
    imageDir: "/doughandco/images",
    fallbackImage: "/doughandco/images/dough-and-co-logo.jpg",
    businessName: "DOUGH & CO",
    businessLogo: "/doughandco/images/dough-and-co-logo.jpg"
  };

  // 📦 RAW PRODUCT DATA - ✏️ EDIT THIS ARRAY TO UPDATE EVERYWHERE
  const RAW_PRODUCTS = [
    // === 🍪 BUTTER BISCUITS (category: "butter-biscuits") ===
    { id: "butter-bisc-1", name: "Classic Butter Biscuits", price: 45.00, category: "butter-biscuits", description: "Rich, melt-in-your-mouth traditional butter biscuits.", badge: "🔥 Popular" },
    { id: "butter-bisc-2", name: "Chocolate Chip Butter Biscuits", price: 55.00, category: "butter-biscuits", description: "Buttery base studded with premium chocolate chips.", badge: "🍫 New" },

    // === 🍪 SUGAR COOKIES (category: "sugar-cookies") ===
    { id: "sugar-cookie-1", name: "Classic Vanilla Sugar Cookies", price: 50.00, category: "sugar-cookies", description: "Crisp, sweet, and perfectly shaped vanilla sugar cookies.", badge: "⭐ Best Seller" },
    { id: "sugar-cookie-2", name: "Decorated Iced Sugar Cookies", price: 65.00, category: "sugar-cookies", description: "Hand-iced sugar cookies perfect for celebrations.", badge: "🎉 Party Ready" },

    // === 🫖 TEA CAKES (category: "tea-cakes") ===
    { id: "tea-cake-1", name: "Mini Fruit Tea Cakes", price: 40.00, category: "tea-cakes", description: "Light, fluffy tea cakes loaded with mixed dried fruits.", badge: "☕ Tea Time" },
    { id: "tea-cake-2", name: "Lemon Zest Tea Cakes", price: 45.00, category: "tea-cakes", description: "Zesty lemon-flavored tea cakes with a sweet glaze.", badge: "🍋 Citrus Fresh" },

    // === 🌰 ALMOND ROCCA (category: "almond-rocca") ===
    { id: "almond-rocca-1", name: "Classic Almond Rocca", price: 75.00, category: "almond-rocca", description: "Crunchy almonds coated in rich milk chocolate.", badge: "🥜 Nutty Favorite" },
    { id: "almond-rocca-2", name: "Dark Chocolate Almond Rocca", price: 80.00, category: "almond-rocca", description: "Premium roasted almonds in dark chocolate coating.", badge: "🍫 Gourmet" }
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
  window.DOUGH_CO_PRODUCTS = PROCESSED;
  // 🔄 Backward compatibility
  window.DOUGH_DATA = PROCESSED;

  // 🛠️ Utility API for both sites
  window.DoughCoProducts = {
    getAll: () => window.DOUGH_CO_PRODUCTS,
    getById: (id) => window.DOUGH_CO_PRODUCTS.find(p => p.id === id),
    getByCategory: (category) => window.DOUGH_CO_PRODUCTS.filter(p => p.categorySlug === category.toLowerCase()),
    getImageUrl: (productId, useFallback = true) => {
      const product = window.DOUGH_CO_PRODUCTS.find(p => p.id === productId);
      return product ? product.image : (useFallback ? `${CONFIG.basePath}${CONFIG.fallbackImage}` : null);
    },
    // Optional: Lightweight HTML generator
    renderCard: (p) => `
      <div class="product-card" data-id="${p.id}">
        <img src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.src='${p.imageFallback}'">
        ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ''}
        <div class="product-info">
          <h3 class="product-name">${p.name}</h3>
          <p class="product-description">${p.description}</p>
          <div class="product-price">R${p.price.toFixed(2)}</div>
          <button class="add-to-cart-btn" data-product-id="${p.id}" onclick="addToCart({id:'${p.id}',name:'${p.name.replace(/'/g, "\\'")}',price:${p.price},image:'${p.image}',businessName:'${p.businessName}',businessLogo:'${p.businessLogo}'})">Add to Cart</button>
        </div>
      </div>
    `
  };

  // 📊 Dev Console
  console.group("🍪 DOUGH & CO Products Synced");
  console.log(`✅ ${PROCESSED.length} products loaded`);
  const grouped = {};
  PROCESSED.forEach(p => (grouped[p.categorySlug] = grouped[p.categorySlug] || []).push(p.name));
  Object.entries(grouped).forEach(([cat, items]) => console.log(`📁 ${cat}: ${items.length} items`));
  console.groupEnd();
})();