/**
 * Generador de script cliente para renderizar las secciones de Ecuaciones Lógicas,
 * Solución Adoptada y Análisis Didáctico.
 * Capa de infraestructura.
 */

export function generarScriptDetalleTecnico() {
  return `
  function crearSeccionesTecnicasHtml(ej) {
    let html = '';

    if (ej.eq && ej.eq.length > 0) {
      html += '<div class="bloque-detalle-tecnico bloque-ecuaciones">';
      html += '<h3 class="subtitulo-seccion-tecnica">Ecuaciones Lógicas</h3>';
      html += '<pre class="codigo-ecuaciones"><code>' + ej.eq.map(e => e.replace(/</g, '&lt;').replace(/>/g, '&gt;')).join('\\n') + '</code></pre>';
      html += '</div>';
    }

    if (ej.sol) {
      html += '<div class="bloque-detalle-tecnico bloque-solucion-adoptada">';
      html += '<h3 class="subtitulo-seccion-tecnica">Solución Adoptada</h3>';
      html += '<p class="parrafo-solucion-adoptada">' + enriquecerTexto(ej.sol) + '</p>';
      html += '</div>';
    }

    if (ej.e) {
      html += '<div class="bloque-detalle-tecnico bloque-analisis-didactico">';
      html += '<h3 class="subtitulo-seccion-tecnica">Solución y Análisis Técnico</h3>';
      html += '<p class="parrafo-analisis-didactico">' + enriquecerTexto(ej.e) + '</p>';
      html += '</div>';
    }

    return html;
  }
`;
}
