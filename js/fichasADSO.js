export async function obtenerFichas() {
  try {
    const urlPrincipal = "https://raw.githubusercontent.com/CesarMCuellarCha/apis/refs/heads/main/JUICIOS_ADSO.json";
    const respuesta = await fetch(urlPrincipal);

    if (!respuesta.ok) throw new Error("Error al obtener el JSON principal de fichas.");

    const data = await respuesta.json();

    if (!data.fichas || !Array.isArray(data.fichas)) {
      throw new Error("Formato del JSON inválido: no se encontró la propiedad 'fichas'.");
    }

    // Devolvemos la lista de fichas con su código y URL
    return data.fichas.map(f => ({
      codigo: f.codigo,
      url: f.url
    }));
  } catch (error) {
    console.error("❌ Error en obtenerFichas:", error);
    return [];
  }
}
