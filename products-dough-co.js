/**
🍪 Dough & Co - Google Sheets Sync Product Data
📁 Path: /doughandco/js/products.js
🔗 Fetches live data from Google Sheets with fallback to static data
*/
(function () {
  // 📌 CONFIGURATION
  const CONFIG = {
    basePath: "/doughandco",
    imageDir: "/images",
    fallbackImage: "/images-logo/hive-times-logo.png",
    businessName: "Dough & Co",
    businessLogo: "/images-logo/doughandco-logo.png",
    // ✅ Your Google Sheet ID + CSV endpoint
    sheetId: "1vSC06x9AeVkjkI4IWUHx0GGDhhpjOg3O5NoIV1WGdKLwB4hl3iDzSKlgFANIS32HStLhlggy57C8J3B",
    sheetGid: "0", // Use "0" for first tab, or find gid in your sheet URL
    useSheets: true // Set to false to use static RAW_PRODUCTS only
  };

  // 📦 FALLBACK STATIC DATA (used if Sheets fetch fails)
  const RAW_PRODUCTS = [
    { id: "flake", name: "Flake Butter Biscuits", price: 125.00, category: "butter-biscuits", description: "Premium flake butter biscuits with layers of delicate, buttery goodness.", badge: "🔥 Best Seller" },
    { id: "nuttyflakes", name: "Nutty Flake Butter Biscuits", price: 125.00, category: "butter-biscuits", description: "Classic flake biscuits topped with roasted nuts for extra crunch.", badge: "🔥 Best Seller" },
    { id: "1kgassorted", name: "Assorted Butter Biscuits", price: 130.00, category: "butter-biscuits", description: "A curated selection of our most popular butter biscuit flavours.", badge: "✨ Value Pack" },
    { id: "mintaero", name: "Mint Aero Butter Biscuits", price: 115.00, category: "butter-biscuits", description: "Refreshing mint-infused butter biscuits with a light, airy texture.", badge: "🔥 Best Seller" },
    { id: "peppermint", name: "Peppermint Butter Biscuits", price: 115.00, category: "butter-biscuits", description: "Classic peppermint flavour in a crisp, buttery biscuit base.", badge: "🔥 Best Seller" },
    { id: "diycookies", name: "DIY Cookies", price: 115.00, category: "sugar-cookies", description: "Customize your own batch of delicious sugar cookies.", badge: "🔥 Best Seller" },
    { id: "almondroca", name: "Classic Almond Rocca", price: 40.00, category: "almond-rocca", description: "Fan-favourite toffee-almond clusters in a cute clear tin with handle.", badge: "🎁 Gift Ready" }
  ];

  // 🌐 CSV-to-JSON Parser (no external libraries)
  function parseCSV(csv) {
    const lines = csv.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
    return lines.slice(1).map(line => {
      const values = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || [];
      const obj = {};
      headers.forEach((header, i) => {
        let val = values[i] ? values[i].trim().replace(/^"|"$/g, '') : '';
        if (header === 'price') val = parseFloat(val) || 0;
        obj[header] = val;
      });
      return obj;
    }).filter(p => p.id); // Remove empty rows
  }

  // 🔄 Process & Attach Metadata
  function processProducts(products) {
    return products.map(product => ({
      ...product,
      image: `${CONFIG.basePath}${CONFIG.imageDir}/${product.id}.jpg`,
      imageFallback: `${CONFIG.basePath}${CONFIG.fallbackImage}`,
      businessName: CONFIG.businessName,
      businessLogo: `${CONFIG.basePath}${CONFIG.businessLogo}`,
      categorySlug: (product.category || '').trim().toLowerCase()
    }));
  }

  // 🚀 Fetch from Google Sheets (with fallback)
  async function loadProducts() {
    if (!CONFIG.useSheets) {
      console.log("📦 Using static RAW_PRODUCTS");
      return processProducts(RAW_PRODUCTS);
    }
    
    const csvUrl = `https://docs.google.com/spreadsheets/d/${CONFIG.sheetId}/export?format=csv&gid=${CONFIG.sheetGid}`;
    
    try {
      console.log("🌐 Fetching from Google Sheets...");
      const response = await fetch(csvUrl, { cache: "no-store" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const csvText = await response.text();
      const parsed = parseCSV(csvText);
      console.log(`✅ Loaded ${parsed.length} products from Sheets`);
      return processProducts(parsed);
    } catch (err) {
      console.warn("⚠️ Sheets fetch failed, using fallback data:", err.message);
      return processProducts(RAW_PRODUCTS);
    }
  }

  // 🌍 Global Initialization
  let PRODUCTS_CACHE = null;
  
  window.DoughCoProducts = {
    // Async load (recommended)
    load: async () => {
      if (!PRODUCTS_CACHE) {
        PRODUCTS_CACHE = await loadProducts();
        // Re-export for legacy compatibility
        window.DOUGH_AND_CO_PRODUCTS = PRODUCTS_CACHE;
        window.DOUGHANDCO_DATA = PRODUCTS_CACHE;
      }
      return PRODUCTS_CACHE;
    },
    // Sync getters (use after .load())
    getAll: () => PRODUCTS_CACHE || RAW_PRODUCTS,
    getById: (id) => (PRODUCTS_CACHE || RAW_PRODUCTS).find(p => p.id === id),
    getByCategory: (category) => (PRODUCTS_CACHE || RAW_PRODUCTS).filter(p => p.categorySlug === category.toLowerCase()),
    getImageUrl: (productId, useFallback = true) => {
      const list = PRODUCTS_CACHE || RAW_PRODUCTS;
      const product = list.find(p => p.id === productId);
      return product ? product.image : (useFallback ? `${CONFIG.basePath}${CONFIG.fallbackImage}` : null);
    },
    renderCard: (p) => `<div class="product-card" data-id="${p.id}"><img src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.src='${p.imageFallback}'">${p.badge ? `<span class="badge">${p.badge}</span>` : ''}<h3>${p.name}</h3><p class="desc">${p.description}</p><div class="price">R${parseFloat(p.price).toFixed(2)}</div><button class="btn-add" data-product-id="${p.id}">Add to Cart</button></div>`
  };

  // 🔄 Auto-load on script include (optional)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => window.DoughCoProducts.load());
  } else {
    window.DoughCoProducts.load();
  }

  // 📊 Dev Console
  console.group("🍪 Dough & Co Products");
  console.log(`🔗 Sheet ID: ${CONFIG.sheetId}`);
  console.log(`🔄 Sync mode: ${CONFIG.useSheets ? 'Google Sheets' : 'Static'}`);
  console.groupEnd();

})();