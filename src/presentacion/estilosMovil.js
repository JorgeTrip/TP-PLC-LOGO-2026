/**
 * Estilos para visualización y controles en dispositivos móviles.
 * Capa de presentación.
 */

export const estilosMovilCss = `
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
  header {
    height: 54px;
    padding: 0 8px;
    gap: 6px;
    flex-wrap: nowrap;
    overflow: hidden;
  }
  .header-lado-izq {
    display: flex;
    align-items: center;
    gap: 6px;
    min-width: 0;
    flex: 1 1 auto;
  }
  .titulo-desktop { display: none; }
  .titulo-movil {
    display: inline-block;
    font-size: 13.5px;
    font-weight: 700;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .header-controles {
    display: flex;
    align-items: center;
    gap: 4px;
    flex-shrink: 0;
  }
  .texto-tema-label { display: none; }
  .velocidad-texto { display: none; }
  #btn-tema { padding: 4px 8px; min-height: 32px; font-size: 14px; }
  #selector-velocidad { display: flex; gap: 2px; }
  #selector-velocidad .btn { padding: 4px 6px; font-size: 11px; min-height: 32px; }
  #btn-menu-movil {
    display: inline-flex;
    align-items: center;
    padding: 4px 8px;
    min-height: 32px;
    font-size: 12px;
    flex-shrink: 0;
  }
  
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
  .sidebar.abierto { left: 0; }
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
    padding: 10px 8px 60px;
    width: 100%;
    max-width: 100%;
    min-width: 0;
    box-sizing: border-box;
    overflow-x: hidden;
  }
  .card {
    padding: 14px 10px;
    margin-bottom: 18px;
    border-radius: 14px;
    width: 100%;
    max-width: 100%;
    min-width: 0;
    box-sizing: border-box;
  }
  .cabecera-ejercicio-sticky {
    position: sticky;
    top: 54px;
    z-index: 25;
    background: var(--bg-card);
    margin: -14px -10px 12px -10px;
    padding: 8px 10px;
    border-top-left-radius: 13px;
    border-top-right-radius: 13px;
    border-bottom: 1px solid var(--borde-card);
    box-shadow: 0 4px 12px var(--sombra-card);
  }
  .cabecera-ejercicio-sticky h2 { font-size: 15px; margin: 0 0 4px; }
  .cabecera-ejercicio-sticky .q { font-size: 12px; padding: 6px 8px; line-height: 1.4; }
  
  .sim { gap: 6px; width: 100%; max-width: 100%; }
  .sim .btn {
    min-height: 40px;
    touch-action: manipulation;
    padding: 6px 8px;
    font-size: 11.5px;
    white-space: normal;
    word-break: break-word;
    flex: 1 1 calc(50% - 6px);
    max-width: 100%;
  }
  .svgw { padding: 6px; width: 100%; max-width: 100%; box-sizing: border-box; }
  .tanque-flex { flex-direction: column; align-items: center; gap: 12px; }
  .bombas-panel { width: 100%; }
  table { font-size: 12px; }
  td { padding: 6px 4px; }
  td:first-child { width: 45px; font-size: 12px; }
}
`;
