//  login 


function cargarUsuariosTexto() {
  var texto = localStorage.getItem("usuariosTexto");
  if (texto === null || texto === "") {
    texto = "Usuario Ejemplo|ejemplo@dominio.com|+59171234567|Ejemplo@123|0|0";
    localStorage.setItem("usuariosTexto", texto);
  }
  return texto;
}

function convertirTextoAUsuarios(texto) {
  var usuarios = [];
  var partes = texto.split(";");
  var i;

  for (i = 0; i < partes.length; i++) {
    if (partes[i] !== "") {
      var c = partes[i].split("|");
      usuarios.push({
        nombreCompleto: c[0],
        email: c[1],
        celular: c[2],
        password: c[3],
        intentos: parseInt(c[4]),
        bloqueado: parseInt(c[5])
      });
    }
  }
  return usuarios;
}

function convertirUsuariosATexto(usuarios) {
  var texto = "";
  var i;

  for (i = 0; i < usuarios.length; i++) {
    var u = usuarios[i];
    if (texto !== "") texto += ";";

    texto +=
      u.nombreCompleto + "|" +
      u.email + "|" +
      u.celular + "|" +
      u.password + "|" +
      u.intentos + "|" +
      u.bloqueado;
  }

  return texto;
}

function obtenerUsuarios() {
  return convertirTextoAUsuarios(cargarUsuariosTexto());
}

function guardarUsuarios(usuarios) {
  localStorage.setItem("usuariosTexto", convertirUsuariosATexto(usuarios));
}

// ================================
// Mostrar / ocultar password
// ================================
function mostrarOcultarPassLogin() {
  var check = document.getElementById("mostrarPassLogin");
  var campo = document.getElementById("passwordLogin");

  if (check.checked) campo.type = "text";
  else campo.type = "password";
}

// ================================
// Inicio de sesión
// ================================
function iniciarSesion() {
  var email = document.getElementById("emailLogin").value;
  var password = document.getElementById("passwordLogin").value;

  var err = document.getElementById("loginError");
  var msg = document.getElementById("loginMensaje");
  var link = document.getElementById("linkRecuperar");

  err.innerHTML = "";
  msg.innerHTML = "";
  link.style.display = "none";

  if (email === "" || password === "") {
    err.innerHTML = "Complete ambos campos.";
    return;
  }

  var usuarios = obtenerUsuarios();
  var i;
  var pos = -1;

  for (i = 0; i < usuarios.length; i++) {
    if (usuarios[i].email === email) {
      pos = i;
    }
  }

  if (pos === -1) {
    err.innerHTML = "Usuario o contraseña incorrectos.";
    return;
  }

  var u = usuarios[pos];

  if (u.bloqueado === 1) {
    err.innerHTML = "Cuenta bloqueada. Debe recuperar la contraseña.";
    link.style.display = "inline";
    return;
  }

  if (u.password === password) {
    u.intentos = 0;
    guardarUsuarios(usuarios);

    msg.innerHTML = "Bienvenido, " + u.nombreCompleto + ".";
    msg.className = "success";
  } else {
    u.intentos++;

    if (u.intentos >= 3) {
      u.bloqueado = 1;
      guardarUsuarios(usuarios);
      err.innerHTML = "Cuenta bloqueada por 3 intentos.";
      link.style.display = "inline";
    } else {
      guardarUsuarios(usuarios);
      err.innerHTML =
        "Contraseña incorrecta. Intentos restantes: " + (3 - u.intentos);
    }
  }
}
