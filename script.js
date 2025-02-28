const precios = JSON.parse(localStorage.getItem('precios')) || {
  automovil: {
    enjuague: 25000,
    motor: 20000,
    polinchada: 60000,
    porDebajo: 20000,
    total: 125000
  },
  camioneta: {
    enjuague: 30000,
    motor: 25000,
    polinchada: 65000,
    porDebajo: 20000,
    total: 140000
  },
  moto: {
    lavado: 15000
  }
};

let historial = JSON.parse(localStorage.getItem('historial')) || [];
let lavadores = JSON.parse(localStorage.getItem('lavadores')) || ["Juan López", "María Gómez", "Carlos Ramírez"];

function login() {
  const role = document.getElementById('user-role').value;
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  if (!role || !username || !password) {
    alert('Por favor, complete todos los campos.');
    return;
  }

  // Validación básica de roles
  if (role === 'admin' && username === 'admin' && password === 'admin123') {
    showSection('admin-section');
  } else if (role === 'lavador' && username === 'lavador' && password === 'lavador123') {
    showSection('lavador-section');
  } else if (role === 'cliente' && username === 'cliente' && password === 'cliente123') {
    showSection('cliente-section');
  } else {
    alert('Credenciales incorrectas.');
  }
}

function showSection(sectionId) {
  document.querySelectorAll('.container').forEach(container => {
    container.style.display = 'none';
  });
  document.querySelector(`.${sectionId}`).style.display = 'block';
}

function agregarLavador() {
  const nuevoLavador = document.getElementById('new-lavador').value.trim();
  if (!nuevoLavador) {
    alert('Por favor, ingrese un nombre válido.');
    return;
  }

  lavadores.push(nuevoLavador);
  localStorage.setItem('lavadores', JSON.stringify(lavadores));
  alert('Lavador agregado correctamente.');
}

function guardarPrecios() {
  precios.automovil.enjuague = parseFloat(document.getElementById('precio-automovil-enjuague').value);
  precios.camioneta.enjuague = parseFloat(document.getElementById('precio-camioneta-enjuague').value);
  precios.moto.lavado = parseFloat(document.getElementById('precio-moto-lavado').value);

  localStorage.setItem('precios', JSON.stringify(precios));
  alert('Precios guardados correctamente.');
}

function cargarServicios() {
  const categoria = document.getElementById('categoria').value;
  const serviciosContainer = document.getElementById('servicios-list');
  const serviciosDiv = document.getElementById('servicios-container');

  if (!categoria) {
    serviciosDiv.style.display = 'none';
    return;
  }

  serviciosContainer.innerHTML = '';
  if (categoria === 'moto') {
    const checkbox = document.createElement('label');
    checkbox.innerHTML = `
      <input type="checkbox" value="lavado" data-precio="${precios.moto.lavado}" checked disabled>
      Lavado ($${precios.moto.lavado})
    `;
    serviciosContainer.appendChild(checkbox);
    calcularTotal();
    serviciosDiv.style.display = 'block';
    return;
  }

  const servicios = [
    { nombre: 'Enjuague', clave: 'enjuague' },
    { nombre: 'Motor', clave: 'motor' },
    { nombre: 'Polinchada', clave: 'polinchada' },
    { nombre: 'Por debajo', clave: 'porDebajo' }
  ];

  servicios.forEach(servicio => {
    const precio = precios[categoria][servicio.clave];
    const checkbox = document.createElement('label');
    checkbox.innerHTML = `
      <input type="checkbox" value="${servicio.clave}" data-precio="${precio}">
      ${servicio.nombre} ($${precio})
    `;
    serviciosContainer.appendChild(checkbox);
  });

  serviciosDiv.style.display = 'block';
  calcularTotal();
}

function calcularTotal() {
  const checkboxes = document.querySelectorAll('#servicios-list input[type="checkbox"]:checked');
  let total = 0;
  checkboxes.forEach(checkbox => {
    total += parseFloat(checkbox.getAttribute('data-precio'));
  });
  document.getElementById('total').textContent = `
