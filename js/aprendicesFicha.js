export async function obtenerAprendices(urlFicha) {
  try {
    const respuesta = await fetch(urlFicha);
    if (!respuesta.ok) throw new Error("Error al obtener los aprendices de la ficha.");

    const data = await respuesta.json();

    // Detectar si es un array directo
    if (Array.isArray(data)) {
      return { aprendices: data };
    }

    // Si tiene la propiedad 'aprendices'
    if (data.aprendices && Array.isArray(data.aprendices)) {
      return data;
    }

    // Si tiene otra propiedad con los aprendices (por ejemplo 'datos' o 'ficha')
    const posibleLista = Object.values(data).find(v => Array.isArray(v));
    if (posibleLista) {
      return { aprendices: posibleLista };
    }

    console.warn("⚠️ No se encontró una lista de aprendices en la estructura JSON:", data);
    return { aprendices: [] };

  } catch (error) {
    console.error("❌ Error en obtenerAprendices:", error);
    return { aprendices: [] };
  }
}
