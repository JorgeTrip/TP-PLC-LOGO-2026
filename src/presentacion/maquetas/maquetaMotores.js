/**
 * Gemelos visuales temáticos para sistemas de motores industriales (4.1, 4.2, 4.3).
 * Capa de presentación.
 */

export function renderizarMotorBase(activo, subtitulo, extraHtml = '') {
  const claseGiro = activo ? ' girando' : '';
  const colorLed = activo ? '#4ade80' : '#ef4444';
  const textoEstado = activo ? 'EN MARCHA' : 'DETENIDO';

  return `
    <div class="maqueta-contenedor">
      <div class="maqueta-marco">
        <div class="motor-chasis">
          <svg viewBox="0 0 100 100" class="motor-svg${claseGiro}" width="80" height="80">
            <circle cx="50" cy="50" r="45" fill="#1e293b" stroke="#38bdf8" stroke-width="4"/>
            <circle cx="50" cy="50" r="14" fill="#38bdf8"/>
            <path d="M50 15 L50 36 M50 64 L50 85 M15 50 L36 50 M64 50 L85 50" stroke="#94a3b8" stroke-width="6" stroke-linecap="round"/>
            <path d="M26 26 L40 40 M60 60 L74 74 M74 26 L60 40 M40 60 L26 74" stroke="#94a3b8" stroke-width="5" stroke-linecap="round"/>
          </svg>
          <div class="motor-info">
            <div class="motor-estado-tag" style="border-color:${colorLed};color:${colorLed}">
              <span class="motor-led-dot" style="background:${colorLed}"></span>
              ${textoEstado}
            </div>
            <span class="motor-subtitulo">${subtitulo}</span>
            ${extraHtml}
          </div>
        </div>
      </div>
    </div>
  `;
}

export function maquetaMotor4_1(estado, salidas) {
  return renderizarMotorBase(Boolean(salidas.Q1), 'Accionamiento por autorretención (Marcha / Parada)');
}

export function maquetaMotor4_2(estado, salidas) {
  return renderizarMotorBase(Boolean(salidas.Q1), 'Accionamiento por relé autoenclavador Set-Reset');
}

export function maquetaMotor4_3(estado, salidas) {
  const aviso = Boolean(salidas.Q2);
  const colorAviso = aviso ? '#f59e0b' : '#334155';
  const claseBaliza = aviso ? ' baliza-activa' : '';
  const progreso = estado.t ? Math.min(100, (estado.t / 5) * 100).toFixed(0) : 0;

  const extra = `
    <div class="preaviso-caja">
      <div class="baliza-icono${claseBaliza}" style="background:${colorAviso}">
        ⚠️ BALIZA PRE-AVISO (Q2)
      </div>
      <div class="barra-progreso-bg">
        <div class="barra-progreso-fill" style="width:${progreso}%"></div>
      </div>
    </div>
  `;
  return renderizarMotorBase(Boolean(salidas.Q1), 'Motor con retardo a la conexión (5 s)', extra);
}
