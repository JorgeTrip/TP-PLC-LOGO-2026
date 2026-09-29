/**
 * Estilos para Tooltips de términos técnicos y glosario interactivo.
 * Capa de presentación.
 */

export const estilosTooltipsCss = `
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

/* Tooltips en el encabezado: abrir hacia abajo para permanecer 100% visibles dentro del viewport */
header [data-tooltip]::after {
  bottom: auto;
  top: calc(100% + 10px);
  left: 0;
  transform: translateY(-4px);
}
header [data-tooltip]:hover::after,
header [data-tooltip]:focus::after {
  transform: translateY(0);
}

header .header-controles [data-tooltip]::after {
  left: auto;
  right: 0;
  transform: translateY(-4px);
}
header .header-controles [data-tooltip]:hover::after,
header .header-controles [data-tooltip]:focus::after {
  transform: translateY(0);
}
`;
