/**
 * Estilos para las secciones técnicas: Ecuaciones Lógicas, Solución Adoptada y Análisis Didáctico.
 * Capa de presentación.
 */

export const estilosDetalleTecnicoCss = `
.bloque-fila-tecnica {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.25fr);
  gap: 16px;
  align-items: stretch;
  margin: 14px 0;
}
@media (max-width: 1000px) {
  .bloque-fila-tecnica {
    grid-template-columns: 1fr;
  }
}
.bloque-fila-tecnica .bloque-detalle-tecnico {
  margin: 0;
  display: flex;
  flex-direction: column;
}
.bloque-fila-tecnica .codigo-ecuaciones,
.bloque-fila-tecnica .parrafo-solucion-adoptada {
  flex: 1;
  margin: 6px 0 0;
}
.bloque-detalle-tecnico {
  margin: 14px 0;
}
.bloque-ecuaciones .codigo-ecuaciones {
  background: var(--bg-svg);
  border: 1px solid var(--borde-card);
  border-left: 3px solid var(--acento-azul);
  border-radius: 10px;
  padding: 12px 16px;
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
