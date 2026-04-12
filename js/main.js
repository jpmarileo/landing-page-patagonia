// Cargar componentes reutilizables
document.addEventListener('DOMContentLoaded', () => {
  loadComponent('navbar', 'components/navbar.html');
  loadComponent('footer', 'components/footer.html');

  // Si estamos en la página de productos, cargar los productos
  if (document.getElementById('productos-grid')) {
    renderProductos();
  }
});

function loadComponent(id, file) {
  fetch(file)
    .then(response => response.text())
    .then(data => {
      document.getElementById(id).innerHTML = data;
    })
    .catch(err => console.error('Error cargando ' + file, err));
}

// Productos
const productos = [
  {
    id: 1,
    nombre: "Camiseta Térmica Base Layer",
    precio: 24990,
    img: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?ixlib=rb-4.0.3&auto=format&fit=crop&q=80",
    desc: "Primera capa térmica. Mantiene el calor corporal."
  },
  {
    id: 2,
    nombre: "Chaqueta Hidrofóbica 3-en-1",
    precio: 89990,
    img: "https://images.unsplash.com/photo-1544022616-0f8f3c8f5c3f?ixlib=rb-4.0.3&auto=format&fit=crop&q=80",
    desc: "Impermeable + forro térmico desmontable."
  },
  {
    id: 3,
    nombre: "Pantalón Térmico Softshell",
    precio: 59990,
    img: "https://images.unsplash.com/photo-1604176354201-9268730608-1c4c6c5b5b5c?ixlib=rb-4.0.3&auto=format&fit=crop&q=80",
    desc: "Protección contra viento y lluvia."
  }
];

function renderProductos() {
  const grid = document.getElementById('productos-grid');
  grid.innerHTML = '';

  productos.forEach(p => {
    const card = document.createElement('div');
    card.className = 'product-card bg-white rounded-3xl overflow-hidden border border-gray-100';
    card.innerHTML = `
      <img src="${p.img}" class="w-full h-64 object-cover">
      <div class="p-6">
        <h3 class="font-semibold text-xl">${p.nombre}</h3>
        <p class="text-gray-500 text-sm mt-2">${p.desc}</p>
        <div class="mt-6 flex justify-between items-center">
          <span class="text-3xl font-bold">$${p.precio.toLocaleString('es-CL')}</span>
          <button onclick="agregarAlCarrito(${p.id})" 
                  class="bg-cyan-600 text-white px-6 py-3 rounded-2xl hover:bg-cyan-700">
            Agregar
          </button>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

let carrito = [];

function agregarAlCarrito(id) {
  const producto = productos.find(p => p.id === id);
  carrito.push(producto);
  alert(`${producto.nombre} agregado al carrito`);
  console.log('Carrito:', carrito);
}
