# ⚡ TP PLC Siemens LOGO! 2026 — Plataforma Interactiva KOP
### Cátedra: Tecnologías para la Automatización · UTN FRBA · Docente: Julio Rossini Scarlata

Plataforma técnica interactiva y simulador en tiempo real para el Trabajo Práctico de Programación de PLC Siemens LOGO! (2026). Incluye diagramas de contactos (Ladder/KOP) con monitoreo en línea, maquetas visuales industriales y suite de pruebas automatizadas.

---

## 🚀 Características Principales

1. **Monitoreo en Línea (Live KOP Debugging)**: Emulación del entorno de simulación (F3 / Test Online) de *Siemens LOGO!Soft Comfort*. Al pulsar o accionar interruptores, las ramas conductoras, contactos cerrados y bobinas se iluminan en tiempo real en **cian brillante**.
2. **Diagramas SVG Sin Colisiones**: Motor de renderizado con cálculo dinámico de espaciado y márgenes holgados que garantiza **0 colisiones** entre comentarios, contactos y cajas de bloques especiales.
3. **Gemelos Visuales Temáticos**: Maquetas animadas específicas para los 11 ejercicios (motores con rotor giratorio, nivel continuo de líquido en tanque, portón levadizo entre finales de carrera, barrera de estacionamiento con display de cupos, etc.).
4. **Enunciado Oficial Integrado**: Transcripción completa de las 5 secciones de la guía de la cátedra accesible directamente antes de las resoluciones.
5. **Sidebar y Navegación Rápida**: Barra lateral fija con acceso inmediato a cada ejercicio y seguimiento del scroll.
6. **Selector de Temas (Claro / Oscuro)**: Paleta Grises Pro estilo Apple con modo oscuro predeterminado y persistencia local.

---

## 🛠️ Estructura del Proyecto

```text
├── src/
│   ├── dominio/            # Lógica pura de scan PLC y catálogo de ejercicios
│   ├── aplicacion/         # Motor de diagramas SVG, evaluador de corriente Live KOP
│   ├── presentacion/       # Maquetas temáticas, estilos y componentes visuales
│   └── infraestructura/    # Compilador a HTML autocontenido
├── dist/                   # Artefactos compilados listos para despliegue
├── tests/                  # Suite de pruebas unitarias TDD (Vitest)
├── e2e/                    # Pruebas End-to-End en navegador Chromium (Playwright)
├── netlify.toml            # Configuración para despliegue continuo en Netlify
└── changelog.json          # Registro formal de versiones y cambios
```

---

## 🧪 Pruebas Automatizadas y Auditoría

Ejecutar la suite completa de pruebas unitarias TDD:
```bash
npm test
```

Ejecutar pruebas End-to-End con Playwright:
```bash
npm run e2e
```

Ejecutar la auditoría centralizada de gobernanza:
```bash
npm run auditar
```

---

## 🌐 Despliegue en Netlify

El repositorio está 100% preparado para Netlify mediante `netlify.toml`:
- **Build Command**: `npm run build`
- **Publish Directory**: `dist`

Al vincular este repositorio en el panel de Netlify (`Import an existing project from GitHub -> JorgeTrip/TP-PLC-LOGO-2026`), el sitio se compila y publica automáticamente.
