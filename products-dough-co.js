/**
🍪 Dough & Co - Centralized Product Data & Utilities
📁 Path: /doughandco/js/products-dough-co.js
✅ MODE: Google Sheets (Live) + Fallback
*/
(function () {
  const CONFIG = {
    basePath: "",
    imageDir: "/doughandco/images",
    fallbackImage: "/images/logo.jpg",
    businessName: "Dough & Co",
    businessLogo: "/doughandco/images/doughandco-logo.jpg",
    sheetsApiUrl: "https://script.google.com/macros/s/AKfycbyxIhWlmoT9ZiQXaXp6Xj40coLGgm8pdn73RUmfQ4Lto99AQk0KSfDOX4eOwh45g1XvyA/exec",
    fetchTimeout: 8000,
    cacheKey: "doughco_products_cache",
    cacheDuration: 15 * 60 * 1000
  };

  let _products = null, _loadPromise = null, _lastFetchTime = 0;

  const RAW_PRODUCTS = [
    { id: "flake", name: "Flake Butter Biscuits", price: 125, category: "butter-biscuits", niche: "baking", type: "baking", location: "gauteng", description: "Premium flake butter biscuits with layers of delicate, buttery goodness.", badge: "🔥 Best Seller", businessName: "Dough & Co", businessLogo: "/doughandco/images/doughandco-logo.jpg", customImage: null },
    { id: "nuttyflakes", name: "Nutty Flake Butter Biscuits", price: 125, category: "butter-biscuits", niche: "baking", location: "gauteng", description: "Classic flake biscuits topped with roasted nuts for extra crunch.", badge: "🔥 Best Seller", businessName: "Dough & Co", businessLogo: "/doughandco/images/doughandco-logo.jpg", customImage: null },
    { id: "1kgassorted", name: "Assorted Butter Biscuits", price: 130, category: "butter-biscuits", niche: "baking", location: "gauteng", description: "A curated selection of our most popular butter biscuit flavours.", badge: "✨ Value Pack", businessName: "Dough & Co", businessLogo: "/doughandco/images/doughandco-logo.jpg", customImage: null },
    { id: "mintaero", name: "Mint Aero Butter Biscuits", price: 115, category: "butter-biscuits", niche: "baking", location: "gauteng", description: "Refreshing mint-infused butter biscuits with a light, airy texture.", badge: "🔥 Best Seller", businessName: "Dough & Co", businessLogo: "/doughandco/images/doughandco-logo.jpg", customImage: null },
    { id: "peppermint", name: "Peppermint Butter Biscuits", price: 115, category: "butter-biscuits", niche: "baking", location: "gauteng", description: "Classic peppermint flavour in a crisp, buttery biscuit base.", badge: "🔥 Best Seller", businessName: "Dough & Co", businessLogo: "/doughandco/images/doughandco-logo.jpg", customImage: null },
    { id: "diycookies", name: "DIY Cookies", price: 360, category: "sugar-cookies", niche: "baking", location: "gauteng", description: "Customize your own batch of delicious sugar cookies, R360 per kg.", badge: "🔥 Best Seller", businessName: "Dough & Co", businessLogo: "/doughandco/images/doughandco-logo.jpg", customImage: null },
    { id: "almondroca", name: "Classic Almond Rocca", price: 40, category: "almond-rocca", niche: "baking", location: "gauteng", description: "Fan-favourite toffee-almond clusters in a cute clear tin with handle.", badge: "🎁 Gift Ready", businessName: "Dough & Co", businessLogo: "/doughandco/images/doughandco-logo.jpg", customImage: null }
  ];

  function processProducts(raw) {
    if (!Array.isArray(raw)) return [];
    return raw.map(p => {
      const clean = (val) => typeof val === 'string' ? val.trim() : val;
      return {
        ...p,
        id: clean(p.id), name: clean(p.name), category: clean(p.category),
        niche: clean(p.niche), type: clean(p.type), location: clean(p.location),
        description: clean(p.description), badge: clean(p.badge),
        businessName: clean(p.businessName) || CONFIG.businessName,
        businessLogo: clean(p.businessLogo) || CONFIG.businessLogo,
        image: p.customImage ? clean(p.customImage) : `${CONFIG.basePath}${CONFIG.imageDir}/${clean(p.id)}.jpg`,
        imageFallback: `${CONFIG.basePath}${CONFIG.fallbackImage}`,
        categorySlug: (clean(p.category) || "").toLowerCase(),
        locationSlug: (clean(p.location) || "gauteng").toLowerCase(),
        nicheSlug: (clean(p.niche) || "baking").toLowerCase()
      };
    });
  }

  function loadFromCache() {
    try {
      const c = localStorage.getItem(CONFIG.cacheKey);
      if (!c) return null;
      const { data, timestamp } = JSON.parse(c);
      if (Date.now() - timestamp < CONFIG.cacheDuration) {
        console.log("🗃️ Loaded from cache");
        return processProducts(data);
      }
      return null;
    } catch (e) { return null; }
  }

  function saveToCache(data) {
    try { localStorage.setItem(CONFIG.cacheKey, JSON.stringify({ data, timestamp: Date.now() })); } catch (e) {}
  }

  function fetchProducts() {
    if (!CONFIG.sheetsApiUrl || CONFIG.sheetsApiUrl.includes("YOUR_DEPLOYMENT_ID") || CONFIG.sheetsApiUrl.trim() === "") {
      console.log("📦 Using embedded fallback data");
      return Promise.resolve(RAW_PRODUCTS);
    }
    return new Promise((resolve, reject) => {
      const tid = setTimeout(() => reject(new Error("Fetch timeout")), CONFIG.fetchTimeout);
      const cb = `doughco_cb_${Date.now()}`;
      window[cb] = (res) => { clearTimeout(tid); delete window[cb]; resolve(res?.products || res || []); };
      const s = document.createElement("script");
      s.src = `${CONFIG.sheetsApiUrl}?prefix=${cb}&t=${Date.now()}`;
      s.onerror = () => { clearTimeout(tid); delete window[cb]; reject(new Error("Network error")); };
      document.head.appendChild(s);
    });
  }

  function loadProducts() {
    if (_loadPromise) return _loadPromise;
    const cached = loadFromCache();
    if (cached) { _products = cached; initAPI(); return Promise.resolve(cached); }
    _loadPromise = fetchProducts()
      .then(raw => {
        _products = processProducts(raw);
        if (CONFIG.sheetsApiUrl && !CONFIG.sheetsApiUrl.includes("YOUR_DEPLOYMENT_ID") && CONFIG.sheetsApiUrl.trim() !== "") {
          saveToCache(raw);
        }
        _lastFetchTime = Date.now(); initAPI();
        console.group("🍪 Dough & Co Products Loaded");
        console.log(`✅ ${_products.length} products`);
        console.log(`🔄 Source: ${CONFIG.sheetsApiUrl?.trim() ? "Google Sheets (Live)" : "Embedded Fallback"}`);
        console.groupEnd();
        return _products;
      })
      .catch(err => {
        console.warn("⚠️ Fetch failed, using fallback:", err.message);
        _products = processProducts(RAW_PRODUCTS); initAPI(); return _products;
      })
      .finally(() => { _loadPromise = null; });
    return _loadPromise;
  }

  function initAPI() {
    window.DoughCoProducts = {
      load: () => loadProducts(),
      isLoaded: () => _products !== null,
      getLastFetchTime: () => _lastFetchTime,
      getAll: () => _products || [],
      getById: (id) => (_products || []).find(p => p.id === id),
      getByCategory: (cat) => (_products || []).filter(p => p.categorySlug === (cat || "").toLowerCase()),
      getByLocation: (loc) => (_products || []).filter(p => p.locationSlug === (loc || "").toLowerCase()),
      getByNiche: (niche) => (_products || []).filter(p => p.nicheSlug === (niche || "").toLowerCase()),
      filter: ({ category, location, niche }) => (_products || []).filter(p => {
        if (category && p.categorySlug !== category.toLowerCase()) return false;
        if (location && p.locationSlug !== location.toLowerCase()) return false;
        if (niche && p.nicheSlug !== niche.toLowerCase()) return false;
        return true;
      }),
      getImageUrl: (id, fallback = true) => {
        const p = (_products || []).find(x => x.id === id);
        return p ? p.image : (fallback ? `${CONFIG.basePath}${CONFIG.fallbackImage}` : null);
      },
      renderCard: (p) => `<article class="product-card" data-id="${p.id}" data-price="${p.price}" data-name="${p.name}" data-description="${p.description}" data-image="${p.image}" data-category="${p.categorySlug}"><img src="${p.image}" alt="${p.name}" class="product-image" loading="lazy" onerror="this.src='${p.imageFallback}'">${p.badge ? `<span class="badge">${p.badge}</span>` : ''}<div class="product-info"><div class="product-name">${p.name}</div><div class="product-description">${p.description}</div><div class="product-price">R${p.price.toFixed(2)}</div><button class="add-to-cart-btn" data-product-id="${p.id}"><i class="fas fa-cart-plus"></i> Add to Cart</button></div></article>`,
      getWhatsAppLink: (p, phone = "27123456789") => `https://wa.me/${phone}?text=${encodeURIComponent(`Hi, I'd like to order: ${p.name} (R${p.price}) from ${p.businessName}`)}`,
      refresh: () => { localStorage.removeItem(CONFIG.cacheKey); _products = null; _loadPromise = null; return loadProducts(); }
    };
    if (_products) { window.DOUGH_AND_CO_PRODUCTS = _products; window.DOUGHANDCO_DATA = _products; }
  }

  loadProducts().catch(() => { _products = processProducts(RAW_PRODUCTS); initAPI(); });

  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    loadProducts().then(ps => {
      if (!ps || !ps.length) return;
      const groups = {}; ps.forEach(p => { groups[p.categorySlug] = groups[p.categorySlug] || []; groups[p.categorySlug].push(p.name); });
      console.group("🍪 Dough & Co Synced"); console.log(`✅ ${ps.length} products`);
      Object.entries(groups).forEach(([cat, items]) => console.log(`📁 ${cat}: ${items.length} items`)); console.groupEnd();
    });
  }
})();