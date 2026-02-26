const firebaseConfig = { apiKey: "TU_API", authDomain: "TU_DOMINIO", databaseURL: "TU_BD" };
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.database();

let usuarioActual = JSON.parse(localStorage.getItem('usuarioLicha')) || null;
let inventario = JSON.parse(localStorage.getItem('inventarioLicha')) || 0;

setInterval(() => {
    document.getElementById('reloj').innerText = new Date().toLocaleString();
}, 1000);

window.onload = () => {
    if (usuarioActual) {
        document.getElementById('titulo-usuario').innerText = usuarioActual.nombre;
        cambiarVista(usuarioActual.rol === 'admin' ? 'vista-admin' : 'vista-empleado');
    }
};

function cambiarVista(id) {
    document.querySelectorAll('.vista').forEach(v => v.classList.remove('activa'));
    document.getElementById(id).classList.add('activa');
}

function login() {
    const email = document.getElementById('email').value;
    const pass = document.getElementById('pass').value;

    if (pass === "TortillasLicha") {
        usuarioActual = { nombre: "Administrador CEO", rol: "admin" };
        localStorage.setItem('usuarioLicha', JSON.stringify(usuarioActual));
        document.getElementById('titulo-usuario').innerText = usuarioActual.nombre;
        cambiarVista('vista-admin');
        return; 
    }

    auth.signInWithEmailAndPassword(email, pass).then(userCred => {
        usuarioActual = { nombre: email.split('@')[0], rol: 'empleado' };
        localStorage.setItem('usuarioLicha', JSON.stringify(usuarioActual));
        document.getElementById('titulo-usuario').innerText = usuarioActual.nombre;
        cambiarVista('vista-empleado');
    }).catch(e => alert("Acceso denegado."));
}

function registrarEntrada() {
    let hora = new Date().toISOString();
    db.ref('checador/' + usuarioActual.nombre + '/entradas').push(hora);
    alert("Entrada registrada.");
}

function cerrarVenta() {
    let cant = parseInt(document.getElementById('cant-vender').value);
    let precio = parseFloat(document.getElementById('precio-paquete').value);
    let total = cant * precio;
    inventario -= cant;
    localStorage.setItem('inventarioLicha', inventario);
    
    db.ref('ventas/' + usuarioActual.nombre).push({ cant, total, fecha: new Date().toISOString() });
    alert(`Cobrar: $${total}. Inventario restante: ${inventario}`);
}

function registrarSalida() {
    let hora = new Date().toISOString();
    db.ref('checador/' + usuarioActual.nombre + '/salidas').push(hora);
    localStorage.clear();
    cambiarVista('vista-login');
}
