/**
 * Estilos globales, paleta Grises Pro (oscuro/claro) y layout con sidebar.
 * Capa de presentación.
 */
import { estilosComponentesCss } from './estilosComponentes.js';
import { estilosTooltipsCss } from './estilosTooltips.js';
import { estilosMovilCss } from './estilosMovil.js';

export const estilosCss = `
:root {
  --bg-app: #0f1422;
  --bg-card: #182234;
  --borde-card: #27354f;
  --texto-principal: #f1f5f9;
  --texto-secundario: #94a3b8;
  --acento-azul: #38bdf8;
  --acento-purpura: #a78bfa;
  --acento-verde: #4ade80;
  --acento-rojo: #f43f5e;
  --acento-ambar: #f59e0b;
  --bg-bloque-q: #111a2c;
  --bg-svg: #0b1220;
  --bg-btn: #1e2c45;
  --bg-btn-hover: #243555;
  --bg-led: #1e293b;
  --bg-maqueta: #0f182a;
  --fill-bloque: #0d1627;
  --fill-bloque-activo: #132a45;
  --trazo-inactivo: #64748b;
  --texto-contacto: #cbd5e1;
  --sombra-card: rgba(0,0,0,0.35);
  --bg-sidebar: #111927;
  --borde-sidebar: #1f2b3f;
}

[data-theme="light"] {
  --bg-app: #f1f5f9;
  --bg-card: #ffffff;
  --borde-card: #cbd5e1;
  --texto-principal: #0f172a;
  --texto-secundario: #475569;
  --acento-azul: #0284c7;
  --acento-purpura: #7c3aed;
  --acento-verde: #16a34a;
  --acento-rojo: #dc2626;
  --acento-ambar: #d97706;
  --bg-bloque-q: #f8fafc;
  --bg-svg: #f8fafc;
  --bg-btn: #e2e8f0;
  --bg-btn-hover: #cbd5e1;
  --bg-led: #cbd5e1;
  --bg-maqueta: #f8fafc;
  --fill-bloque: #e2e8f0;
  --fill-bloque-activo: #bae6fd;
  --trazo-inactivo: #94a3b8;
  --texto-contacto: #1e293b;
  --sombra-card: rgba(0,0,0,0.06);
  --bg-sidebar: #f8fafc;
  --borde-sidebar: #e2e8f0;
}

html {
  overflow-x: clip;
}
* { box-sizing: border-box; }
body {
  margin: 0;
  overflow-x: clip;
  background: var(--bg-app);
  color: var(--texto-principal);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Inter, sans-serif;
  line-height: 1.6;
  transition: background .2s, color .2s;
}

header {
  position: sticky; top: 0; z-index: 30;
  background: var(--bg-card);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--borde-card);
  padding: 0 24px;
  height: 58px;
  display: flex; gap: 16px; align-items: center; justify-content: space-between; flex-wrap: nowrap;
}
header h1 {
  font-size: 18px; margin: 0;
  background: linear-gradient(90deg, var(--acento-azul), var(--acento-purpura));
  -webkit-background-clip: text; color: transparent;
  white-space: nowrap;
}
.header-lado-izq { display: flex; align-items: center; gap: 10px; min-width: 0; }
.titulo-movil { display: none; }
.header-controles { display: flex; gap: 12px; align-items: center; flex-shrink: 0; }

/* Layout con Sidebar */
.app-layout {
  display: flex;
  min-height: calc(100vh - 58px);
  width: 100%;
  min-width: 0;
}

.sidebar {
  width: 280px;
  background: var(--bg-sidebar);
  border-right: 1px solid var(--borde-sidebar);
  padding: 20px 14px;
  position: sticky;
  top: 58px;
  height: calc(100vh - 58px);
  overflow-y: auto;
  flex-shrink: 0;
}

.sidebar-titulo {
  font-size: 11px;
  letter-spacing: .08em;
  text-transform: uppercase;
  color: var(--texto-secundario);
  margin: 12px 10px 8px;
  font-weight: 700;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.sidebar-link {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border-radius: 8px;
  color: var(--texto-secundario);
  text-decoration: none;
  font-size: 13px;
  font-weight: 500;
  transition: all .15s;
}

.sidebar-link:hover {
  background: var(--bg-btn);
  color: var(--texto-principal);
}

.sidebar-link.activo {
  background: var(--bg-btn);
  color: var(--acento-azul);
  font-weight: 700;
  border-left: 3px solid var(--acento-azul);
}

.contenido-principal {
  flex: 1;
  max-width: 1050px;
  width: 100%;
  min-width: 0;
  margin: 0 auto;
  padding: 24px 24px 80px;
  box-sizing: border-box;
}

${estilosComponentesCss}
${estilosTooltipsCss}
${estilosMovilCss}
`;
