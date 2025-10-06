import { obtenerFichas } from "./fichasADSO.js";
import { obtenerAprendices } from "./aprendicesFicha.js";

const usuario = localStorage.getItem("usuario");
if (!usuario) {
  alert(" Debes iniciar sesión primero.");
  window.location.href = "index.html";
}

document.getElementById("nombreUsuario").textContent = usuario;
const selectFicha = document.getElementById("selectFicha");
const selectAprendiz = document.getElementById("selectAprendiz");
const infoAprendiz = document.getElementById("infoAprendiz");
const resultados = document.getElementById("resultados");
const btnSalir = document.getElementById("btnSalir");

async function cargarFichas() {
  const fichas = await obtenerFichas();

  if (fichas.length === 0) {
    alert("No se pudieron cargar las fichas. Revisa la conexión o el JSON.");
    return;
  }

  fichas.forEach(f => {
    const option = document.createElement("option");
    option.value = f.url;
    option.textContent = `Ficha ${f.codigo}`;
    selectFicha.appendChild(option);
  });
}
cargarFichas();

selectFicha.addEventListener("change", async () => {
  selectAprendiz.innerHTML = "<option value=''>Seleccione aprendiz...</option>";
  resultados.innerHTML = "";
  infoAprendiz.innerHTML = "";

  const urlFicha = selectFicha.value;
  if (!urlFicha) return;

  const data = await obtenerAprendices(urlFicha);
  const registros = data.aprendices || [];

  if (registros.length === 0) {
    alert("⚠️ No se encontraron registros de aprendices en esta ficha.");
    return;
  }

  // Agrupar por número de documento
  const agrupado = {};
  registros.forEach(r => {
    const doc = r["Número de Documento"];
    if (!agrupado[doc]) {
      agrupado[doc] = {
        documento: doc,
        nombre: r["Nombre"],
        apellidos: r["Apellidos"],
        registros: []
      };
    }
    agrupado[doc].registros.push(r);
  });

  const aprendices = Object.values(agrupado);

  aprendices.forEach(a => {
    const option = document.createElement("option");
    option.value = a.documento;
    option.textContent = a.documento;
    selectAprendiz.appendChild(option);
  });

  // Guardar en dataset para uso posterior
  selectAprendiz.dataset.aprendices = JSON.stringify(aprendices);
});

// --- Cuando se selecciona un aprendiz ---
selectAprendiz.addEventListener("change", () => {
  const aprendices = JSON.parse(selectAprendiz.dataset.aprendices || "[]");
  const aprendiz = aprendices.find(a => a.documento == selectAprendiz.value);

  if (!aprendiz) {
    alert("No se encontró la información del aprendiz seleccionado.");
    return;
  }

  let aprobados = 0, porEvaluar = 0;
  let htmlResultados = "";

  aprendiz.registros.forEach(r => {
    const juicio = r["Juicio de Evaluación"]?.trim().toUpperCase() || "POR EVALUAR";
    if (juicio === "APROBADO") aprobados++;
    else porEvaluar++;

    const instructor = r["Funcionario que registro el juicio evaluativo"]?.trim() || "-";
    const fecha = r["Fecha y Hora del Juicio Evaluativo"]?.trim() || "-";

    htmlResultados += `
      <tr>
        <td>${r["Competencia"] || "-"}</td>
        <td>${r["Resultado de Aprendizaje"] || "-"}</td>
        <td>${juicio}</td>
        <td>${fecha}</td>
        <td>${instructor}</td>
      </tr>
    `;
  });

  infoAprendiz.innerHTML = `
    <h3>${aprendiz.nombre} ${aprendiz.apellidos}</h3>
    <p>Documento: <strong>${aprendiz.documento}</strong></p>
    <p> Aprobados: <strong>${aprobados}</strong> |  Por Evaluar: <strong>${porEvaluar}</strong></p>
  `;

  resultados.innerHTML = htmlResultados;
});

btnSalir.addEventListener("click", () => {
  localStorage.clear();
  window.location.href = "index.html";
});
