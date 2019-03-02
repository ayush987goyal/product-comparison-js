let allProducts;
let allFilters;
let brandFilters, priceFilters, colorFilters;

let selectedColors = new Set();

const filtersEl = document.getElementById('filters');
const productsEl = document.getElementById('products');

const priceMinFilterEl = document.getElementById('price-min-filter');
const priceMaxFilterEl = document.getElementById('price-max-filter');
const brandFilterEl = document.getElementById('brand-filter');
const colorFilterEl = document.getElementById('color-filter');

async function fetchAllData() {
  allProducts = await fetch('http://demo1853299.mockable.io/products', { method: 'GET' })
    .then(res => res.json())
    .then(prods => prods.products);
  allFilters = await fetch('http://demo1853299.mockable.io/filters', { method: 'GET' })
    .then(res => res.json())
    .then(filts => filts.filters);

  brandFilters = allFilters[0].values;
  colorFilters = allFilters[1].values;
  priceFilters = allFilters[2].values;
  console.log(colorFilters);
  populateFilters();
  populateProducts(allProducts);
}

function populateFilters() {
  let priceHtml = ``;
  priceFilters.forEach(filt => {
    priceHtml += `
      <option value="${filt.key}">${filt.displayValue}</option> 
    `;
  });
  priceMinFilterEl.innerHTML = priceHtml;
  priceMaxFilterEl.innerHTML = priceHtml;

  let colorHtml = ``;
  colorFilters.forEach((filt, idx) => {
    colorHtml += `
      <div class="form-check">
        <input type="checkbox" class="form-check-input" id="color-${idx}" value="${
      filt.color
    }" onchange="handleCheckChange.call(this, '${filt.color}')">
        <label class="form-check-label box-center" for="color-${idx}"><div class="small-circle mx-2" style="background-color: ${
      filt.color
    };"></div> ${filt.title}</label>
      </div>
    `;
  });
  colorFilterEl.innerHTML = colorHtml;
}

function handleCheckChange(color) {
  if (this.checked) {
    selectedColors.add(color);
  } else {
    selectedColors.delete(color);
  }

  let filteredProds;
  if (selectedColors.size) {
    filteredProds = allProducts.filter(prod => selectedColors.has(prod.colour.color));
  } else {
    filteredProds = allProducts;
  }
  populateProducts(filteredProds);
}

function populateProducts(products) {
  let html = ``;
  products.forEach(prod => {
    html += getProductCard(prod);
  });

  productsEl.innerHTML = html;
}

function getProductCard(product) {
  return `
    <div class="card">
      <img src="${product.image}" class="card-img-top p-3">
      <div class="card-body">
        <h6 class="card-title">${product.title}</h6>
        <p><span class="badge badge-primary">${product.rating}</span></p>
        <div class="price-row">
          <span>$${product.price.final_price}</span>
          <span><small><strike>${
            product.price.mrp ? '$' + product.price.mrp : ''
          }</strike></small></span>
          <span><small>${product.price.mrp ? product.discount + '% off' : ''}</small></span>
        </div>
      </div>
    </div>
  `;
}
