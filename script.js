const productForm = document.getElementById('productForm');
const addProductButton = document.getElementById('addProductButton');
const deleteProductButton = document.getElementById('deleteProductButton');
const productList = document.getElementById('productList');
let productsByCategory = {};
if (localStorage.getItem('products')) {
    productsByCategory = JSON.parse(localStorage.getItem('products'));
    updateProductList();
}
addProductButton.addEventListener('click', function(event) {
    event.preventDefault();
    productForm.style.display = 'block';
    addProductButton.classList.remove('active');
    deleteProductButton.classList.add('active');
});
deleteProductButton.addEventListener('click', function(event) {
    event.preventDefault();
    productForm.style.display = 'none';
    addProductButton.classList.add('active');
    deleteProductButton.classList.remove('active');
});
productForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const formData = new FormData(this);
    const productName = formData.get('productName');
    const category = formData.get('category');
    const stock = parseInt(formData.get('stock'));
    const supplier = formData.get('supplier');
    if (!productsByCategory[category]) {
        productsByCategory[category] = [];
    }
    const product = {
        name: productName,
        stock: stock,
        supplier: supplier
    };
    productsByCategory[category].push(product);
    updateProductList();
    this.reset();
    localStorage.setItem('products', JSON.stringify(productsByCategory));
});
function updateProductList() {
    productList.innerHTML = '';
    for (const category in productsByCategory) {
        const categoryContainer = document.createElement('div');
        categoryContainer.classList.add('category-container');
        const categoryHeader = document.createElement('h4');
        categoryHeader.classList.add('category-header');
        categoryHeader.textContent = `${category.charAt(0).toUpperCase() + category.slice(1)}:`;
        categoryContainer.appendChild(categoryHeader);
        const table = document.createElement('table');
        table.classList.add('product-table');
        table.style.width = '100%';
        const headerRow = document.createElement('tr');
        headerRow.style.borderBottom = '1px solid #ddd';
        const headers = ['Product Name', 'Stock', 'Supplier', 'Actions'];
        headers.forEach(headerText => {
            const header = document.createElement('th');
            header.textContent = headerText;
            header.style.padding = '10px';
            headerRow.appendChild(header);
        });
        table.appendChild(headerRow);
        productsByCategory[category].forEach(product => {
            const row = document.createElement('tr');
            row.style.borderBottom = '1px solid #ddd';
            const cells = ['name', 'stock', 'supplier'];
            cells.forEach(cellName => {
                const cell = document.createElement('td');
                cell.textContent = product[cellName];
                cell.style.padding = '10px';
                row.appendChild(cell);
            });
            const deleteCell = document.createElement('td');
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', function() {
                const index = productsByCategory[category].indexOf(product);
                if (index > -1) {
                    productsByCategory[category].splice(index, 1);
                    updateProductList();
                    localStorage.setItem('products', JSON.stringify(productsByCategory));
                }
            });
            deleteButton.style.backgroundColor = '#000';
            deleteButton.style.color = '#fff';
            deleteButton.style.border = 'none';
            deleteButton.style.borderRadius = '5px';
            deleteButton.style.padding = '5px 10px';
            deleteCell.appendChild(deleteButton);
            row.appendChild(deleteCell);
            table.appendChild(row);
        });
        categoryContainer.appendChild(table);
        productList.appendChild(categoryContainer);
    }
}
