// registro

// Expresiones regulares
var emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
var nombreRegex = /^[A-Za-zÁÉÍÓÚÑáéíóúñ ]+$/;
var passwordRegex = /^(?=.*[A-Z])(?=.*[\W_]).{8,}$/;
var celularRegex = /^(\+591)?[67][0-9]{7}$/;

// ================================
// Cargar texto desde localStorage
// ================================
function cargarUsuariosTexto() {
  var texto = localStorage.getItem("usuariosTexto");

  if (texto === null || texto === "") {
    texto = "Usuario Ejemplo|ejemplo@dominio.com|+59171234567|Ejemplo@123|0|0";
    localStorage.setItem("usuariosTexto", texto);
  }

  return texto;
}

// ================================
// Convertir texto → arreglo
// ================================
function convertirTextoAUsuarios(texto) {
  var usuarios = [];
  var partes = texto.split(";");
  var i;

  for (i = 0; i < partes.length; i++) {
    if (partes[i] !== "") {
      var campos = partes[i].split("|");

      usuarios.push({
        nombreCompleto: campos[0],
        email: campos[1],
        celular: campos[2],
        password: campos[3],
        intentos: parseInt(campos[4]),
        bloqueado: parseInt(campos[5])
      });
    }
  }

  return usuarios;
}

// ================================
// Convertir arreglo → texto
// ================================
function convertirUsuariosATexto(usuarios) {
  var texto = "";
  var i;

  for (i = 0; i < usuarios.length; i++) {
    var u = usuarios[i];

    if (texto !== "") {
      texto = texto + ";";
    }

    texto =
      texto +
      u.nombreCompleto + "|" +
      u.email + "|" +
      u.celular + "|" +
      u.password + "|" +
      u.intentos + "|" +
      u.bloqueado;
  }

  return texto;
}

// ================================
function obtenerUsuarios() {
  var texto = cargarUsuariosTexto();
  return convertirTextoAUsuarios(texto);
}

function guardarUsuarios(usuarios) {
  var texto = convertirUsuariosATexto(usuarios);
  localStorage.setItem("usuariosTexto", texto);
}

// ================================
// Mostrar / ocultar contraseña
// ================================
function mostrarOcultarPassRegistro() {
  var check = document.getElementById("mostrarPass");
  var campo = document.getElementById("password");

  if (check.checked) campo.type = "text";
  else campo.type = "password";
}

// ================================
// Registrar
// ================================
function registrar() {
  var nombre = document.getElementById("nombre").value;
  var email = document.getElementById("email").value;
  var celular = document.getElementById("celular").value;
  var password = document.getElementById("password").value;

  var nombreError = document.getElementById("nombreError");
  var emailError = document.getElementById("emailError");
  var celularError = document.getElementById("celularError");
  var passwordError = document.getElementById("passwordError");
  var mensaje = document.getElementById("mensaje");

  nombreError.innerHTML = "";
  emailError.innerHTML = "";
  celularError.innerHTML = "";
  passwordError.innerHTML = "";
  mensaje.innerHTML = "";

  // Validaciones básicas
  if (!nombreRegex.test(nombre)) {
    nombreError.innerHTML = "Nombre inválido.";
    return;
  }

  if (!emailRegex.test(email)) {
    emailError.innerHTML = "Correo inválido.";
    return;
  }

  if (!celularRegex.test(celular)) {
    celularError.innerHTML = "Celular inválido.";
    return;
  }

  if (!passwordRegex.test(password) || password === "1234") {
    passwordError.innerHTML =
      "La contraseña debe tener 8+ caracteres, 1 mayúscula y 1 carácter especial. No usar 1234.";
    return;
  }

  // Verificar duplicado
  var usuarios = obtenerUsuarios();
  var i;
  for (i = 0; i < usuarios.length; i++) {
    if (usuarios[i].email === email) {
      emailError.innerHTML = "Ese correo ya está registrado.";
      return;
    }
  }

  // Registrar
  usuarios.push({
    nombreCompleto: nombre,
    email: email,
    celular: celular,
    password: password,
    intentos: 0,
    bloqueado: 0
  });

  guardarUsuarios(usuarios);

  mensaje.innerHTML = "¡Registro exitoso!";
  mensaje.className = "success";

  document.getElementById("formRegistro").reset();
}
