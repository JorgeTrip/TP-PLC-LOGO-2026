/**
 * Estilos CSS para el apartado tutorial de Guía de Construcción en LOGO!Soft Comfort.
 * Capa de presentación (Estética Apple / Grises Pro).
 */

export const estilosGuiaLogoCss = `
/* Contenedor principal de la Guía LOGO!Soft */
.bloque-guia-logo {
  background: var(--bg-card, #242426);
  border: 1px solid rgba(56, 189, 248, 0.25);
  border-radius: 12px;
  padding: 18px 20px;
  margin-top: 18px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  position: relative;
  overflow: hidden;
}

[data-theme="light"] .bloque-guia-logo {
  background: #ffffff;
  border-color: rgba(14, 165, 233, 0.3);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
}

.bloque-guia-logo::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: linear-gradient(180deg, #38bdf8, #0284c7);
}

.encabezado-guia-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
}

.icono-guia-logo {
  font-size: 1.35rem;
  line-height: 1;
}

.titulo-guia-logo {
  font-size: 1.05rem;
  font-weight: 700;
  color: #38bdf8;
  margin: 0;
  letter-spacing: -0.01em;
}

[data-theme="light"] .titulo-guia-logo {
  color: #0284c7;
}

.badge-logo-software {
  font-size: 0.72rem;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 6px;
  background: rgba(56, 189, 248, 0.15);
  color: #38bdf8;
  border: 1px solid rgba(56, 189, 248, 0.3);
  text-transform: uppercase;
  margin-left: auto;
}

[data-theme="light"] .badge-logo-software {
  background: rgba(2, 132, 199, 0.1);
  color: #0284c7;
  border-color: rgba(2, 132, 199, 0.25);
}

/* Fila de metadatos de bloques y elementos */
.guia-logo-meta {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 14px;
  font-size: 0.9rem;
  line-height: 1.5;
}

.guia-logo-item-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: baseline;
  color: var(--texto-secundario, #94a3b8);
}

.guia-logo-etiqueta {
  font-weight: 600;
  color: var(--texto-principal, #e2e8f0);
}

.guia-logo-valor {
  color: var(--texto-principal, #e2e8f0);
}

/* Estructura KOP por renglones */
.guia-logo-estructura-wrap {
  margin-top: 12px;
  border-top: 1px dashed rgba(255, 255, 255, 0.1);
  padding-top: 12px;
}

[data-theme="light"] .guia-logo-estructura-wrap {
  border-top-color: rgba(0, 0, 0, 0.1);
}

.guia-logo-estructura-titulo {
  font-size: 0.85rem;
  font-weight: 700;
  color: #38bdf8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 8px;
}

[data-theme="light"] .guia-logo-estructura-titulo {
  color: #0284c7;
}

.guia-logo-lista {
  margin: 0;
  padding-left: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.guia-logo-lista-item {
  font-size: 0.88rem;
  line-height: 1.55;
  color: var(--texto-principal, #f1f5f9);
  background: rgba(0, 0, 0, 0.2);
  padding: 8px 12px;
  border-radius: 8px;
  border-left: 3px solid rgba(56, 189, 248, 0.6);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}

[data-theme="light"] .guia-logo-lista-item {
  background: #f8fafc;
  color: #1e293b;
  border-left-color: #0284c7;
}

/* Notas de cátedra y comportamiento */
.guia-logo-nota {
  margin-top: 12px;
  padding: 10px 14px;
  border-radius: 8px;
  background: rgba(245, 158, 11, 0.1);
  border: 1px solid rgba(245, 158, 11, 0.25);
  font-size: 0.86rem;
  color: #fbbf24;
  line-height: 1.5;
}

[data-theme="light"] .guia-logo-nota {
  background: rgba(217, 119, 6, 0.08);
  border-color: rgba(217, 119, 6, 0.2);
  color: #b45309;
}
`;
