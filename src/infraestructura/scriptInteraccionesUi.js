/**
 * Script de interacciones de interfaz de usuario (Tema, Velocidad, Drawer Móvil y Tooltips).
 * Capa de infraestructura.
 */

export function generarScriptInteraccionesUi() {
  return `
  // Control de Tema Claro / Oscuro
  const btnTema = document.getElementById('btn-tema');
  const iconoTema = document.getElementById('icono-tema');
  const textoTema = document.getElementById('texto-tema');
  const temaGuardado = localStorage.getItem('tp_plc_tema') || 'dark';

  function aplicarTema(t) {
    document.documentElement.setAttribute('data-theme', t);
    iconoTema.textContent = t === 'dark' ? '🌙' : '☀️';
    textoTema.textContent = t === 'dark' ? 'Oscuro' : 'Claro';
    localStorage.setItem('tp_plc_tema', t);
  }
  aplicarTema(temaGuardado);

  btnTema.onclick = () => {
    const actual = document.documentElement.getAttribute('data-theme');
    aplicarTema(actual === 'dark' ? 'light' : 'dark');
  };

  // Selector de velocidad
  let velocidad = 1;
  const selectorVel = document.getElementById('selector-velocidad');
  [1, 5, 20].forEach(v => {
    const b = document.createElement('button');
    b.className = 'btn' + (v === 1 ? ' on' : '');
    b.textContent = 'x' + v;
    b.onclick = () => {
      velocidad = v;
      [...selectorVel.children].forEach(c => c.classList.toggle('on', c === b));
    };
    selectorVel.append(b);
  });

  // Control de Menú Drawer Móvil
  const btnMenuMovil = document.getElementById('btn-menu-movil');
  const btnCerrarSidebar = document.getElementById('btn-cerrar-sidebar');
  const sidebar = document.getElementById('sidebar-principal');
  const overlay = document.getElementById('sidebar-overlay');

  function alternarSidebar(abrir) {
    sidebar.classList.toggle('abierto', abrir);
    overlay.classList.toggle('activo', abrir);
    document.body.style.overflow = abrir ? 'hidden' : '';
  }

  if (btnMenuMovil) btnMenuMovil.onclick = () => alternarSidebar(true);
  if (btnCerrarSidebar) btnCerrarSidebar.onclick = () => alternarSidebar(false);
  if (overlay) overlay.onclick = () => alternarSidebar(false);

  // Cerrar drawer al pulsar cualquier enlace en móvil
  document.querySelectorAll('.sidebar-link').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 900) alternarSidebar(false);
    });
  });
`;
}
