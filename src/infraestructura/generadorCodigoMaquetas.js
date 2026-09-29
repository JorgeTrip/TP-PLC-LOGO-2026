/**
 * Generador de funciones de maquetas temáticas y catálogo de ejercicios para el cliente.
 * Capa de infraestructura.
 */

export function generarCodigoMaquetasCliente() {
  return `
<script>
  function renderizarMaqueta(id, estado, salidas) {
    if (id === '4.1' || id === '4.2' || id === '4.3') {
      const q1 = Boolean(salidas.Q1);
      const q2 = Boolean(salidas.Q2);
      const giro = q1 ? ' girando' : '';
      const col = q1 ? '#4ade80' : '#ef4444';
      let extra = '';
      if (id === '4.3') {
        const p = estado.t ? Math.min(100, (estado.t / 5) * 100).toFixed(0) : 0;
        extra = '<div class="preaviso-caja"><div class="baliza-icono' + (q2 ? ' baliza-activa' : '') + '" style="background:' + (q2 ? '#f59e0b' : '#334155') + '">⚠️ PRE-AVISO Q2 (5s)</div><div class="barra-progreso-bg"><div class="barra-progreso-fill" style="width:' + p + '%"></div></div></div>';
      }
      return '<div class="maqueta-contenedor"><div class="maqueta-marco"><div class="motor-chasis"><svg viewBox="0 0 100 100" class="motor-svg' + giro + '" width="80" height="80"><circle cx="50" cy="50" r="45" fill="#1e293b" stroke="#38bdf8" stroke-width="4"/><circle cx="50" cy="50" r="14" fill="#38bdf8"/><path d="M50 15 L50 36 M50 64 L50 85 M15 50 L36 50 M64 50 L85 50" stroke="#94a3b8" stroke-width="6" stroke-linecap="round"/><path d="M26 26 L40 40 M60 60 L74 74 M74 26 L60 40 M40 60 L26 74" stroke="#94a3b8" stroke-width="5" stroke-linecap="round"/></svg><div class="motor-info"><div class="motor-estado-tag" style="border-color:' + col + ';color:' + col + '"><span class="motor-led-dot" style="background:' + col + '"></span>' + (q1 ? 'MOTOR EN MARCHA' : 'MOTOR DETENIDO') + '</div>' + extra + '</div></div></div></div>';
    }
    if (id === '4.4') {
      const q1 = Boolean(salidas.Q1), q2 = Boolean(salidas.Q2);
      return '<div class="maqueta-contenedor"><div class="maqueta-marco" style="display:flex;gap:16px"><div style="flex:1;padding:14px;border-radius:10px;text-align:center;background:' + (q1 ? '#fef08a' : '#1e293b') + ';color:' + (q1 ? '#713f12' : '#94a3b8') + ';font-weight:700">💡 LUZ PASILLO Q1 (15s): ' + (q1 ? 'ON' : 'OFF') + '</div><div style="flex:1;padding:14px;border-radius:10px;text-align:center;background:' + (q2 ? '#f43f5e' : '#1e293b') + ';color:#fff;font-weight:700">🔴 TESTIGO AVISO Q2: ' + (q2 ? 'RETENIDO' : 'OFF') + '</div></div></div>';
    }
    if (id === '4.5') {
      const q1 = Boolean(salidas.Q1), c = estado.c || 0;
      return '<div class="maqueta-contenedor"><div class="maqueta-marco" style="display:flex;justify-content:space-between;align-items:center"><div><b>CINTA TRANSPORTADORA:</b> ' + (q1 ? '🟢 EN MARCHA' : '🔴 DETENIDA') + '</div><div style="font-size:18px;font-weight:800;color:var(--acento-azul)">PIEZAS: ' + c + ' / 5</div></div></div>';
    }
    if (id === '4.6') {
      const b = Boolean(estado.b), q1 = Boolean(salidas.Q1);
      const col = b ? '#ef4444' : (q1 ? '#4ade80' : '#38bdf8');
      return '<div class="maqueta-contenedor"><div class="maqueta-marco" style="border-color:' + col + ';display:flex;justify-content:space-between;align-items:center"><div style="font-weight:700;color:' + col + '">' + (b ? '🔒 BLOQUEADO (Orden erróneo)' : (q1 ? '🔓 DESBLOQUEADO (Q1 ACTIVO)' : '🔐 EN SECUENCIA')) + '</div><div style="display:flex;gap:8px"><span style="padding:4px 8px;border-radius:6px;background:' + (estado.m1 ? '#0369a1' : '#1e293b') + '">Paso 1</span><span style="padding:4px 8px;border-radius:6px;background:' + (estado.m2 ? '#0369a1' : '#1e293b') + '">Paso 2</span><span style="padding:4px 8px;border-radius:6px;background:' + (estado.m3 ? '#0369a1' : '#1e293b') + '">Paso 3</span></div></div></div>';
    }
    if (id === '4.7') {
      const q1 = Boolean(salidas.Q1), q2 = Boolean(salidas.Q2), em = (estado.tEmergencia || 0) > 0;
      return '<div class="maqueta-contenedor"><div class="maqueta-marco" style="display:flex;gap:12px;align-items:center"><div style="padding:10px 16px;border-radius:8px;background:' + (q1 ? '#0369a1' : '#1e293b') + ';color:#fff">Luz (Q1): ' + (q1 ? 'ON' : 'OFF') + '</div><div style="padding:10px 16px;border-radius:8px;background:' + (q2 ? '#b45309' : '#1e293b') + ';color:#fff">Alarma (Q2): ' + (q2 ? 'ON' : 'OFF') + '</div>' + (em ? '<div style="color:#ef4444;font-weight:800;animation:parpadeoBaliza .5s infinite alternate">🔥 ALARMA INCENDIO 0.5Hz</div>' : '') + '</div></div>';
    }
    if (id === '4.8') {
      const c = estado.c || 0, q3 = Boolean(salidas.Q3), q1 = Boolean(salidas.Q1), q2 = Boolean(salidas.Q2), q4 = Boolean(salidas.Q4);
      return '<div class="maqueta-contenedor"><div class="maqueta-marco parking-grid"><div class="display-cartel ' + (q3 ? 'completo' : 'libre') + '">' + (q3 ? '🚫 COMPLETO (50/50)' : '🟢 LUGARES DISPONIBLES: ' + (50 - c)) + '</div><div class="barreras-status"><span class="barrera-badge ' + (q1 ? 'abierta' : '') + '">Barrera Entrada: ' + (q1 ? 'SUBIENDO' : 'CERRADA') + '</span><span class="barrera-badge ' + (q4 ? 'emitiendo' : '') + '">Ticket: ' + (q4 ? 'EMITIENDO' : 'LISTO') + '</span><span class="barrera-badge ' + (q2 ? 'abierta' : '') + '">Barrera Salida: ' + (q2 ? 'SUBIENDO' : 'CERRADA') + '</span></div></div></div>';
    }
    if (id === '4.9') {
      const q1 = Boolean(salidas.Q1), q2 = Boolean(salidas.Q2), s = estado.s || 0;
      const h = s === 1 ? '50%' : (s === 2 ? '15%' : (s === 3 ? '75%' : '95%'));
      return '<div class="maqueta-contenedor"><div class="maqueta-marco"><div class="sensor-fc">FC ABIERTO (I2)</div><div class="porton-marco"><div class="porton-hoja" style="height:' + h + '"><span class="porton-label">' + (q1 ? '▲ ABRIENDO' : (q2 ? '▼ CERRANDO' : 'DETENIDO')) + '</span></div></div><div class="sensor-fc">FC CERRADO (I3)</div></div></div>';
    }
    if (id === '4.10') {
      const q1 = Boolean(salidas.Q1), q2 = Boolean(salidas.Q2);
      const nv = q1 && q2 ? 80 : (q1 ? 55 : 30);
      return '<div class="maqueta-contenedor"><div class="maqueta-marco tanque-sistema-wrap"><div class="tanque-con-escala"><div class="escala-sensores"><div class="marca-sensor s3">S3 (Máx) ──►</div><div class="marca-sensor s1">S1 (Mín) ──►</div><div class="marca-sensor s2">S2 (Crítico) ──►</div></div><div class="tanque-visual"><div class="tanque-nivel" style="height:' + nv + '%">' + nv + '% Lleno</div></div></div><div class="bombas-panel"><div class="bomba-badge ' + (q1 ? 'on' : '') + '">Bomba 1 (Principal): ' + (q1 ? 'ON' : 'OFF') + '</div><div class="bomba-badge ' + (q2 ? 'on' : '') + '">Bomba 2 (Auxiliar): ' + (q2 ? 'ON' : 'OFF') + '</div></div></div></div>';
    }
    if (id === '4.11') {
      const q1 = Boolean(salidas.Q1), q2 = Boolean(salidas.Q2), f = Boolean(estado.f);
      return '<div class="maqueta-contenedor"><div class="maqueta-marco pozo-panel"><div class="bombas-alternadas-grid"><div class="bomba-card ' + (q1 ? 'activa' : '') + '"><b>BOMBA 1</b><span>' + (q1 ? 'BOMBEANDO' : 'REPOSO') + '</span></div><div class="bomba-card ' + (q2 ? 'activa' : '') + '"><b>BOMBA 2</b><span>' + (q2 ? 'BOMBEANDO' : 'REPOSO') + '</span></div></div><div class="turno-info" style="margin-top:8px">Próxima bomba asignada: <b>' + (f ? 'BOMBA 2 (Q2)' : 'BOMBA 1 (Q1)') + '</b></div></div></div>';
    }
    return '';
  }
</script>
`;
}
