/**
 * login.js – Lógica del formulario de inicio de sesión
 * ADVERTENCIA: Credenciales embebidas solo con fines educativos.
 * En aplicaciones reales, la autenticación debe realizarse en el servidor.
 */

// Credenciales quemadas en el código (solo educativo)
const USUARIO_VALIDO = 'futtzap';
const CONTRASENA_VALIDA = '1234';

/**
 * Maneja el intento de inicio de sesión.
 * Valida las credenciales y redirige si son correctas.
 */
function handleLogin() {
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();
  const errorMsg = document.getElementById('errorMsg');

  // Validación básica de campos vacíos
  if (!username || !password) {
    mostrarError('Por favor completa todos los campos.');
    return;
  }

  // Comparación de credenciales
  if (username === USUARIO_VALIDO && password === CONTRASENA_VALIDA) {
    // Guardar sesión simulada en sessionStorage
    sessionStorage.setItem('sesionActiva', 'true');
    window.location.href = 'index.html';
  } else {
    mostrarError('Usuario o contraseña incorrectos.');
  }
}

/**
 * Muestra el mensaje de error en pantalla.
 * @param {string} mensaje - Texto del error a mostrar.
 */
function mostrarError(mensaje) {
  const errorMsg = document.getElementById('errorMsg');
  errorMsg.textContent = mensaje;
  errorMsg.classList.add('visible');
}

// Permitir envío con la tecla Enter
document.addEventListener('keydown', function (e) {
  if (e.key === 'Enter') handleLogin();
});
