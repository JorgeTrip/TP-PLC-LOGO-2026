/**
 * Estilos para el botón del sidebar y el modal de Historial de Cambios (CI/CD).
 * Paleta Grises Pro, estética Apple, accesible y responsivo.
 */
export const estilosModalChangelogCss = `
.sidebar-footer {
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid var(--borde-sidebar);
}
.btn-sidebar-changelog {
  width: 100%; display: flex; align-items: center; justify-content: space-between; gap: 8px;
  padding: 10px 12px; background: rgba(56, 189, 248, 0.08); border: 1px solid rgba(56, 189, 248, 0.25);
  border-radius: 10px; color: var(--texto-principal); font-family: inherit; font-size: 13px;
  font-weight: 600; cursor: pointer; transition: all 0.2s ease; text-align: left;
}
.btn-sidebar-changelog:hover {
  background: rgba(56, 189, 248, 0.16); border-color: rgba(56, 189, 248, 0.45); transform: translateY(-1px);
}
.btn-sidebar-changelog:focus-visible { outline: 2px solid var(--acento-primario); outline-offset: 2px; }
.icono-changelog { font-size: 16px; }
.badge-version-sidebar {
  font-size: 11px; font-weight: 700; padding: 2px 7px; background: var(--bg-badge);
  border: 1px solid var(--borde-componente); border-radius: 12px; color: var(--acento-primario);
}
.modal-changelog-overlay {
  position: fixed; inset: 0; background: rgba(10, 15, 26, 0.75); backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center;
  padding: 20px; z-index: 100000; opacity: 0; pointer-events: none; transition: opacity 0.25s ease;
}
.modal-changelog-overlay.activo { opacity: 1; pointer-events: auto; }
.modal-changelog-card {
  background: var(--bg-tarjeta); border: 1px solid var(--borde-componente); border-radius: 18px;
  width: 100%; max-width: 720px; max-height: 85vh; display: flex; flex-direction: column;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.55); transform: scale(0.96);
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1); overflow: hidden;
}
.modal-changelog-overlay.activo .modal-changelog-card { transform: scale(1); }
.modal-changelog-header {
  padding: 18px 24px 14px; border-bottom: 1px solid var(--borde-componente); display: flex;
  align-items: flex-start; justify-content: space-between; gap: 16px; background: rgba(255, 255, 255, 0.02);
}
.modal-changelog-subtitulo {
  font-size: 11px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase;
  color: var(--acento-primario); margin-bottom: 4px;
}
.modal-changelog-titulo { margin: 0; font-size: 20px; font-weight: 800; color: var(--texto-principal); }
.btn-cerrar-modal {
  background: transparent; border: 1px solid var(--borde-componente); color: var(--texto-secundario);
  width: 32px; height: 32px; border-radius: 8px; font-size: 16px; cursor: pointer;
  display: flex; align-items: center; justify-content: center; transition: all 0.15s ease;
}
.btn-cerrar-modal:hover { background: rgba(239, 68, 68, 0.15); color: #ef4444; border-color: rgba(239, 68, 68, 0.3); }
.modal-changelog-barra-info {
  display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px;
  padding: 10px 24px; background: rgba(0, 0, 0, 0.15); border-bottom: 1px solid var(--borde-componente); font-size: 12px;
}
.modal-changelog-filtros { display: flex; align-items: center; gap: 8px; flex: 1; }
.input-buscar-changelog {
  width: 100%; max-width: 280px; padding: 6px 12px; border-radius: 8px;
  border: 1px solid var(--borde-componente); background: var(--bg-cuerpo); color: var(--texto-principal); font-size: 12px;
}
.btn-exportar-json {
  padding: 6px 12px; border-radius: 8px; border: 1px solid var(--borde-componente);
  background: transparent; color: var(--texto-secundario); font-size: 12px; cursor: pointer; transition: all 0.15s ease;
}
.btn-exportar-json:hover { background: rgba(56, 189, 248, 0.12); color: var(--texto-principal); }
.modal-changelog-cuerpo {
  padding: 20px 24px; overflow-y: auto; display: flex; flex-direction: column; gap: 16px;
}
.item-changelog {
  background: rgba(255, 255, 255, 0.02); border: 1px solid var(--borde-componente);
  border-radius: 12px; padding: 14px 16px; transition: border-color 0.2s ease;
}
.item-changelog:hover { border-color: rgba(56, 189, 248, 0.35); }
.item-changelog-header { display: flex; align-items: center; flex-wrap: wrap; gap: 8px; margin-bottom: 8px; }
.chip-version {
  font-family: monospace; font-weight: 800; font-size: 13px; padding: 2px 7px;
  border-radius: 6px; background: rgba(56, 189, 248, 0.15); color: var(--acento-primario);
  border: 1px solid rgba(56, 189, 248, 0.3);
}
.chip-tipo { font-size: 10px; font-weight: 700; text-transform: uppercase; padding: 2px 6px; border-radius: 6px; }
.chip-tipo.feat { background: rgba(16, 185, 129, 0.15); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.3); }
.chip-tipo.fix { background: rgba(56, 189, 248, 0.15); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.3); }
.chip-tipo.docs { background: rgba(168, 85, 247, 0.15); color: #a855f7; border: 1px solid rgba(168, 85, 247, 0.3); }
.item-changelog-fecha { font-size: 12px; color: var(--texto-secundario); margin-left: auto; }
.item-changelog-titulo { font-size: 14px; font-weight: 700; color: var(--texto-principal); margin-bottom: 6px; }
.item-changelog-lista {
  margin: 0; padding-left: 18px; display: flex; flex-direction: column; gap: 4px;
  color: var(--texto-secundario); font-size: 13px;
}
.item-changelog-lista li { line-height: 1.4; }
`;
