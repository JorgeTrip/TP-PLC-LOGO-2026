/**
 * Estilos para Tooltips de términos técnicos y optimización móvil (Drawer, Touch targets).
 * Capa de presentación.
 */

export const estilosMovilYTooltipsCss = `
/* Tooltips para términos técnicos */
.termino-tecnico {
  border-bottom: 1.5px dotted var(--acento-azul);
  cursor: help;
  color: var(--acento-azul);
  position: relative;
  font-weight: 600;
  display: inline-block;
  outline: none;
  transition: color .15s;
}
.termino-tecnico:hover, .termino-tecnico:focus {
  color: var(--acento-purpura);
}

[data-tooltip] {
  position: relative;
}
[data-tooltip]::after {
  content: attr(data-tooltip);
  position: absolute;
  bottom: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%) translateY(4px);
  background: var(--bg-card);
  color: var(--texto-principal);
  border: 1px solid var(--borde-card);
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 12px;
  line-height: 1.4;
  white-space: normal;
  width: max-content;
  max-width: 260px;
  pointer-events: none;
  opacity: 0;
  visibility: hidden;
  transition: opacity .2s, transform .2s;
  box-shadow: 0 10px 25px var(--sombra-card);
  z-index: 1000;
  font-weight: 400;
  text-align: left;
  backdrop-filter: blur(12px);
}
[data-tooltip]:hover::after,
[data-tooltip]:focus::after {
  opacity: 1;
  visibility: visible;
  transform: translateX(-50%) translateY(0);
}
.sidebar-link[data-tooltip]::after {
  left: 20px;
  transform: translateY(4px);
  bottom: calc(100% + 4px);
}
.sidebar-link[data-tooltip]:hover::after {
  transform: translateY(0);
}

/* Botón Menú Móvil */
#btn-menu-movil {
  display: none;
  background: var(--bg-btn);
  border: 1px solid var(--borde-card);
  color: var(--texto-principal);
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

/* Overlay para Drawer Móvil */
.sidebar-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.55);
  backdrop-filter: blur(4px);
  z-index: 80;
  display: none;
  opacity: 0;
  transition: opacity .25s ease;
}
.sidebar-overlay.activo {
  display: block;
  opacity: 1;
}

/* Adaptabilidad Móvil */
@media (max-width: 900px) {
  #btn-menu-movil { display: inline-flex; align-items: center; gap: 6px; }
  header { padding: 0 12px; height: 58px; gap: 8px; }
  header h1 { font-size: 14px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 170px; }
  
  .sidebar {
    position: fixed;
    top: 0;
    left: -300px;
    width: 280px;
    height: 100vh;
    z-index: 90;
    transition: left .25s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 6px 0 24px rgba(0,0,0,0.5);
  }
  .sidebar.abierto {
    left: 0;
  }
  .sidebar-header-movil {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 12px;
    margin-bottom: 12px;
    border-bottom: 1px solid var(--borde-sidebar);
  }
  .sidebar-header-movil span { font-weight: 700; font-size: 14px; }
  #btn-cerrar-sidebar {
    background: none;
    border: none;
    color: var(--texto-secundario);
    font-size: 20px;
    cursor: pointer;
  }

  .contenido-principal {
    padding: 14px 10px 60px;
  }
  .card {
    padding: 16px 12px;
    margin-bottom: 20px;
    border-radius: 14px;
  }
  .cabecera-ejercicio-sticky {
    margin: -16px -12px 14px -12px;
    padding: 12px 14px;
    border-top-left-radius: 13px;
    border-top-right-radius: 13px;
    top: 58px;
  }
  .cabecera-ejercicio-sticky h2 { font-size: 17px; }
  .cabecera-ejercicio-sticky .q { font-size: 12.5px; padding: 8px 10px; }
  .btn { min-height: 42px; touch-action: manipulation; padding: 8px 12px; }
  .svgw { padding: 8px; }
}
`;
