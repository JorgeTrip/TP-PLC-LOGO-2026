/**
 * Estilos para las secciones técnicas: Ecuaciones Lógicas, Solución Adoptada y Análisis Didáctico.
 * Capa de presentación.
 */

export const estilosDetalleTecnicoCss = `
.bloque-detalle-tecnico {
  margin: 14px 0;
}
.bloque-ecuaciones .codigo-ecuaciones {
  background: var(--bg-svg);
  border: 1px solid var(--borde-card);
  border-left: 3px solid var(--acento-azul);
  border-radius: 10px;
  padding: 12px 16px;
  margin: 6px 0 0;
  overflow-x: auto;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 13px;
  line-height: 1.55;
  color: var(--acento-azul);
}
.bloque-ecuaciones .codigo-ecuaciones code {
  font-family: inherit;
  color: inherit;
}
.parrafo-solucion-adoptada {
  margin: 6px 0 0;
  font-size: 13.5px;
  line-height: 1.6;
  color: var(--texto-principal);
  background: rgba(56, 189, 248, 0.04);
  border-left: 3px solid var(--acento-verde);
  padding: 10px 14px;
  border-radius: 0 10px 10px 0;
}
.parrafo-analisis-didactico {
  margin: 6px 0 0;
  font-size: 13.5px;
  line-height: 1.6;
  color: var(--texto-secundario);
  padding: 4px 2px;
}
`;
