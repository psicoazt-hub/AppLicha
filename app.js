const firebaseConfig = { apiKey: "TU_API", authDomain: "TU_DOMINIO", databaseURL: "TU_BD" };
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.database();

let usuarioActual = JSON.parse(localStorage.getItem('usuarioLicha')) || null;
let inventario = JSON.parse(localStorage.getItem('inventarioLicha')) || 0;

setInterval(() => {
    const reloj = document.getElementById('reloj');
    if(reloj) reloj.innerText = new Date().toLocaleString();
}, 1000);

window.onload = () => {
    if (usuarioActual) {
        document.getElementById('titulo-usuario').innerText = usuarioActual.nombre;
        cambiarVista(usuarioActual.rol === 'admin' ? 'vista-admin' : 'vista-empleado');
    }
};

function cambiarVista(id) {
    document.querySelectorAll('.vista').forEach(v => v.classList.remove('activa'));
    const vista = document.getElementById(id);
    if(vista) vista.classList.add('activa');
}

function login() {
    const pass = document.getElementById('pass').value;
    if (pass === "TortillasLicha") {
        usuarioActual = { nombre: "Administrador CEO", rol: "admin" };
        localStorage.setItem('usuarioLicha', JSON.stringify(usuarioActual));
        document.getElementById('titulo-usuario').innerText = usuarioActual.nombre;
        cambiarVista('vista-admin');
        return; 
    }
    alert("Contraseña incorrecta.");
}

function mostrarVentas() { cambiarVista('vista-ventas'); }
function toggleMenuEspeciales() {
    const menu = document.getElementById('menu-especiales');
    if(menu) menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
}
function aceptarInventario() {
    inventario = parseInt(document.getElementById('inv-diario').value) || 0;
    localStorage.setItem('inventarioLicha', inventario);
    alert("Inventario listo: " + inventario);
}
function registrarEntrada() { alert("Entrada registrada."); }
function registrarSalida() { localStorage.clear(); location.reload(); }
