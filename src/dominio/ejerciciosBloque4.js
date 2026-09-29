/**
 * Catálogo de ejercicios de PLC LOGO!: Bloque 4 (Ejercicios 4.10 y 4.11).
 * Explicaciones técnicas y didácticas exhaustivas. Capa de dominio puro.
 */

export const ejerciciosBloque4 = [
  {
    n: '4.10',
    t: 'Control de Nivel de Tanque con Bombas en Cascada',
    q: 'Tanque con dos bombas (Q1 y Q2). S1 (Nivel mínimo), S2 (Nivel crítico inferior), S3 (Nivel máximo). S1 arranca Q1; si baja a S2 arranca Q2. S3 apaga ambas. PE (I4, N/C) detención instantánea.',
    io: [
      ['I1', 'Sensor S1 (Flotante de nivel mínimo: arranca bomba principal Q1)'],
      ['I2', 'Sensor S2 (Flotante de nivel crítico inferior: suma bomba auxiliar Q2)'],
      ['I3', 'Sensor S3 (Flotante de nivel máximo: corta ambas bombas)'],
      ['I4', 'Pulsador PE (Parada de Emergencia tipo hongo N/C: Normal Cerrado fail-safe)'],
      ['Q1', 'Bomba principal de llenado'],
      ['Q2', 'Bomba auxiliar de refuerzo']
    ],
    e: '¿Qué es el control en cascada en sistemas de bombeo? Es una estrategia para escalonar el consumo energético según la demanda de caudal. 1) En régimen normal, al bajar el nivel y activarse el sensor mínimo S1 (I1), arranca únicamente la bomba principal Q1 y se autorretiene. 2) Si el consumo supera el aporte de Q1 y el agua continúa descendiendo hasta el sensor crítico inferior S2 (I2), arranca adicionalmente la bomba auxiliar Q2 y también se autorretiene, aportando el doble de caudal. 3) Ambas bombas permanecen llenando el tanque hasta que el agua alcanza el sensor superior S3 (I3), momento en que el contacto normalmente cerrado /I3 se abre en serie y rompe simultáneamente las dos autorretenciones. El pulsador de emergencia PE (I4, N/C) está cableado en serie con ambas ramas: al presionarlo o ante un corte de cable, la señal cae a 0 y desenergiza todo al instante.',
    i: [['I1', 'S1 Mínimo', 's'], ['I2', 'S2 Crítico', 's'], ['I3', 'S3 Máximo', 's'], ['I4', 'PE Emergencia', 'p', 1]],
    o: ['Q1', 'Q2'],
    r: [
      { c: 'Bomba principal Q1 con autorretención y corte por S3 o Parada de Emergencia', p: [['I1'], ['Q1']], s: ['/I3', 'I4'], o: 'Q1' },
      { c: 'Bomba auxiliar Q2 con autorretención y corte por S3 o Parada de Emergencia', p: [['I2'], ['Q2']], s: ['/I3', 'I4'], o: 'Q2' }
    ],
    ejecutar: (S, I) => {
      S.q1 = Boolean((I.I1 || S.q1) && !I.I3 && I.I4);
      S.q2 = Boolean((I.I2 || S.q2) && !I.I3 && I.I4);
      S.info = !I.I4 ? '🛑 PARADA DE EMERGENCIA ACCIONADA' : `Bombas en marcha: ${S.q1 ? 'Q1' : ''}${S.q1 && S.q2 ? ' + ' : ''}${S.q2 ? 'Q2' : (!S.q1 ? 'Ninguna (Nivel adecuado)' : '')}`;
      return { Q1: S.q1, Q2: S.q2 };
    }
  },
  {
    n: '4.11',
    t: 'Alternancia de Bombas para Reparto de Carga',
    q: 'Control de dos bombas (Q1 y Q2) para igualar horas de uso. Entrada I1 (Flotante demanda N/A). Cada ciclo arranca la bomba que no trabajó en el ciclo anterior. Seguridad: PE (I4 N/C).',
    io: [
      ['I1', 'Sensor flotante de demanda N/A (Normal Abierto: activa ciclo de bombeo)'],
      ['I4', 'Pulsador PE (Parada de Emergencia tipo hongo N/C: Normal Cerrado fail-safe)'],
      ['Q1', 'Bomba 1 de impulsión cloacal'],
      ['Q2', 'Bomba 2 de impulsión cloacal'],
      ['F', 'Marca interna Toggle (Relé de impulsos biestable divisor de frecuencia para alternancia)']
    ],
    e: '¿Por qué es fundamental la alternancia de bombas? En instalaciones industriales con dos equipos de bombeo gemelos, alternar su uso en cada ciclo asegura que ambas bombas acumulen la misma cantidad de horas de servicio, evitando que una máquina sufra desgaste prematuro mientras la otra se agarrota por inactividad prolongada. ¿Cómo opera el relé de impulsos (Toggle)? Cada vez que el flotante de demanda I1 se desactiva (flanco descendente ↓ I1 al vaciarse el pozo), el relé conmuta el estado de la marca interna F (0 -> 1 -> 0 -> 1...). En la siguiente activación de I1, si F está en 0, el contacto negado /F conduce hacia la Bomba 1 (Q1); si F está en 1, el contacto directo F conduce hacia la Bomba 2 (Q2). El pulsador de emergencia PE (I4 N/C) en serie asegura detención instantánea en cualquier ciclo.',
    i: [['I1', 'Flotante demanda', 's'], ['I4', 'PE Emergencia', 'p', 1]],
    o: ['Q1', 'Q2'],
    r: [
      { c: 'Conmutación de la marca de alternancia F en el flanco descendente de I1', s: ['[↓ I1]', '[Toggle]'], o: 'F' },
      { c: 'Bomba 1 habilitada en ciclos pares cuando F = 0', s: ['I1', '/F', 'I4'], o: 'Q1' },
      { c: 'Bomba 2 habilitada en ciclos impares cuando F = 1', s: ['I1', 'F', 'I4'], o: 'Q2' }
    ],
    ejecutar: (S, I) => {
      if (S.previoDemanda && !I.I1) S.f = !S.f;
      S.previoDemanda = Boolean(I.I1);
      S.info = !I.I4 ? '🛑 PARADA DE EMERGENCIA' : `Turno asignado: ${S.f ? 'Bomba 2 (Q2)' : 'Bomba 1 (Q1)'}`;
      return {
        Q1: Boolean(I.I1 && !S.f && I.I4),
        Q2: Boolean(I.I1 && Boolean(S.f) && I.I4)
      };
    }
  }
];
