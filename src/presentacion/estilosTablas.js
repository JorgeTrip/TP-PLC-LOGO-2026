/**
 * Estilos para las tablas canónicas de Asignación de I/O y Recursos de Software.
 * Capa de presentación.
 */
import { estilosDetalleTecnicoCss } from './estilosDetalleTecnico.js';

export const estilosTablasCss = `
.bloque-tablas-asignacion {
  margin: 16px 0;
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  align-items: start;
}
.bloque-tablas-asignacion.con-software {
  grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr);
}
.contenedor-tabla-grupo {
  min-width: 0;
  display: flex;
  flex-direction: column;
}
@media (max-width: 1000px) {
  .bloque-tablas-asignacion.con-software {
    grid-template-columns: 1fr;
  }
}
.subtitulo-seccion-tecnica {
  margin: 12px 0 6px;
  font-size: 12.5px;
  letter-spacing: .06em;
  text-transform: uppercase;
  color: var(--texto-secundario);
  font-weight: 700;
}
.tabla-contenedor {
  width: 100%;
  overflow-x: auto;
  border-radius: 12px;
  border: 1px solid var(--borde-card);
  background: var(--bg-bloque-q);
  box-shadow: 0 2px 8px var(--sombra-card);
}
.tabla-tecnica {
  width: 100%;
  border-collapse: collapse;
  font-size: 12.5px;
  line-height: 1.4;
  text-align: left;
}
.tabla-tecnica thead th {
  background: var(--bg-btn);
  color: var(--acento-azul);
  font-weight: 700;
  padding: 8px 10px;
  font-size: 11px;
  letter-spacing: .04em;
  text-transform: uppercase;
  border-bottom: 2px solid var(--borde-card);
  white-space: nowrap;
}
.tabla-tecnica tbody td {
  padding: 8px 10px;
  border-bottom: 1px solid var(--borde-card);
  color: var(--texto-principal);
  vertical-align: middle;
}
.tabla-tecnica tbody tr:last-child td {
  border-bottom: none;
}
.tabla-tecnica tbody tr:hover {
  background: var(--bg-btn-hover);
}
.tabla-tecnica .col-centrada {
  text-align: center;
}
.tabla-tecnica .col-izquierda {
  text-align: left;
}
.tabla-tecnica .col-borne {
  color: var(--acento-purpura);
  font-family: ui-monospace, monospace;
  font-weight: 700;
  font-size: 12.5px;
  white-space: nowrap;
}
.tabla-tecnica .col-tipo {
  font-family: ui-monospace, monospace;
  font-weight: 600;
  font-size: 11.5px;
  color: var(--acento-ambar);
  white-space: nowrap;
}
.tabla-tecnica .col-senal {
  font-weight: 600;
  color: var(--texto-principal);
}
.tabla-software {
  table-layout: fixed;
  width: 100%;
}
.tabla-software thead th {
  padding: 8px 6px;
  font-size: 11px;
}
.tabla-software tbody td {
  padding: 8px 6px;
  font-size: 12px;
}
.tabla-software .col-soft-id-th,
.tabla-software .col-soft-id {
  width: 55px;
  font-size: 12px;
  white-space: nowrap;
}
.tabla-software .col-soft-tipo-th,
.tabla-software .col-soft-tipo {
  width: 155px;
  font-size: 11px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.tabla-software .col-soft-func {
  font-size: 12px;
  line-height: 1.35;
  word-break: normal;
  overflow-wrap: break-word;
}
${estilosDetalleTecnicoCss}
`;
