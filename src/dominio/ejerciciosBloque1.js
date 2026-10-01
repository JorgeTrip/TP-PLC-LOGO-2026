/**
 * Catálogo de ejercicios de PLC LOGO!: Bloque 1 (Ejercicios 4.1, 4.2 y 4.3).
 * Explicaciones técnicas y didácticas exhaustivas. Capa de dominio puro.
 */

export const ejerciciosBloque1 = [
  {
    n: '4.1',
    t: 'Control de Motor con Retención',
    q: 'Implementar el arranque y parada de un motor utilizando lógica de autorretención. Entradas: I1 (Marcha N/A), I2 (Parada N/A). Salida: Q1 (Motor).',
    io: [
      ['I1', 'Pulsador de marcha', 'NA', 'Se presiona el pulsador'],
      ['I2', 'Pulsador de parada', 'NA', 'Se presiona el pulsador'],
      ['Q1', 'Contactor de motor trifásico', 'Digital / Relé', 'Salida energizada (motor en marcha)']
    ],
    soft: [],
    e: '¿Qué es la autorretención (o memoria por enclavamiento)? Es un circuito donde un contacto auxiliar normal abierto de la propia bobina de salida (Q1) se conecta en paralelo con el pulsador de marcha (I1). Al presionar I1, la bobina Q1 se energiza y cierra su contacto auxiliar. Al soltar I1, la corriente lógica sigue fluyendo a través de este contacto de Q1, manteniendo el motor en marcha ("sellado" o "retenido"). La parada I2 (N/A) se coloca en serie como contacto invertido (/I2): al pulsarlo se abre y corta la alimentación. Posee parada dominante: si se presionan ambos botones al mismo tiempo, el corte en serie prevalece y la salida es 0.',
    i: [['I1', 'Marcha', 'p'], ['I2', 'Parada', 'p']],
    o: ['Q1'],
    r: [{ c: 'Q1 = (I1 + Q1) · /I2 (Autorretención con parada dominante)', p: [['I1'], ['Q1']], s: ['/I2'], o: 'Q1' }],
    ejecutar: (S, I) => {
      S.q = Boolean((I.I1 || S.q) && !I.I2);
      return { Q1: S.q };
    }
  },
  {
    n: '4.2',
    t: 'Control de Motor con Bobina Set-Reset',
    q: 'Realizar la misma función que el ejercicio anterior, pero utilizando un relé autoenclavador (bloque Set-Reset). Entradas: I1 (Arranque N/A), I2 (Detención N/C). Salida: Q1 (Motor).',
    io: [
      ['I1', 'Pulsador de arranque', 'NA', 'Se presiona el pulsador'],
      ['I2', 'Pulsador de detención de emergencia', 'NC', 'En reposo (nadie lo pulsa; entrega 0 al pulsarlo por seguridad fail-safe)'],
      ['Q1', 'Contactor de motor trifásico', 'Digital / Relé', 'Salida energizada (bobina Set activada)']
    ],
    soft: [
      ['RS', 'Relé autoenclavador (Biestable)', 'Memoriza la orden de arranque mediante Set y prioriza la detención mediante Reset dominante']
    ],
    e: '¿Qué es un relé autoenclavador (bloque Set-Reset)? Es una función de memoria biestable con entradas independientes: S (Set: activa la salida en 1 de forma memorizada) y R (Reset: apaga la salida a 0). El reset es dominante (R > S). ¿Por qué el botón de detención físico es Normal Cerrado (N/C)? Por normativa de seguridad industrial (fail-safe): si el cable se corta o desconecta, la señal cae a 0 y la máquina se detiene sola. En la programación Ladder KOP, se debe colocar un contacto invertido (/I2), ya que al pulsar la detención la entrada física pasa de 1 a 0, haciendo que /I2 se cierre y envíe el pulso de 1 lógico al borne Reset.',
    i: [['I1', 'Arranque', 'p'], ['I2', 'Detención', 'p', 1]],
    o: ['Q1'],
    r: [
      { c: 'Set: orden de arranque memorizada', s: ['I1'], o: 'S Q1' },
      { c: 'Reset dominante: detención física N/C (/I2 cierra al accionar)', s: ['/I2'], o: 'R Q1' }
    ],
    ejecutar: (S, I) => {
      if (!I.I2) S.q = false;
      else if (I.I1) S.q = true;
      else S.q = Boolean(S.q);
      return { Q1: S.q };
    }
  },
  {
    n: '4.3',
    t: 'Encendido Retardado con Pre-aviso',
    q: 'El motor debe activarse con un retardo de 5 segundos tras la orden de marcha. Entradas: I1 (Arranque N/A), I2 (Parada N/A). Salidas: Q1 (Motor), Q2 (Lámpara de aviso). Q2 enciende únicamente durante el conteo previo.',
    io: [
      ['I1', 'Pulsador de marcha', 'NA', 'Se presiona el pulsador'],
      ['I2', 'Pulsador de parada', 'NA', 'Se presiona el pulsador'],
      ['Q1', 'Contactor de motor industrial', 'Digital / Relé', 'Salida energizada tras cumplirse el retardo de 5 s'],
      ['Q2', 'Lámpara de pre-aviso acústico-óptico', 'Digital / Relé', 'Salida energizada durante el conteo previo de 5 s']
    ],
    soft: [
      ['M1', 'Marca interna (Flag)', 'Memoriza la orden de marcha inicial tras pulsar I1'],
      ['T1', 'Temporizador TON (On-Delay)', 'Temporiza 5 segundos antes de habilitar el contactor del motor Q1']
    ],
    e: '¿Cómo opera el temporizador TON (Timer On-Delay / Retardo a la conexión)? Es un bloque que retrasa el encendido. Cuando su entrada recibe señal 1, el reloj comienza a contar; transcurrido el tiempo prefijado (5 segundos), su salida pasa a 1. Si la entrada se corta antes, el conteo se reinicia a 0. ¿Cómo se logra el pre-aviso? La marca interna M1 memoriza la pulsación de I1. Durante los primeros 5 segundos, M1 está activa pero el temporizador aún no venció: la condición (M1 · /T1) energiza la lámpara de aviso Q2. Cumplidos los 5 segundos, la salida T1 conmuta: abre /T1 (apagando la lámpara Q2) y cierra T1 (poniendo en marcha el motor Q1). Pulsar I2 en cualquier instante borra M1 y detiene todo.',
    i: [['I1', 'Arranque', 'p'], ['I2', 'Parada', 'p']],
    o: ['Q1', 'Q2'],
    r: [
      { c: 'Memoria de orden de marcha mediante marca M1', p: [['I1'], ['M1']], s: ['/I2'], o: 'M1' },
      { c: 'Temporizador retardo a la conexión TON de 5 segundos', s: ['M1', '[TON 5s]'], o: 'T1' },
      { c: 'Puesta en marcha del motor al finalizar los 5 segundos', s: ['M1', 'T1'], o: 'Q1' },
      { c: 'Lámpara de pre-aviso activa exclusivamente durante el conteo previo', s: ['M1', '/T1'], o: 'Q2' }
    ],
    ejecutar: (S, I, dt) => {
      S.m = Boolean((I.I1 || S.m) && !I.I2);
      S.t = S.m ? (S.t || 0) + dt : 0;
      const cumplido = S.t >= 5;
      S.info = S.m ? `Conteo en progreso: ${Math.min(S.t, 5).toFixed(1)} / 5.0 s` : 'En espera de marcha';
      return { Q1: Boolean(S.m && cumplido), Q2: Boolean(S.m && !cumplido) };
    }
  }
];
