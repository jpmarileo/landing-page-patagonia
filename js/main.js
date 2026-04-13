// ==================== CARGA DE COMPONENTES ====================
document.addEventListener('DOMContentLoaded', () => {
  loadComponent('navbar', 'components/navbar.html');
  loadComponent('footer', 'components/footer.html');

  if (document.getElementById('productos-grid')) {
    renderProductos();
  }

  updateCartCount();
});

// Cargar componentes
function loadComponent(id, file) {
  fetch(file)
    .then(res => res.text())
    .then(data => document.getElementById(id).innerHTML = data)
    .catch(err => console.error('Error cargando componente:', err));
}

// ==================== PRODUCTOS ====================
const productos = [
  {
    id: 1,
    nombre: "Camiseta Térmica Base Layer",
    precio: 24990,
    img: "assets/images/camiseta.jpg",
    desc: "Primera capa térmica suave y efectiva"
  },
  {
    id: 2,
    nombre: "Chaqueta Hidrofóbica 3-en-1",
    precio: 89990,
    img: "assets/images/chaqueta.jpg",
    desc: "Impermeable con forro térmico desmontable"
  },
  {
    id: 3,
    nombre: "Pantalón Térmico Softshell",
    precio: 59990,
    img: "assets/images/pantalon.jpg",
    desc: "Protección contra viento y lluvia"
  }
];

let carrito = [];

// Renderizar productos
function renderProductos() {
  const grid = document.getElementById('productos-grid');
  if (!grid) return;

  grid.innerHTML = '';

  productos.forEach(p => {
    const card = document.createElement('div');
    card.className = 'product-card bg-white rounded-3xl overflow-hidden border border-gray-100';
    card.innerHTML = `
      <img src="${p.img}" class="w-full h-64 object-cover" alt="${p.nombre}">
      <div class="p-6">
        <h3 class="font-semibold text-xl mb-2">${p.nombre}</h3>
        <p class="text-gray-500 text-sm mb-4">${p.desc}</p>
        <div class="flex justify-between items-center">
          <span class="text-3xl font-bold">$${p.precio.toLocaleString('es-CL')}</span>
          <button onclick="agregarAlCarrito(${p.id})" 
                  class="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-2xl text-sm font-medium">
            Agregar
          </button>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

// ==================== CARRITO ====================
function agregarAlCarrito(id) {
  const producto = productos.find(p => p.id === id);
  if (!producto) return;

  const existente = carrito.find(item => item.id === id);

  if (existente) {
    existente.cantidad = (existente.cantidad || 1) + 1;
  } else {
    carrito.push({ ...producto, cantidad: 1 });
  }

  updateCartCount();
  mostrarNotificacion(`${producto.nombre} agregado al carrito`);
}

function updateCartCount() {
  const countEl = document.getElementById('cart-count');
  if (!countEl) return;

  const totalItems = carrito.reduce((sum, item) => sum + (item.cantidad || 1), 0);
  countEl.textContent = totalItems;

  // Animación
  countEl.classList.add('scale-125');
  setTimeout(() => countEl.classList.remove('scale-125'), 200);
}

function mostrarNotificacion(mensaje) {
  const notif = document.createElement('div');
  notif.className = 'fixed bottom-6 right-6 bg-green-600 text-white px-6 py-4 rounded-2xl shadow-2xl z-[100] flex items-center gap-3';
  notif.innerHTML = `<i class="fa-solid fa-check-circle"></i><span>${mensaje}</span>`;
  document.body.appendChild(notif);
  setTimeout(() => notif.remove(), 2500);
}

// ==================== MODAL DEL CARRITO ====================
function toggleCart() {
  let modal = document.getElementById('cart-modal');
  
  if (!modal) {
    crearModalCarrito();
    modal = document.getElementById('cart-modal');
  }
  
  modal.classList.toggle('hidden');
  if (!modal.classList.contains('hidden')) {
    renderCartItems();
  }
}

function crearModalCarrito() {
  const modalHTML = `
    <div id="cart-modal" class="hidden fixed inset-0 bg-black/70 flex items-center justify-center z-[200]">
      <div class="bg-white rounded-3xl max-w-lg w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col">
        <div class="p-6 border-b flex justify-between items-center">
          <h3 class="font-semibold text-2xl">Tu Carrito</h3>
          <button onclick="toggleCart()" class="text-3xl leading-none text-gray-400 hover:text-gray-600">×</button>
        </div>
        
        <div id="cart-items" class="p-6 overflow-auto flex-1 space-y-6"></div>
        
        <div class="p-6 border-t bg-gray-50">
          <div class="flex justify-between text-xl font-semibold mb-6">
            <span>Total</span>
            <span id="cart-total">$0</span>
          </div>
          <button onclick="finalizarCompra()" 
                  class="w-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-5 rounded-3xl font-semibold text-lg">
            Finalizar por WhatsApp
          </button>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function renderCartItems() {
  const container = document.getElementById('cart-items');
  const totalEl = document.getElementById('cart-total');
  let total = 0;

  container.innerHTML = '';

  if (carrito.length === 0) {
    container.innerHTML = `<p class="text-center text-gray-500 py-12">Tu carrito está vacío</p>`;
    totalEl.textContent = '$0';
    return;
  }

  carrito.forEach((item, index) => {
    const subtotal = item.precio * (item.cantidad || 1);
    total += subtotal;

    const div = document.createElement('div');
    div.className = 'flex gap-4';
    div.innerHTML = `
      <img src="${item.img}" class="w-20 h-20 object-cover rounded-2xl">
      <div class="flex-1">
        <h4 class="font-medium">${item.nombre}</h4>
        <p class="text-cyan-600">$${item.precio.toLocaleString('es-CL')}</p>
        
        <div class="flex items-center gap-4 mt-3">
          <button onclick="cambiarCantidad(${index}, -1)" class="w-8 h-8 border rounded-xl hover:bg-gray-100">-</button>
          <span class="font-semibold w-6 text-center">${item.cantidad || 1}</span>
          <button onclick="cambiarCantidad(${index}, 1)" class="w-8 h-8 border rounded-xl hover:bg-gray-100">+</button>
          <button onclick="eliminarDelCarrito(${index})" class="ml-auto text-red-500 hover:text-red-700">Eliminar</button>
        </div>
      </div>
    `;
    container.appendChild(div);
  });

  totalEl.textContent = `$${total.toLocaleString('es-CL')}`;
}

function cambiarCantidad(index, cambio) {
  if (!carrito[index]) return;
  carrito[index].cantidad = (carrito[index].cantidad || 1) + cambio;
  
  if (carrito[index].cantidad < 1) carrito.splice(index, 1);
  
  renderCartItems();
  updateCartCount();
}

function eliminarDelCarrito(index) {
  carrito.splice(index, 1);
  renderCartItems();
  updateCartCount();
}

function finalizarCompra() {
  if (carrito.length === 0) return;

  let mensaje = "Hola ThermaShield, quiero comprar:\n\n";
  carrito.forEach(item => {
    mensaje += `• ${item.nombre} × ${item.cantidad || 1}\n`;
  });
  
  const total = carrito.reduce((sum, item) => sum + item.precio * (item.cantidad || 1), 0);
  mensaje += `\nTotal: $${total.toLocaleString('es-CL')}\n\n¿Podemos coordinar el pago y envío?`;

  window.open(`https://wa.me/56982121220?text=${encodeURIComponent(mensaje)}`, '_blank');
}
