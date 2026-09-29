/**
 * Gemelos visuales temáticos: Ejercicios 4.4, 4.5, 4.6 y 4.7.
 * Capa de presentación.
 */

export function maquetaPasillo4_4(estado, salidas) {
  const luzPasillo = Boolean(salidas.Q1);
  const luzTestigo = Boolean(salidas.Q2);
  const colorPasillo = luzPasillo ? '#fef08a' : '#1e293b';
  const colorTestigo = luzTestigo ? '#f43f5e' : '#334155';

  return `
    <div class="maqueta-contenedor">
      <div class="maqueta-marco pasillo-grid">
        <div class="pasillo-lampara" style="background:${colorPasillo};box-shadow:${luzPasillo ? '0 0 30px #fef08a' : 'none'}">
          💡 Iluminación Pasillo (Q1): ${luzPasillo ? 'ENCENDIDA' : 'APAGADA'}
        </div>
        <div class="pasillo-testigo" style="background:${colorTestigo};box-shadow:${luzTestigo ? '0 0 16px #f43f5e' : 'none'}">
          🔴 Testigo Pre-aviso (Q2): ${luzTestigo ? 'RETENIDO' : 'OFF'}
        </div>
      </div>
    </div>
  `;
}

export function maquetaCinta4_5(estado, salidas) {
  const motor = Boolean(salidas.Q1);
  const conteo = estado.c || 0;
  const claseCinta = motor ? ' cinta-movimiento' : '';

  return `
    <div class="maqueta-contenedor">
      <div class="maqueta-marco">
        <div class="cinta-contenedor">
          <div class="cinta-banda${claseCinta}">
            <span class="pieza-item">📦</span>
            <span class="pieza-item">📦</span>
            <span class="pieza-item">📦</span>
          </div>
          <div class="cinta-display">
            <span class="display-label">CONTADOR PIEZAS (CTU):</span>
            <span class="display-digito">${conteo} / 5</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function maquetaSeguridad4_6(estado, salidas) {
  const bloqueo = Boolean(estado.b);
  const habilitado = Boolean(salidas.Q1);
  const iconoCandado = bloqueo ? '🔒 BLOQUEADO' : (habilitado ? '🔓 DESBLOQUEADO' : '🔐 EN SECUENCIA');
  const colorBorde = bloqueo ? '#ef4444' : (habilitado ? '#4ade80' : '#38bdf8');

  return `
    <div class="maqueta-contenedor">
      <div class="maqueta-marco seguridad-panel" style="border-color:${colorBorde}">
        <div class="candado-display" style="color:${colorBorde}">
          ${iconoCandado}
        </div>
        <div class="pasos-indicadores">
          <span class="paso-dot ${estado.m1 ? 'on' : ''}">Paso 1 (I2)</span>
          <span class="paso-dot ${estado.m2 ? 'on' : ''}">Paso 2 (I1)</span>
          <span class="paso-dot ${estado.m3 ? 'on' : ''}">Paso 3 (I3)</span>
        </div>
      </div>
    </div>
  `;
}

export function maquetaAlarma4_7(estado, salidas) {
  const q1 = Boolean(salidas.Q1);
  const q2 = Boolean(salidas.Q2);
  const incendio = (estado.tEmergencia || 0) > 0;
  const claseFlash = (q1 && q2) ? ' flash-incendio' : '';

  return `
    <div class="maqueta-contenedor">
      <div class="maqueta-marco consola-alarma${claseFlash}">
        <div class="alarma-item" style="color:${q1 ? '#38bdf8' : '#64748b'}">
          💡 Baliza Luz (Q1): ${q1 ? 'ACTIVA' : 'OFF'}
        </div>
        <div class="alarma-item" style="color:${q2 ? '#f59e0b' : '#64748b'}">
          🚨 Alarma Cabina (Q2): ${q2 ? 'ACTIVA' : 'OFF'}
        </div>
        ${incendio ? '<div class="incendio-banner">🔥 EMERGENCIA 0.5 Hz (INCENDIO) 🔥</div>' : ''}
      </div>
    </div>
  `;
}
