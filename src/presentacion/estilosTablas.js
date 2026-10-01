/**
 * Estilos para las tablas canónicas de Asignación de I/O y Recursos de Software.
 * Capa de presentación.
 */

export const estilosTablasCss = `
.bloque-tablas-asignacion {
  margin: 18px 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.subtitulo-seccion-tecnica {
  margin: 12px 0 6px;
  font-size: 13px;
  letter-spacing: .08em;
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
  font-size: 13px;
  line-height: 1.45;
  text-align: left;
}
.tabla-tecnica thead th {
  background: var(--bg-btn);
  color: var(--acento-azul);
  font-weight: 700;
  padding: 10px 14px;
  font-size: 11.5px;
  letter-spacing: .05em;
  text-transform: uppercase;
  border-bottom: 2px solid var(--borde-card);
  white-space: nowrap;
}
.tabla-tecnica tbody td {
  padding: 10px 14px;
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
  font-size: 13px;
  white-space: nowrap;
}
.tabla-tecnica .col-tipo {
  font-family: ui-monospace, monospace;
  font-weight: 600;
  font-size: 12px;
  color: var(--acento-ambar);
  white-space: nowrap;
}
.tabla-tecnica .col-senal {
  font-weight: 600;
  color: var(--texto-principal);
}
`;
