document.addEventListener("DOMContentLoaded", () => {
  const menu = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav");

  if (menu && nav) {
    menu.setAttribute("aria-expanded", "false");
    menu.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      menu.setAttribute("aria-expanded", String(open));
      menu.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
  }

  const products = Array.isArray(window.BBR_PRODUCTS) ? window.BBR_PRODUCTS : [];
  const links = window.BBR_PRODUCT_LINKS || {};
  const waNumber = "923322636648";

  const productUrl = (code) => links[code] || `product.html?code=${encodeURIComponent(code)}`;

  const whatsappUrl = (product) => {
    const message = `Hi Beads by Rumi, I’m interested in ${product.name} (${product.code}).`;
    return `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;
  };

  const productGrid = document.querySelector("[data-products]");

  if (productGrid) {
    if (!products.length) {
      productGrid.innerHTML = '<div class="empty">Our handmade collection is being updated. Please check back shortly.</div>';
    } else {
      productGrid.innerHTML = products.map((p) => `
        <article class="card product" data-category="${String(p.category || "").toUpperCase()}">
          <img src="${p.image}" alt="${p.name} by Beads by Rumi" loading="lazy">
          <div class="card-body">
            <span class="badge">${p.badge}</span>
            <h3>${p.name}</h3>
            <p>${p.description}</p>
            <div class="price-row">
              <span class="price">${p.pricePKR}</span>
              <span class="price">${p.priceUSD}</span>
            </div>
            <p class="meta"><strong>${p.status}</strong> · ${p.production}</p>
            <div class="card-actions">
              <a class="btn-small" href="${productUrl(p.code)}">View Details</a>
              <a class="btn-small" href="${whatsappUrl(p)}" target="_blank" rel="noopener">Order on WhatsApp</a>
            </div>
          </div>
        </article>
      `).join("");
    }
  }

  const featured = document.querySelector("[data-featured]");

  if (featured) {
    const featuredProducts = products.filter((p) => p.featured);

    featured.innerHTML = featuredProducts.length
      ? featuredProducts.map((p) => `
          <article class="card">
            <img src="${p.image}" alt="${p.name} by Beads by Rumi" loading="lazy">
            <div class="card-body">
              <span class="badge">${p.badge}</span>
              <h3>${p.name}</h3>
              <p>${p.description}</p>
              <div class="price-row">
                <span class="price">${p.pricePKR}</span>
                <span class="price">${p.priceUSD}</span>
              </div>
              <a class="btn-small" href="${productUrl(p.code)}">View Product</a>
            </div>
          </article>
        `).join("")
      : '<div class="empty">Featured products will appear here soon.</div>';
  }

  const offer = document.querySelector("[data-offer]");

  if (offer && window.BBR_OFFERS && window.BBR_OFFERS.active) {
    offer.innerHTML = `
      <p class="eyebrow">${BBR_OFFERS.eyebrow}</p>
      <h2>${BBR_OFFERS.title}</h2>
      <p class="narrow">${BBR_OFFERS.text}</p>
      <span class="offer-badge">${BBR_OFFERS.badge}</span>
    `;
  }

  const filterButtons = document.querySelectorAll(".filter");
  const productCards = document.querySelectorAll(".product");

  if (filterButtons.length && productCards.length) {
    const filterMap = {
      all: ["HANDBAGS", "SHOULDER BAGS", "ACCESSORIES", "BRACELETS"],
      handbags: ["HANDBAGS"],
      shoulder: ["SHOULDER BAGS"],
      accessories: ["ACCESSORIES", "BRACELETS"]
    };

    const applyFilter = (filter) => {
      const allowed = filterMap[filter] || filterMap.all;

      productCards.forEach((product) => {
        const category = product.dataset.category || "";
        product.style.display = filter === "all" || allowed.includes(category) ? "" : "none";
      });
    };

    filterButtons.forEach((button) => {
      button.type = "button";
      button.setAttribute("aria-pressed", button.classList.contains("active") ? "true" : "false");

      button.addEventListener("click", () => {
        filterButtons.forEach((item) => {
          const active = item === button;
          item.classList.toggle("active", active);
          item.setAttribute("aria-pressed", active ? "true" : "false");
        });

        applyFilter(button.dataset.filter || "all");
      });
    });

    applyFilter("all");
  }

  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");
  const detail = document.querySelector("[data-product-detail]");

  if (detail && products.length) {
    const product = products.find((item) => item.code === code) || products[0];
    const cleanUrl = links[product.code]
      ? new URL(links[product.code], window.location.href).href
      : `${window.location.origin}${window.location.pathname}?code=${encodeURIComponent(product.code)}`;

    document.title = `${product.name} | Beads by Rumi`;

    const metaDescription = document.querySelector('meta[name="description"]');
    const seoDescription = `${product.name} — ${product.description} Handmade by Beads by Rumi. Shop handcrafted beaded bags and accessories from Pakistan.`;

    if (metaDescription) metaDescription.setAttribute("content", seoDescription);

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = cleanUrl;

    const setMeta = (property, content, attribute = "property") => {
      let tag = document.querySelector(`meta[${attribute}="${property}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute(attribute, property);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    };

    setMeta("og:type", "product");
    setMeta("og:title", `${product.name} | Beads by Rumi`);
    setMeta("og:description", seoDescription);
    setMeta("og:url", cleanUrl);
    setMeta("og:image", new URL(product.image, window.location.href).href);
    setMeta("og:site_name", "Beads by Rumi");
    setMeta("twitter:card", "summary_large_image", "name");
    setMeta("twitter:title", `${product.name} | Beads by Rumi`, "name");
    setMeta("twitter:description", seoDescription, "name");
    setMeta("twitter:image", new URL(product.image, window.location.href).href, "name");

    const existingSchema = document.querySelector('script[data-product-schema]');
    if (existingSchema) existingSchema.remove();

    const schema = document.createElement("script");
    schema.type = "application/ld+json";
    schema.setAttribute("data-product-schema", "true");

    const pricePKR = Number(String(product.pricePKR || "").replace(/[^\d.]/g, ""));
    const availability = String(product.status || "").toLowerCase().includes("in stock")
      ? "https://schema.org/InStock"
      : "https://schema.org/PreOrder";

    schema.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Product",
      "name": product.name,
      "description": product.description,
      "image": [new URL(product.image, window.location.href).href],
      "sku": product.code,
      "category": product.category,
      "brand": { "@type": "Brand", "name": "Beads by Rumi" },
      "offers": {
        "@type": "Offer",
        "url": cleanUrl,
        "priceCurrency": "PKR",
        "price": pricePKR,
        "availability": availability,
        "itemCondition": "https://schema.org/NewCondition"
      }
    });

    document.head.appendChild(schema);

    detail.innerHTML = `
      <img src="${product.image}" alt="${product.name} by Beads by Rumi" loading="eager" fetchpriority="high">
      <div>
        <span class="badge">${product.badge}</span>
        <p class="eyebrow">${product.collection} · ${product.category}</p>
        <h1>${product.name}</h1>
        <div class="price-row">
          <span class="price">${product.pricePKR}</span>
          <span class="price">${product.priceUSD}</span>
        </div>
        <p class="description">${product.description}</p>
        <div class="info-list">
          <div><strong>Product Code</strong><span>${product.code}</span></div>
          <div><strong>Status</strong><span>${product.status}</span></div>
          <div><strong>Production</strong><span>${product.production}</span></div>
          <div><strong>Materials</strong><span>${product.materials}</span></div>
          <div><strong>Colors</strong><span>${product.colors}</span></div>
          <div><strong>Bulk Orders</strong><span>${product.bulk}</span></div>
        </div>
        <a class="btn" href="${whatsappUrl(product)}" target="_blank" rel="noopener">Order on WhatsApp</a>
      </div>
    `;
  }
});
