document.addEventListener("DOMContentLoaded",()=>{
  const menu=document.querySelector(".menu-toggle"), nav=document.querySelector(".nav");
  if(menu) menu.addEventListener("click",()=>nav.classList.toggle("open"));

  const productGrid=document.querySelector("[data-products]");
  if(productGrid && window.BBR_PRODUCTS){
    const wa="923322636648";
    productGrid.innerHTML=window.BBR_PRODUCTS.map(p=>`
      <article class="card product" data-category="${p.category.toLowerCase()}">
        <img src="${p.image}" alt="${p.name}">
        <div class="card-body">
          <span class="badge">${p.badge}</span>
          <h3>${p.name}</h3>
          <p>${p.description}</p>
          <div class="price-row"><span class="price">${p.pricePKR}</span><span class="price">${p.priceUSD}</span></div>
          <p class="meta"><strong>${p.status}</strong> · ${p.production}</p>
          <a class="btn-small" href="product.html?code=${encodeURIComponent(p.code)}">View Details</a>
          <a class="btn-small" href="https://wa.me/${wa}?text=${encodeURIComponent("Hi Beads by Rumi, I’m interested in "+p.name+" ("+p.code+").")}">Order on WhatsApp</a>
        </div>
      </article>`).join("");
  }

  const featured=document.querySelector("[data-featured]");
  if(featured && window.BBR_PRODUCTS){
    featured.innerHTML=window.BBR_PRODUCTS.filter(p=>p.featured).map(p=>`
      <article class="card"><img src="${p.image}" alt="${p.name}"><div class="card-body">
      <span class="badge">${p.badge}</span><h3>${p.name}</h3><p>${p.description}</p>
      <div class="price-row"><span class="price">${p.pricePKR}</span><span class="price">${p.priceUSD}</span></div>
      <a class="btn-small" href="product.html?code=${encodeURIComponent(p.code)}">View Product</a></div></article>`).join("");
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

  document.querySelectorAll(".filter").forEach(btn=>btn.addEventListener("click",()=>{
    document.querySelectorAll(".filter").forEach(x=>x.classList.remove("active")); btn.classList.add("active");
    const f=btn.dataset.filter;
    document.querySelectorAll(".product").forEach(p=>p.style.display=(f==="all"||p.dataset.category.includes(f))?"block":"none");
  }));

  const params=new URLSearchParams(location.search), code=params.get("code");
  const detail=document.querySelector("[data-product-detail]");
  if(detail && window.BBR_PRODUCTS){
    const p=window.BBR_PRODUCTS.find(x=>x.code===code) || window.BBR_PRODUCTS[0];

        // Product SEO
    document.title = `${p.name} | Beads by Rumi`;

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        `${p.name} — ${p.description} Available from Beads by Rumi.`
      );
    }

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = `${location.origin}${location.pathname}?code=${encodeURIComponent(p.code)}`;
     // Product structured data for Google
const existingSchema = document.querySelector('script[data-product-schema]');
if (existingSchema) existingSchema.remove();

const schema = document.createElement("script");
schema.type = "application/ld+json";
schema.setAttribute("data-product-schema", "true");

const pricePKR = Number(p.pricePKR.replace(/[^\d]/g, ""));

schema.textContent = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Product",
  "name": p.name,
  "description": p.description,
  "image": new URL(p.image, location.href).href,
  "sku": p.code,
  "category": p.category,
  "brand": {
    "@type": "Brand",
    "name": "Beads by Rumi"
  },
  "offers": {
    "@type": "Offer",
    "url": canonical.href,
    "priceCurrency": "PKR",
    "price": pricePKR,
    "availability": p.status.toLowerCase().includes("in stock")
      ? "https://schema.org/InStock"
      : "https://schema.org/PreOrder"
  }
});

document.head.appendChild(schema);
    detail.innerHTML=`<img src="${p.image}" alt="${p.name}"><div><span class="badge">${p.badge}</span><p class="eyebrow">${p.collection} · ${p.category}</p><h1>${p.name}</h1><div class="price-row"><span class="price">${p.pricePKR}</span><span class="price">${p.priceUSD}</span></div><p class="description">${p.description}</p><div class="info-list">
      <div><strong>Product Code</strong><span>${p.code}</span></div><div><strong>Status</strong><span>${p.status}</span></div><div><strong>Production</strong><span>${p.production}</span></div><div><strong>Materials</strong><span>${p.materials}</span></div><div><strong>Colors</strong><span>${p.colors}</span></div><div><strong>Bulk Orders</strong><span>${p.bulk}</span></div>
      </div><a class="btn" href="https://wa.me/923322636648?text=${encodeURIComponent("Hi Beads by Rumi, I’d like to order "+p.name+" ("+p.code+").")}">Order on WhatsApp</a></div>`;
  }
});
