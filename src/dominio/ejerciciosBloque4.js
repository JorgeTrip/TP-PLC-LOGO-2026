/**
 * Catálogo de ejercicios de PLC LOGO!: Bloque 4 (Ejercicios 4.10 y 4.11).
 * Cumple normas IEC 61131-3 y cátedra UTN FRBA. Capa de dominio puro.
 */

export const ejerciciosBloque4 = [
  {
    n: '4.10',
    t: 'Control de Nivel de Tanque con Bombas en Cascada',
    q: 'Se desea controlar el nivel de un tanque mediante dos bombas (principal y auxiliar). Sensores: S1 (Nivel mínimo), S2 (Nivel crítico inferior), S3 (Nivel máximo). Funcionamiento: 1. Al activarse S1, arranca la bomba principal Q1. 2. Si el nivel sigue bajando y se activa S2, debe arrancar también la bomba auxiliar Q2. 3. Ambas bombas se apagan inmediatamente cuando el nivel alcanza el sensor S3. Seguridad: El sistema cuenta con un pulsador de emergencia PE (I4, N/C) que detiene todo de forma instantánea.',
    io: [
      ['I1', 'Sensor de nivel mínimo S1', 'NA', 'El agua desciende por debajo de cota S1'],
      ['I2', 'Sensor de nivel crítico S2', 'NA', 'El agua desciende por debajo de cota S2'],
      ['I3', 'Sensor de nivel máximo S3', 'NA', 'El agua alcanza la cota máxima superior'],
      ['I4', 'Parada de emergencia PE', 'NC', 'En reposo (abre a 0 al pulsarlo fail-safe)'],
      ['Q1', 'Bomba de impulsión principal', 'Digital / Relé', 'Salida energizada (marcha bomba 1)'],
      ['Q2', 'Bomba de refuerzo auxiliar', 'Digital / Relé', 'Salida energizada (marcha bomba 2)']
    ],
    soft: [],
    eq: [
      'Q1 = (I1 + Q1) · NOT(I3) · I4',
      'Q2 = (I2 + Q2) · NOT(I3) · I4'
    ],
    sol: 'Esquema en cascada basado en circuitos independientes de autorretención con desenergización unificada. Al descender el fluido y cerrar el sensor S1 (NA), arranca la bomba principal Q1 y se enclava. Si la demanda supera el caudal aportado y el nivel alcanza el sensor crítico S2 (NA), arranca de forma solidaria la bomba auxiliar Q2 reteniéndose en paralelo. Cuando el volumen restablece la cota máxima S3 (NA), su contacto normalmente cerrado en Ladder abre simultáneamente ambas ramas y extingue el bombeo. El pulsador de emergencia I4 (físicamente NC) se programa como contacto abierto en serie al inicio de cada línea: conduce normalmente en reposo y corta toda alimentación instantáneamente ante accionamiento o corte de conductores.',
    e: '¿Qué es el control en cascada en sistemas de bombeo? Es una estrategia para escalonar el consumo energético según la demanda de caudal. Al bajar el nivel y activarse S1 (I1), arranca la bomba principal Q1 y se autorretiene. Si el caudal no alcanza y el agua baja al sensor crítico S2 (I2), arranca la auxiliar Q2 aportando doble caudal. Al alcanzar el sensor superior S3 (I3), el contacto cerrado /I3 abre ambas ramas y detiene el bombeo. El pulsador de emergencia PE (I4, N/C) está cableado en serie: al presionarlo la señal cae a 0 y desenergiza todo al instante.',
    i: [['I1', 'S1 Mínimo', 's'], ['I2', 'S2 Crítico', 's'], ['I3', 'S3 Máximo', 's'], ['I4', 'PE Emergencia', 'p', 1]],
    o: ['Q1', 'Q2'],
    r: [
      { c: 'R1: Bomba principal Q1 con autorretención, corte por S3 y seguridad PE I4', p: [['I1'], ['Q1']], s: ['/I3', 'I4'], o: 'Q1' },
      { c: 'R2: Bomba auxiliar Q2 con autorretención, corte por S3 y seguridad PE I4', p: [['I2'], ['Q2']], s: ['/I3', 'I4'], o: 'Q2' }
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
    q: 'Diseñar un sistema de control para dos bombas (Q1 y Q2) que operan en un sistema de bombeo cloacal o de tanque, buscando igualar las horas de uso de cada equipo. Entrada: I1 (Flotante de demanda N/A). Funcionamiento: 1. Cuando I1 se activa, debe arrancar una bomba. 2. Al desactivarse I1, la bomba en marcha se detiene. 3. En la siguiente activación de I1, debe arrancar la bomba que NO trabajó en el ciclo anterior. 4. El ciclo de alternancia (Q1-Q2-Q1-Q2) debe mantenerse indefinidamente. Seguridad: Al igual que en casos anteriores, incluir un pulsador de emergencia (I4, N/C).',
    io: [
      ['I1', 'Flotante de demanda en pozo', 'NA', 'El nivel sube y exige desagote'],
      ['I4', 'Parada de emergencia PE', 'NC', 'En reposo (abre a 0 al pulsarlo fail-safe)'],
      ['Q1', 'Bomba de impulsión cloacal 1', 'Digital / Relé', 'Salida energizada en turnos pares'],
      ['Q2', 'Bomba de impulsión cloacal 2', 'Digital / Relé', 'Salida energizada en turnos impares']
    ],
    soft: [
      ['B001', 'Relé de impulsos (Toggle biestable)', 'Conmuta su estado en cada vaciado del pozo']
    ],
    eq: [
      'B001_Trg = Flanco_Descendente(I1)',
      'Q1 = I1 · NOT(B001) · I4',
      'Q2 = I1 · B001 · I4'
    ],
    sol: 'Conmutación cíclica gobernada por un relé de impulsos biestable (Toggle). La alternancia se genera mediante el flanco descendente del flotante de demanda I1, de modo que la bandera interna B001 conmuta su estado binario recién cuando el pozo completa su vaciado y la bomba en servicio se apaga. Durante la siguiente demanda (I1 en nivel 1), la conducción se deriva hacia la bomba alternativa evaluando los contactos directo e inverso de B001. El pulsador de emergencia I4 (físicamente NC) opera en serie como contacto abierto, habilitando la maniobra en reposo e interrumpiendo el circuito de forma inmediata al accionarse.',
    e: '¿Por qué es fundamental la alternancia de bombas y cómo opera el relé de impulsos? Alternar el uso asegura que ambas bombas acumulen iguales horas de marcha, evitando desgastes dispares. El relé de impulsos conmuta el estado de B001 en cada flanco descendente de I1 (al completarse el desagote). Cuando I1 vuelve a pedir desagote, si B001 está en 0 arranca la Bomba 1 (Q1), y si está en 1 arranca la Bomba 2 (Q2). El pulsador de parada de emergencia PE I4 actúa en serie en ambas ramas.',
    i: [['I1', 'Flotante demanda', 's'], ['I4', 'PE Emergencia', 'p', 1]],
    o: ['Q1', 'Q2'],
    r: [
      { c: 'R1: Conmutación de bandera B001 en flanco descendente [↓ I1] al vaciarse el pozo', s: ['[↓ I1]'], o: '[Toggle B001]' },
      { c: 'R2: Bomba 1 habilitada en turnos pares cuando B001 = 0 condicionado a PE I4', s: ['I4', 'I1', '/B001'], o: 'Q1' },
      { c: 'R3: Bomba 2 habilitada en turnos impares cuando B001 = 1 condicionado a PE I4', s: ['I4', 'I1', 'B001'], o: 'Q2' }
    ],
    ejecutar: (S, I) => {
      if (S.previoDemanda && !I.I1) S.b001 = !S.b001;
      S.previoDemanda = Boolean(I.I1);
      S.info = !I.I4 ? '🛑 PARADA DE EMERGENCIA' : `Turno asignado: ${S.b001 ? 'Bomba 2 (Q2)' : 'Bomba 1 (Q1)'}`;
      return {
        Q1: Boolean(I.I1 && !S.b001 && I.I4),
        Q2: Boolean(I.I1 && Boolean(S.b001) && I.I4),
        B001: Boolean(S.b001)
      };
    }
  }
];
