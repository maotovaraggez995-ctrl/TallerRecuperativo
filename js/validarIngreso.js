export function validarIngreso(usuario, contrasena) {
  const userValido = usuario.trim();
  const passValida = "06102025";

  if (contrasena === passValida) {
    localStorage.setItem("usuario", userValido);
    window.location.href = "juiciosAprendicesFicha.html";
  } else {
    alert(" Contraseña incorrecta. Intenta de nuevo.");
  }
}
