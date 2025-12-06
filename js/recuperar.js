// recuperar

var passwordRegex = /^(?=.*[A-Z])(?=.*[\W_]).{8,}$/;

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

// Mostrar / ocultar contraseña
function mostrarOcultarPassRecuperar() {
  var check = document.getElementById("mostrarNewPass");
  var campo = document.getElementById("newPassword");

  if (check.checked) campo.type = "text";
  else campo.type = "password";
}

// ========================================
// Recuperación / actualización
// ========================================
function recuperarPassword() {
  var email = document.getElementById("emailRecup").value;
  var nueva = document.getElementById("newPassword").value;

  var errEmail = document.getElementById("emailRecupError");
  var errPass = document.getElementById("newPassError");
  var msg = document.getElementById("recupMensaje");

  errEmail.innerHTML = "";
  errPass.innerHTML = "";
  msg.innerHTML = "";

  if (email === "") {
    errEmail.innerHTML = "Ingrese un correo.";
    return;
  }

  if (!passwordRegex.test(nueva) || nueva === "1234") {
    errPass.innerHTML =
      "Contraseña inválida. Debe tener 8+ caracteres, una mayúscula y un carácter especial. No usar 1234.";
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
    errEmail.innerHTML = "No existe una cuenta con ese correo.";
    return;
  }

  usuarios[pos].password = nueva;
  usuarios[pos].intentos = 0;
  usuarios[pos].bloqueado = 0;

  guardarUsuarios(usuarios);

  msg.innerHTML = "Contraseña actualizada. Ya puede iniciar sesión.";
  msg.className = "success";

  document.getElementById("formRecuperar").reset();
}
