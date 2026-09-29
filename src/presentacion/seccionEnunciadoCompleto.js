/**
 * Componente que renderiza el enunciado completo oficial del TP (del PDF de la cátedra).
 * Capa de presentación.
 */

export function renderizarEnunciadoCompletoHtml() {
  return `
    <section class="card" id="enunciado-tp-completo" style="border-left: 4px solid var(--acento-purpura);">
      <h2 style="color:var(--acento-purpura);font-size:24px">📋 Guía Oficial de Trabajos Prácticos: Programación de PLC LOGO!</h2>
      <p style="color:var(--texto-secundario);margin-top:-4px">
        Universidad Tecnológica Nacional · Facultad Regional Buenos Aires · Cátedra: Tecnologías para la Automatización · Docente: Julio Rossini Scarlata · Año: 2026
      </p>

      <div style="margin-top:18px">
        <h3>1. Objetivos</h3>
        <p style="color:var(--texto-principal)">
          El propósito de esta práctica es que el estudiante se familiarice con el entorno de programación de controladores lógicos programables (PLC) mediante el uso de herramientas de software profesional:
        </p>
        <ul style="color:var(--texto-secundario);padding-left:22px">
          <li>Dominar el software <b>LOGO!Soft Comfort</b> para el desarrollo de programas en lenguaje Ladder (KOP).</li>
          <li>Diseñar y simular arquitecturas lógicas de control para diversos actuadores industriales.</li>
          <li>Verificar el comportamiento dinámico de los sistemas mediante el entorno de simulación integrado.</li>
        </ul>
      </div>

      <div style="margin-top:18px">
        <h3>2. Herramientas y Requisitos</h3>
        <p style="color:var(--texto-principal)">
          Para el desarrollo de la presente práctica, se prescindirá de hardware físico, centrando el aprendizaje en la implementación lógica y validación funcional:
        </p>
        <ul style="color:var(--texto-secundario);padding-left:22px">
          <li>Estación de trabajo (PC).</li>
          <li>Software <b>LOGO!Soft Comfort V8.x</b> (o superior).</li>
          <li>Conocimientos previos sobre lógica de contactos y álgebra de Boole.</li>
        </ul>
      </div>

      <div style="margin-top:18px">
        <h3>3. Metodología de Trabajo</h3>
        <ol style="color:var(--texto-secundario);padding-left:22px">
          <li><b>Diseño Lógico:</b> Analizar el enunciado de cada problema y definir las entradas (I) y salidas (Q) necesarias.</li>
          <li><b>Programación:</b> Implementar el diagrama de contactos (Ladder) en el IDE.</li>
          <li><b>Simulación:</b> Utilizar la herramienta de simulación (F3) para validar que la lógica responda a las condiciones solicitadas.</li>
          <li><b>Documentación:</b> Generar el informe técnico incluyendo capturas del programa y tablas de asignación.</li>
        </ol>
      </div>

      <div style="margin-top:18px">
        <h3>4. Problemas a Implementar</h3>
        <div class="q">
          La guía comprende 11 problemas prácticos industriales (4.1 a 4.11) que cubren lógica combinacional y secuencial, relés autoenclavadores, temporizadores (TON, TOF, TP), contadores de eventos, máquinas de estado y alternancia de actuadores. Cada uno se encuentra resuelto, documentado e interactivamente simulado a continuación.
        </div>
      </div>

      <div style="margin-top:18px">
        <h3>5. Entregables</h3>
        <p style="color:var(--texto-principal)">
          El informe final debe presentarse en formato digital (PDF) conteniendo:
        </p>
        <ul style="color:var(--texto-secundario);padding-left:22px">
          <li>Diagramas Ladder de cada ejercicio.</li>
          <li>Tabla de símbolos/asignaciones (I/O).</li>
          <li>Breve explicación de la solución adoptada.</li>
        </ul>
      </div>
    </section>
  `;
}
