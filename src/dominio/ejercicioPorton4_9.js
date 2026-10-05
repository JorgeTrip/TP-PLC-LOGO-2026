/**
 * Especificación formal y simulación de Ejercicio 4.9: Portón Levadizo en KOP Puro.
 * Capa de dominio puro (IEC 61131-3 / Siemens LOGO! KOP).
 */

export const ejercicioPorton4_9 = {
  n: '4.9',
  t: 'Automatización de Portón Levadizo',
  q: 'Controlar un portón con un único pulsador (I1): El ciclo debe ser: Abrir - Parar - Cerrar - Parar. Utilizar finales de carrera (I2 e I3, ambos N/C) para detener el motor en los extremos.',
  io: [
    ['I1', 'Pulsador de comando paso a paso', 'NA', 'Se presiona el pulsador'],
    ['I2', 'Fin de carrera superior (tope abierto)', 'NC', 'Portón fuera de tope (abre a 0 en tope alto)'],
    ['I3', 'Fin de carrera inferior (tope cerrado)', 'NC', 'Portón fuera de tope (abre a 0 en tope bajo)'],
    ['Q1', 'Contactor de motor - Sentido Abrir', 'Digital / Relé', 'Salida energizada (portón en ascenso)'],
    ['Q2', 'Contactor de motor - Sentido Cerrar', 'Digital / Relé', 'Salida energizada (portón en descenso)']
  ],
  soft: [
    ['M0', 'Marca estado', 'Reposo cerrado (referencia Grafcet / M1 LOGO!)'],
    ['M1', 'Marca estado', 'Reposo cerrado (fijado por M8 en 1er scan)'],
    ['M2', 'Marca estado', 'Portón abriendo (comanda motor Q1)'],
    ['M3', 'Marca estado', 'Pausa en carrera o tope superior alcanzado'],
    ['M4', 'Marca estado', 'Portón cerrando (comanda motor Q2)'],
    ['M5', 'Marca flanco', 'Pulso monoestable de 1 ciclo al pulsar I1'],
    ['M6', 'Marca memoria', 'Registro de estado previo de I1'],
    ['M8', 'Marca arranque', 'Activa en 1er scan para inicializar M1']
  ],
  eq: [
    'M5 = I1 · NOT(M6) ; M6 = I1',
    'Set(M1) = M8 + M4 · (NOT(I3) + M5) ; Reset(M4) = M4 · (NOT(I3) + M5)',
    'Set(M2) = M1 · M5 ; Reset(M1) = M1 · M5',
    'Set(M3) = M2 · (NOT(I2) + M5) ; Reset(M2) = M2 · (NOT(I2) + M5)',
    'Set(M4) = M3 · M5 ; Reset(M3) = M3 · M5',
    'Q1 = M2 · NOT(Q2) ; Q2 = M4 · NOT(Q1)'
  ],
  sol: 'Esquema en KOP puro basado en contactos y bobinas Set/Reset sin bloques FBD especiales, compatible al 100% con LOGO!Soft Comfort. La pulsación en I1 genera un pulso monostable de un ciclo en M5 mediante I1 y el contacto negado /M6, memorizando M6 = I1 para el ciclo siguiente. La etapa inicial M1 (reposo cerrado) se setea en el primer ciclo de scan mediante la marca de arranque M8 de LOGO!. Los finales de carrera físicos NC (I2 e I3) se programan con contactos negados (/I2 y /I3), detectando la apertura a 0V al tocar los topes mecánicos. El avance secuencial (M1 -> M2 -> M3 -> M4 -> M1) se ordena topológicamente de arriba hacia abajo para evitar carreras de scan, enclavando los motores Q1 y Q2 de forma cruzada.',
  e: '¿Por qué usar KOP puro y contactos NC en LOGO!? En LOGO!Soft los bloques como AND(flanco) no admiten conexiones en serie intermedias en Ladder. Con KOP puro (M1 a M6 y M8) el circuito es universal y directo. Dado que los finales de carrera I2 e I3 son físicamente NC (entregan 24V en reposo y 0V al pisarse), se leen con contactos negados (/I2 y /I3) en Ladder para detener la marcha al abrirse el circuito. Las transiciones se evalúan en orden para evitar saltos indeseados en el mismo scan.',
  i: [['I1', 'Pulsador portón', 'p'], ['I2', 'Fin ABIERTO', 's', 1], ['I3', 'Fin CERRADO', 's', 1, 1]],
  o: ['Q1', 'Q2'],
  r: [
    { c: 'R1: Pulso de flanco positivo M5 = I1 · NOT(M6)', s: ['I1', '/M6'], o: 'M5' },
    { c: 'R2: Registro de estado de I1 para ciclo siguiente M6 = I1', s: ['I1'], o: 'M6' },
    { c: 'R3: Inicialización en reposo cerrado por marca de primer scan M8', s: ['M8'], o: 'S M1' },
    { c: 'R4: Transición M1 -> M2 (Inicio apertura al pulsar en reposo)', s: ['M1', 'M5'], o: 'S M2' },
    { c: 'R5: Reset de etapa M1 al iniciar apertura', s: ['M1', 'M5'], o: 'R M1' },
    { c: 'R6: Transición M2 -> M3 (Parada en apertura por tope /I2 o pulsador M5)', p: [['/I2'], ['M5']], s: ['M2'], o: 'S M3' },
    { c: 'R7: Reset de etapa M2 al parar apertura', p: [['/I2'], ['M5']], s: ['M2'], o: 'R M2' },
    { c: 'R8: Transición M3 -> M4 (Inicio cierre al pulsar detenido)', s: ['M3', 'M5'], o: 'S M4' },
    { c: 'R9: Reset de etapa M3 al iniciar cierre', s: ['M3', 'M5'], o: 'R M3' },
    { c: 'R10: Transición M4 -> M1 (Parada en cierre por tope /I3 o pulsador M5)', p: [['/I3'], ['M5']], s: ['M4'], o: 'S M1' },
    { c: 'R11: Reset de etapa M4 al parar cierre', p: [['/I3'], ['M5']], s: ['M4'], o: 'R M4' },
    { c: 'R12: Conducción motor apertura Q1 con interbloqueo negado /Q2', s: ['M2', '/Q2'], o: 'Q1' },
    { c: 'R13: Conducción motor cierre Q2 con interbloqueo negado /Q1', s: ['M4', '/Q1'], o: 'Q2' }
  ],
  ejecutar: (S, I) => {
    if (!S.iniciado) {
      S.m1 = true; S.m2 = false; S.m3 = false; S.m4 = false;
      S.m6 = Boolean(I.I1); S.iniciado = true;
    }
    const pulsoI1 = Boolean(I.I1 && !S.m6);
    S.m5 = pulsoI1;
    S.m6 = Boolean(I.I1);
    if (S.m1 && S.m5) {
      S.m2 = true; S.m1 = false;
    } else if (S.m2 && (!I.I2 || S.m5)) {
      S.m3 = true; S.m2 = false;
    } else if (S.m3 && S.m5) {
      S.m4 = true; S.m3 = false;
    } else if (S.m4 && (!I.I3 || S.m5)) {
      S.m1 = true; S.m4 = false;
    }
    const q1 = Boolean(S.m2 && !S.m4);
    const q2 = Boolean(S.m4 && !S.m2);
    const idx = S.m1 ? 0 : (S.m2 ? 1 : (S.m3 ? 2 : 3));
    S.s = idx;
    S.info = ['Parado (cerrado)', 'ABRIENDO PORTÓN (Q1)', 'Parado (abierto / pausa)', 'CERRANDO PORTÓN (Q2)'][idx];
    return {
      Q1: q1, Q2: q2,
      M0: Boolean(S.m1), M1: Boolean(S.m1), M2: Boolean(S.m2),
      M3: Boolean(S.m3), M4: Boolean(S.m4), M5: Boolean(S.m5), M6: Boolean(S.m6)
    };
  }
};
