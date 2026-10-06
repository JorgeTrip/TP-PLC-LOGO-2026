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
    sol: 'Esquema en cascada basado en autorretención escalonada con desenergización unificada. Al descender el fluido y cerrar S1 (NA), arranca la bomba principal Q1 y se enclava. Si la demanda supera el caudal y el agua alcanza el sensor crítico S2 (NA), arranca la auxiliar Q2. Cuando el fluido recupera la cota máxima S3 (NA), su contacto negado /I3 en Ladder abre simultáneamente ambas ramas y extingue el bombeo. Seguridad industrial (Doctrina "Lo que no va por programa"): El contacto físico NC del pulsador de emergencia PE se cablea electromecánicamente en serie con la alimentación del contactor en el circuito de potencia/mando de hardware. En Ladder, I4 actúa como corte de seguridad fail-safe (contacto abierto que vale 1 en reposo) y extingue de inmediato la autorretención interna de las bombas, evitando el arranque intempestivo automático al destrabar el pulsador hongo.',
    e: '¿Por qué la parada de emergencia "no va por programa" según la cátedra? Un fallo de CPU o un relé de salida soldado mantendría el motor energizado si la parada fuera solo por software. Por norma, el contacto físico NC del pulsador hongo corta electromecánicamente la bobina del contactor en hardware. En Ladder, la entrada I4 ingresa como contacto abierto (1 en reposo): al accionarse o ante corte de cable, cae a 0, extingue al instante la autorretención de Q1 y Q2 y previene arranques intempestivos al rearmar el hongo.',
    i: [['I1', 'S1 Mínimo', 's'], ['I2', 'S2 Crítico', 's'], ['I3', 'S3 Máximo', 's'], ['I4', 'PE Emergencia', 'p', 1]],
    o: ['Q1', 'Q2'],
    r: [
      { c: 'R1: Bomba principal Q1 con autorretención, corte por S3 y seguridad PE I4', p: [['I1'], ['Q1']], s: ['/I3', 'I4'], o: 'Q1' },
      { c: 'R2: Bomba auxiliar Q2 con autorretención, corte por S3 y seguridad PE I4', p: [['I2'], ['Q2']], s: ['/I3', 'I4'], o: 'Q2' }
    ],
    ejecutar: (S, I) => {
      if (!I.I4) { S.q1 = false; S.q2 = false; } // Extingue autorretención ante emergencia
      S.q1 = Boolean((I.I1 || S.q1) && !I.I3 && I.I4);
      S.q2 = Boolean((I.I2 || S.q2) && !I.I3 && I.I4);
      S.info = !I.I4 ? '🛑 PARADA DE EMERGENCIA ACCIONADA (Corte electromecánico y software)' : `Bombas en marcha: ${S.q1 ? 'Q1' : ''}${S.q1 && S.q2 ? ' + ' : ''}${S.q2 ? 'Q2' : (!S.q1 ? 'Ninguna (Nivel adecuado)' : '')}`;
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
      ['Q1', 'Bomba de impulsión cloacal 1', 'Digital / Relé', 'Salida energizada en turnos impares (1, 3, 5...)'],
      ['Q2', 'Bomba de impulsión cloacal 2', 'Digital / Relé', 'Salida energizada en turnos pares (2, 4, 6...)']
    ],
    soft: [
      ['B001', 'Relé de impulsos', 'Conmuta en cada flanco de demanda I1 (0 a 1 en 1er ciclo)']
    ],
    eq: [
      'B001_Trg = Flanco_Ascendente(I1)',
      'Q1 = I4 · I1 · B001',
      'Q2 = I4 · I1 · NOT(B001)'
    ],
    sol: 'Durante la presencia de demanda (I1 = 1), el circuito deriva la alimentación hacia Q1 si B001 = 1 (a través de su contacto normalmente abierto), o hacia Q2 si B001 = 0 (a través de su contacto normalmente cerrado). Dado que el relé de impulsos B001 se inicializa en 0 y es disparado en el renglón 1 por el flanco ascendente de I1, la memoria conmuta a 1 en el mismo ciclo en que comienza la primera demanda, garantizando que el ciclo inicie por Q1 y continúe con la secuencia requerida Q1 - Q2 - Q1 - Q2. Seguridad industrial (Doctrina "Lo que no va por programa"): La parada de emergencia PE I4 está cableada electromecánicamente en serie con los contactores de hardware; en software abre como contacto NA garantizando interrupción inmediata ante accionamiento o corte de cable.',
    e: '¿Por qué asignar Q1 a contacto abierto y Q2 a cerrado en LOGO!Soft? Al disparar el relé de impulsos B001 en el renglón 1 con el flanco ascendente de I1, B001 conmuta de 0 a 1 en el primer scan de la primera demanda. Al asociar la Bomba 1 (Q1) al contacto abierto [ B001 ], arranca inmediatamente en el ciclo 1. En la segunda demanda, B001 conmuta a 0 y activa la Bomba 2 (Q2) mediante el contacto normalmente cerrado [/ B001 /]. La parada PE actúa en hardware y software bajo criterio fail-safe.',
    i: [['I1', 'Flotante demanda', 's'], ['I4', 'PE Emergencia', 'p', 1]],
    o: ['Q1', 'Q2'],
    r: [
      { c: 'R1: Disparo de relé de impulsos B001 en flanco ascendente de demanda I1', s: ['I1'], o: '[Trg B001]' },
      { c: 'R2: Bomba 1 habilitada por contacto abierto [ B001 ] condicionado a demanda I1 y PE I4', s: ['I4', 'I1', 'B001'], o: 'Q1' },
      { c: 'R3: Bomba 2 habilitada por contacto cerrado [/ B001 /] condicionado a demanda I1 y PE I4', s: ['I4', 'I1', '/B001'], o: 'Q2' }
    ],
    ejecutar: (S, I) => {
      if (!S.previoDemanda && I.I1) S.b001 = !S.b001;
      S.previoDemanda = Boolean(I.I1);
      S.f = Boolean(S.b001);
      S.info = !I.I4 ? '🛑 PARADA DE EMERGENCIA' : `Turno asignado: ${S.b001 ? 'Bomba 1 (Q1)' : 'Bomba 2 (Q2)'}`;
      return {
        Q1: Boolean(I.I1 && Boolean(S.b001) && I.I4),
        Q2: Boolean(I.I1 && !S.b001 && I.I4),
        B001: Boolean(S.b001),
        SF001: Boolean(S.b001)
      };
    }
  }
];
