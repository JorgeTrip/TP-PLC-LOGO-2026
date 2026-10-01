/**
 * Generador de script cliente para renderizar tablas canónicas de Asignación de I/O y Recursos de Software.
 * Capa de infraestructura.
 */

export function generarScriptTablasIo() {
  return `
  function crearTablaIoHtml(ej) {
    const tieneSoft = Boolean(ej.soft && ej.soft.length > 0);
    let html = '<div class="bloque-tablas-asignacion' + (tieneSoft ? ' con-software' : '') + '">';
    html += '<div class="contenedor-tabla-grupo">';
    html += '<h3 class="subtitulo-seccion-tecnica">Tabla de Asignación de Entradas y Salidas (I/O)</h3>';
    html += '<div class="tabla-contenedor"><table class="tabla-tecnica tabla-io">';
    html += '<thead><tr>';
    html += '<th class="col-centrada" style="width:70px">Borne</th>';
    html += '<th class="col-izquierda">Señal</th>';
    html += '<th class="col-centrada" style="width:115px">Tipo de contacto</th>';
    html += '<th class="col-izquierda">Vale 1 cuando...</th>';
    html += '</tr></thead><tbody>';

    ej.io.forEach(([borne, senal, tipo, cond]) => {
      html += '<tr>';
      html += '<td class="col-centrada col-borne">' + borne + '</td>';
      html += '<td class="col-izquierda col-senal">' + enriquecerTexto(senal) + '</td>';
      html += '<td class="col-centrada col-tipo">' + tipo + '</td>';
      html += '<td class="col-izquierda">' + enriquecerTexto(cond) + '</td>';
      html += '</tr>';
    });
    html += '</tbody></table></div></div>';

    if (tieneSoft) {
      html += '<div class="contenedor-tabla-grupo">';
      html += '<h3 class="subtitulo-seccion-tecnica">Recursos Internos de Software</h3>';
      html += '<div class="tabla-contenedor"><table class="tabla-tecnica tabla-software">';
      html += '<thead><tr>';
      html += '<th class="col-centrada col-soft-id-th" style="width:55px" title="Identificador">ID</th>';
      html += '<th class="col-centrada col-soft-tipo-th" style="width:115px">Tipo de bloque</th>';
      html += '<th class="col-izquierda">Función lógica</th>';
      html += '</tr></thead><tbody>';

      ej.soft.forEach(([id, tipo, func]) => {
        html += '<tr>';
        html += '<td class="col-centrada col-borne col-soft-id">' + id + '</td>';
        html += '<td class="col-centrada col-tipo col-soft-tipo">' + tipo + '</td>';
        html += '<td class="col-izquierda col-soft-func">' + enriquecerTexto(func) + '</td>';
        html += '</tr>';
      });
      html += '</tbody></table></div></div>';
    }

    html += '</div>';
    return html;
  }
`;
}
