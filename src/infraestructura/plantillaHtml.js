/**
 * Plantilla base HTML con sidebar de navegación rápida, switch de tema y layout responsivo.
 * Capa de infraestructura.
 */
import { catalogoEjercicios } from '../dominio/catalogoEjercicios.js';
import { renderizarEnunciadoCompletoHtml } from '../presentacion/seccionEnunciadoCompleto.js';

export function generarEncabezadoHtml(estilosCss) {
  const enlacesSidebar = catalogoEjercicios.map(ej => {
    return `<a href="#ejercicio-${ej.n.replace('.', '-')}" class="sidebar-link" title="${ej.n} · ${ej.t}" data-tooltip="${ej.n} · ${ej.t}">
      <span style="font-weight:700;color:var(--acento-azul)">${ej.n}</span>
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
  <div id="sidebar-overlay" class="sidebar-overlay"></div>
  <header>
    <div class="header-lado-izq">
      <button id="btn-menu-movil" aria-label="Abrir menú de navegación">☰ Menú</button>
      <h1>
        <span class="titulo-desktop">⚡ TP PLC <span class="termino-tecnico" tabindex="0" data-tooltip="Micro-PLC modular para automatización de Siemens">Siemens LOGO!</span> 2026 — Plataforma Interactiva <span class="termino-tecnico" tabindex="0" data-tooltip="Diagrama de Contactos o Ladder (escalera)">KOP</span></span>
        <span class="titulo-movil">⚡ LOGO! 2026</span>
      </h1>
    </div>
    <div class="header-controles">
      <button id="btn-tema" class="btn" title="Alternar modo claro / oscuro">
        <span id="icono-tema">🌙</span>
        <span id="texto-tema" class="texto-tema-label">Oscuro</span>
      </button>
      <div class="velocidad-contenedor">
        <span class="velocidad-texto">Velocidad:</span>
        <div id="selector-velocidad"></div>
      </div>
    </div>
  </header>
  <div class="app-layout">
    <aside id="sidebar-principal" class="sidebar">
      <div class="sidebar-header-movil">
        <span>Menú de Navegación</span>
        <button id="btn-cerrar-sidebar" aria-label="Cerrar">✕</button>
      </div>
      <div class="sidebar-titulo">Documentación Oficial</div>
      <nav class="sidebar-nav">
        <a href="#enunciado-tp-completo" class="sidebar-link activo" title="Enunciado Oficial Completo" data-tooltip="Enunciado Oficial Completo">
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
