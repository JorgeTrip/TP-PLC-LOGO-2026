/**
 * Plantilla base HTML con sidebar de navegación rápida, switch de tema y layout responsivo.
 * Capa de infraestructura.
 */
import { catalogoEjercicios } from '../dominio/catalogoEjercicios.js';
import { renderizarEnunciadoCompletoHtml } from '../presentacion/seccionEnunciadoCompleto.js';

export function generarEncabezadoHtml(estilosCss) {
  const enlacesSidebar = catalogoEjercicios.map(ej => {
    return `<a href="#ejercicio-${ej.n.replace('.', '-')}" class="sidebar-link">
      <span>${ej.n}</span>
      <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${ej.t}</span>
    </a>`;
  }).join('\n');

  const seccionEnunciado = renderizarEnunciadoCompletoHtml();

  return `<!DOCTYPE html>
<html lang="es" data-theme="dark">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>TP PLC LOGO! 2026 — Plataforma Interactiva KOP</title>
  <style>
${estilosCss}
  </style>
</head>
<body>
  <header>
    <h1>⚡ TP PLC Siemens LOGO! 2026 — Plataforma Interactiva KOP</h1>
    <div class="header-controles">
      <button id="btn-tema" class="btn" title="Alternar modo claro / oscuro" style="display:flex;align-items:center;gap:6px">
        <span id="icono-tema">🌙</span>
        <span id="texto-tema">Oscuro</span>
      </button>
      <div style="display:flex;align-items:center;gap:8px">
        <span style="font-size:12px;color:var(--texto-secundario)">Velocidad:</span>
        <div id="selector-velocidad" style="display:flex;gap:4px"></div>
      </div>
    </div>
  </header>
  <div class="app-layout">
    <aside class="sidebar">
      <div class="sidebar-titulo">Documentación Oficial</div>
      <nav class="sidebar-nav">
        <a href="#enunciado-tp-completo" class="sidebar-link activo">
          <span>📋</span>
          <span>Enunciado Completo TP</span>
        </a>
      </nav>
      <div class="sidebar-titulo" style="margin-top:20px">Ejercicios Resueltos</div>
      <nav class="sidebar-nav">
${enlacesSidebar}
      </nav>
    </aside>
    <main class="contenido-principal">
${seccionEnunciado}
      <div id="contenedor-ejercicios"></div>
    </main>
  </div>
`;
}
