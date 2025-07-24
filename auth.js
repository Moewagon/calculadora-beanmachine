// Simple authentication helper for frontend
let loggedIn = false;
if (typeof window !== "undefined") window.loggedIn = loggedIn;

async function apiLogin(username, password) {
  const res = await fetch('/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ username, password })
  });
  if (!res.ok) {
    throw new Error('login failed');
  }
  loggedIn = true;
  if (typeof window !== "undefined") window.loggedIn = loggedIn;
}

async function apiLogout() {
  await fetch('/logout', { method: 'POST', credentials: 'include' });
  loggedIn = false;
  if (typeof window !== "undefined") window.loggedIn = loggedIn;
}

async function apiGetTickets() {
  const res = await fetch('/tickets', { credentials: 'include' });
  if (!res.ok) return null;
  return res.json();
}

async function apiSaveTicket(ticket) {
  if (!loggedIn) return;
  await fetch('/tickets', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(ticket)
  });
}

function renderTickets(tickets) {
  const listaPedidos = document.getElementById('lista-pedidos');
  listaPedidos.innerHTML = '<h2>Lista de pedidos - <span>Ingresos: <span id="total-pedidos">0</span>$</span></h2>';
  if (!tickets) return;
  let ingresos = 0;
  tickets.forEach(t => {
    const divPedido = document.createElement('div');
    divPedido.classList.add('pedido-card');
    t.items.forEach(it => {
      divPedido.innerHTML += `<p>${it.cantidad}x - ${it.nombre} - ${it.precio} $</p>`;
    });
    const hora = new Date(t.timestamp).toLocaleTimeString();
    divPedido.innerHTML += `<p>Total del pedido: <span class="pedido-card-total">${t.total}</span>$<br><br>Hora: ${hora}<br><button class="botonborrar" onclick="eliminarDiv(this)"><i class="bi bi-trash"></i></button></p>`;
    listaPedidos.appendChild(divPedido);
    ingresos += t.total;
  });
  document.getElementById('total-pedidos').textContent = ingresos;
}

document.addEventListener('DOMContentLoaded', async () => {
  const loginForm = document.getElementById('login-form');
  const logoutBtn = document.getElementById('logout-btn');
  const status = document.getElementById('login-status');

  loginForm.addEventListener('submit', async e => {
    e.preventDefault();
    const u = document.getElementById('username').value;
    const p = document.getElementById('password').value;
    try {
      await apiLogin(u, p);
      loginForm.style.display = 'none';
      logoutBtn.style.display = 'inline-block';
      status.textContent = u;
      const tickets = await apiGetTickets();
      renderTickets(tickets);
    } catch (err) {
      status.textContent = 'Error de login';
    }
  });

  logoutBtn.addEventListener('click', async () => {
    await apiLogout();
    loginForm.style.display = 'block';
    logoutBtn.style.display = 'none';
    status.textContent = '';
    renderTickets([]);
  });

  // Check existing session
  const tickets = await apiGetTickets();
  if (tickets) {
    loggedIn = true;
    loginForm.style.display = 'none';
    logoutBtn.style.display = 'inline-block';
    status.textContent = 'Sesion activa';
    renderTickets(tickets);
  }
});

// make saveTicket available to productos.js
if (typeof window !== 'undefined') {
  window.apiSaveTicket = apiSaveTicket;
  window.loggedIn = loggedIn;
}
