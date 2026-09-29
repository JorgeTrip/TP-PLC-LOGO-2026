/**
 * Gemelos visuales temáticos: Ejercicios 4.8, 4.9, 4.10 y 4.11.
 * Capa de presentación.
 */

export function maquetaEstacionamiento4_8(estado, salidas) {
  const cupo = estado.c || 0;
  const completo = Boolean(salidas.Q3);
  const barreraIn = Boolean(salidas.Q1);
  const barreraOut = Boolean(salidas.Q2);
  const ticket = Boolean(salidas.Q4);

  return `
    <div class="maqueta-contenedor">
      <div class="maqueta-marco parking-grid">
        <div class="display-cartel ${completo ? 'completo' : 'libre'}">
          ${completo ? '🚫 COMPLETO (50/50)' : `🟢 LIBRE (${50 - cupo} lugares)`}
        </div>
        <div class="barreras-status">
          <span class="barrera-badge ${barreraIn ? 'abierta' : ''}">Barrera Entrada (Q1): ${barreraIn ? 'LEVANTADA' : 'BAJADA'}</span>
          <span class="barrera-badge ${ticket ? 'emitiendo' : ''}">Ticket (Q4): ${ticket ? 'EMITIENDO' : 'LISTO'}</span>
          <span class="barrera-badge ${barreraOut ? 'abierta' : ''}">Barrera Salida (Q2): ${barreraOut ? 'LEVANTADA' : 'BAJADA'}</span>
        </div>
      </div>
    </div>
  `;
}

export function maquetaPorton4_9(estado, salidas) {
  const subiendo = Boolean(salidas.Q1);
  const bajando = Boolean(salidas.Q2);
  const pos = estado.pos !== undefined ? estado.pos : (estado.s === 2 ? 100 : (estado.s === 0 ? 0 : 50));
  const clasePorton = subiendo ? ' porton-subiendo' : (bajando ? ' porton-bajando' : '');

  return `
    <div class="maqueta-contenedor">
      <div class="maqueta-marco porton-fachada">
        <div class="sensor-fc fc-arriba">FC ABIERTO (I2)</div>
        <div class="porton-marco">
          <div class="porton-hoja${clasePorton}" style="height:${Math.max(15, 100 - pos)}%">
            <span class="porton-label">${subiendo ? '▲ SUBIENDO' : (bajando ? '▼ BAJANDO' : 'DETENIDO')}</span>
          </div>
        </div>
        <div class="sensor-fc fc-abajo">FC CERRADO (I3)</div>
      </div>
    </div>
  `;
}

export function maquetaTanque4_10(estado, salidas) {
  const q1 = Boolean(salidas.Q1);
  const q2 = Boolean(salidas.Q2);
  const nivel = q1 && q2 ? 80 : (q1 ? 55 : 30);

  return `
    <div class="maqueta-contenedor">
      <div class="maqueta-marco tanque-sistema-wrap">
        <div class="tanque-con-escala">
          <div class="escala-sensores">
            <div class="marca-sensor s3">S3 (Máx) ──►</div>
            <div class="marca-sensor s1">S1 (Mín) ──►</div>
            <div class="marca-sensor s2">S2 (Crítico) ──►</div>
          </div>
          <div class="tanque-visual">
            <div class="tanque-nivel" style="height:${nivel}%">
              <span class="nivel-texto">${nivel}% Lleno</span>
            </div>
          </div>
        </div>
        <div class="bombas-panel">
          <div class="bomba-badge ${q1 ? 'on' : ''}">Bomba Principal Q1: ${q1 ? 'BOMBEANDO' : 'OFF'}</div>
          <div class="bomba-badge ${q2 ? 'on' : ''}">Bomba Auxiliar Q2: ${q2 ? 'BOMBEANDO' : 'OFF'}</div>
        </div>
      </div>
    </div>
  `;
}

export function maquetaAlternancia4_11(estado, salidas) {
  const q1 = Boolean(salidas.Q1);
  const q2 = Boolean(salidas.Q2);
  const proxima = estado.f ? 'Bomba 2 (Q2)' : 'Bomba 1 (Q1)';

  return `
    <div class="maqueta-contenedor">
      <div class="maqueta-marco pozo-panel">
        <div class="bombas-alternadas-grid">
          <div class="bomba-card ${q1 ? 'activa' : ''}">
            <span class="bomba-icono">⚙️</span>
            <b>BOMBA 1 (Q1)</b>
            <span>${q1 ? 'EN SERVICIO' : 'EN REPOSO'}</span>
          </div>
          <div class="bomba-card ${q2 ? 'activa' : ''}">
            <span class="bomba-icono">⚙️</span>
            <b>BOMBA 2 (Q2)</b>
            <span>${q2 ? 'EN SERVICIO' : 'EN REPOSO'}</span>
          </div>
        </div>
        <div class="turno-info">
          Próximo turno programado: <b>${proxima}</b>
        </div>
      </div>
    </div>
  `;
}
