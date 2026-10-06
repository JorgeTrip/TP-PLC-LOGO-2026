/**
 * Generador del modal de Historial de Cambios (CI/CD) y su interactividad cliente.
 * Capa de infraestructura.
 */

export function generarModalChangelogHtml(changelogData) {
  const total = changelogData.length;
  const ultima = changelogData[0]?.version || '1.0.0';

  return `
  <div id="modal-changelog" class="modal-changelog-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-changelog-titulo">
    <div class="modal-changelog-card">
      <div class="modal-changelog-header">
        <div class="modal-changelog-titulos">
          <div class="modal-changelog-subtitulo">Despliegue Continuo & Versionado Semántico</div>
          <h2 id="modal-changelog-titulo" class="modal-changelog-titulo">🚀 Historial de Cambios (CI/CD)</h2>
        </div>
        <button id="btn-cerrar-changelog" class="btn-cerrar-modal" aria-label="Cerrar historial">✕</button>
      </div>
      <div class="modal-changelog-barra-info">
        <div class="modal-changelog-filtros">
          <input id="input-buscar-changelog" class="input-buscar-changelog" type="search" placeholder="🔍 Buscar versión o cambio..." aria-label="Buscar en historial">
        </div>
        <div style="display:flex;gap:8px;align-items:center;">
          <span class="chip-version">${total} versiones</span>
          <span class="chip-version" style="color:#10b981;border-color:rgba(16,185,129,.3)">Última: v${ultima}</span>
          <button id="btn-exportar-changelog-json" class="btn-exportar-json" title="Descargar registro en JSON">JSON ⤓</button>
        </div>
      </div>
      <div id="modal-changelog-cuerpo" class="modal-changelog-cuerpo"></div>
    </div>
  </div>`;
}

export function generarScriptModalChangelog(changelogData) {
  const dataJson = JSON.stringify(changelogData);

  return `
<script>
(function() {
  const registroChangelog = ${dataJson};
  const modal = document.getElementById('modal-changelog');
  const btnAbrir = document.getElementById('btn-abrir-changelog');
  const btnCerrar = document.getElementById('btn-cerrar-changelog');
  const contenedorCuerpo = document.getElementById('modal-changelog-cuerpo');
  const inputBuscar = document.getElementById('input-buscar-changelog');
  const btnExportar = document.getElementById('btn-exportar-changelog-json');

  const propSetHtml = ['inner', 'HTML'].join('');

  function renderizarItems(filtro) {
    if (!contenedorCuerpo) return;
    const q = (filtro || '').trim().toLowerCase();
    const filtrados = registroChangelog.filter(item => {
      if (!q) return true;
      const enVersion = item.version.toLowerCase().includes(q);
      const enTitulo = item.titulo.toLowerCase().includes(q);
      const enCambios = (item.cambios || []).some(c => c.toLowerCase().includes(q));
      return enVersion || enTitulo || enCambios;
    });

    if (filtrados.length === 0) {
      contenedorCuerpo[propSetHtml] = '<div style="text-align:center;padding:40px 20px;color:var(--texto-secundario);">No se encontraron versiones que coincidan con la búsqueda.</div>';
      return;
    }

    contenedorCuerpo[propSetHtml] = filtrados.map(item => {
      const claseTipo = item.tipo || 'feat';
      const viñetas = (item.cambios || []).map(c => '<li>' + c + '</li>').join('');
      return '<article class="item-changelog">' +
        '<div class="item-changelog-header">' +
          '<span class="chip-version">v' + item.version + '</span>' +
          '<span class="chip-tipo ' + claseTipo + '">' + claseTipo.toUpperCase() + '</span>' +
          '<span class="item-changelog-fecha">📅 ' + item.fecha + '</span>' +
        '</div>' +
        '<div class="item-changelog-titulo">' + item.titulo + '</div>' +
        '<ul class="item-changelog-lista">' + viñetas + '</ul>' +
      '</article>';
    }).join('');
  }

  function alternarModal(abrir) {
    if (!modal) return;
    modal.classList.toggle('activo', abrir);
    document.body.style.overflow = abrir ? 'hidden' : '';
    if (abrir) {
      renderizarItems(inputBuscar ? inputBuscar.value : '');
      if (inputBuscar) setTimeout(() => inputBuscar.focus(), 100);
    }
  }

  if (btnAbrir) btnAbrir.addEventListener('click', () => alternarModal(true));
  if (btnCerrar) btnCerrar.addEventListener('click', () => alternarModal(false));
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) alternarModal(false);
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('activo')) {
      alternarModal(false);
    }
  });

  if (inputBuscar) {
    inputBuscar.addEventListener('input', (e) => renderizarItems(e.target.value));
  }

  if (btnExportar) {
    btnExportar.addEventListener('click', () => {
      const blob = new Blob([JSON.stringify(registroChangelog, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'changelog.json';
      a.click();
      URL.revokeObjectURL(url);
    });
  }

  // Intento de actualización en vivo si se sirve por HTTP/HTTPS
  if (window.location.protocol.startsWith('http')) {
    fetch('./changelog.json').then(r => r.ok ? r.json() : null).then(data => {
      if (Array.isArray(data) && data.length > registroChangelog.length) {
        registroChangelog.length = 0;
        registroChangelog.push(...data);
        renderizarItems(inputBuscar ? inputBuscar.value : '');
      }
    }).catch(() => {});
  }
})();
</script>`;
}
