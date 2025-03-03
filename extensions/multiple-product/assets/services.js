document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll("#combo-products-list li").forEach((item) => {
    let productId = item.getAttribute("data-product-id");
    let url = `/products/${productId}.json`; // Fetch product data

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (data.product) {
          item.innerHTML = `
            <p><strong>Title:</strong> <a href="${data.product.url}">${data.product.title}</a></p>
            <img src="${data.product.images[0]}" width="100">
          `;
        } else {
          item.innerHTML = `<p>⚠️ Product Not Found</p>`;
        }
      })
      .catch(() => {
        item.innerHTML = `<p>⚠️ Failed to load product data.</p>`;
      });
  });
});
