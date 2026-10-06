/**
 * Generador de script cliente para renderizar las secciones de Ecuaciones Lógicas,
 * Solución Adoptada y Análisis Didáctico.
 * Capa de infraestructura.
 */

export function generarScriptDetalleTecnico() {
  return `
  function crearSeccionesTecnicasHtml(ej) {
    let html = '';

    const tieneEq = Boolean(ej.eq && ej.eq.length > 0);
    const tieneSol = Boolean(ej.sol);

    if (tieneEq || tieneSol) {
      html += '<div class="bloque-fila-tecnica">';

      if (tieneEq) {
        html += '<div class="bloque-detalle-tecnico bloque-ecuaciones">';
        html += '<h3 class="subtitulo-seccion-tecnica">Ecuaciones Lógicas</h3>';
        html += '<pre class="codigo-ecuaciones"><code>' + ej.eq.map(e => e.replace(/</g, '&lt;').replace(/>/g, '&gt;')).join('\\n') + '</code></pre>';
        html += '</div>';
      }

      if (tieneSol) {
        html += '<div class="bloque-detalle-tecnico bloque-solucion-adoptada">';
        html += '<h3 class="subtitulo-seccion-tecnica">Solución Adoptada</h3>';
        html += '<p class="parrafo-solucion-adoptada">' + enriquecerTexto(ej.sol) + '</p>';
        html += '</div>';
      }

      html += '</div>';
    }

    if (ej.e) {
      html += '<div class="bloque-detalle-tecnico bloque-analisis-didactico">';
      html += '<h3 class="subtitulo-seccion-tecnica">Solución y Análisis Técnico</h3>';
      html += '<p class="parrafo-analisis-didactico">' + enriquecerTexto(ej.e) + '</p>';
      html += '</div>';
    }

    if (ej.guiaLogo) {
      const g = ej.guiaLogo;
      html += '<div class="bloque-guia-logo">';
      html += '<div class="encabezado-guia-logo">';
      html += '<span class="icono-guia-logo">📐</span>';
      html += '<h3 class="titulo-guia-logo">Guía de Construcción en LOGO!Soft Comfort</h3>';
      html += '<span class="badge-logo-software">Tutorial KOP</span>';
      html += '</div>';

      html += '<div class="guia-logo-meta">';
      if (g.bloques) {
        html += '<div class="guia-logo-item-meta"><span class="guia-logo-etiqueta">Bloques de función:</span> <span class="guia-logo-valor">' + g.bloques + '</span></div>';
      }
      if (g.elementos) {
        html += '<div class="guia-logo-item-meta"><span class="guia-logo-etiqueta">Elementos a utilizar:</span> <span class="guia-logo-valor">' + g.elementos + '</span></div>';
      }
      if (g.pines) {
        html += '<div class="guia-logo-item-meta"><span class="guia-logo-etiqueta">Pines del bloque:</span> <span class="guia-logo-valor">' + g.pines + '</span></div>';
      }
      html += '</div>';

      if (g.estructura && g.estructura.length > 0) {
        html += '<div class="guia-logo-estructura-wrap">';
        html += '<div class="guia-logo-estructura-titulo">Estructura KOP (Renglones paso a paso):</div>';
        html += '<ul class="guia-logo-lista">';
        g.estructura.forEach(renglon => {
          html += '<li class="guia-logo-lista-item">' + renglon + '</li>';
        });
        html += '</ul>';
        html += '</div>';
      }

      if (g.comportamiento) {
        html += '<div class="guia-logo-nota"><strong>Comportamiento requerido:</strong> ' + g.comportamiento + '</div>';
      }
      if (g.doctrina) {
        html += '<div class="guia-logo-nota"><strong>Doctrina de cátedra:</strong> ' + g.doctrina + '</div>';
      }

      html += '</div>';
    }

    return html;
  }
`;
}
