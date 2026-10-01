/**
 * Catálogo de ejercicios de PLC LOGO!: Bloque 1 (Ejercicios 4.1, 4.2 y 4.3).
 * Cumple normas IEC 61131-3 y cátedra UTN FRBA. Capa de dominio puro.
 */

export const ejerciciosBloque1 = [
  {
    n: '4.1',
    t: 'Control de Motor con Retención',
    q: 'Implementar el arranque y parada de un motor utilizando lógica de autorretención. Entradas: I1 (Pulsador de marcha N/A), I2 (Pulsador de parada N/A). Salida: Q1 (Motor).',
    io: [
      ['I1', 'Pulsador de marcha', 'NA', 'Se presiona el pulsador'],
      ['I2', 'Pulsador de parada', 'NA', 'Se presiona el pulsador'],
      ['Q1', 'Contactor de motor principal', 'Digital / Relé', 'Salida energizada (motor en giro)']
    ],
    soft: [],
    eq: [
      'Q1 = (I1 + Q1) · NOT(I2)'
    ],
    sol: 'Mando de marcha y parada resuelto mediante memoria por autorretención con parada dominante. El contacto auxiliar abierto de Q1 se conecta en paralelo con el pulsador de arranque I1. La orden de parada I2 (físicamente NA) se programa como contacto normalmente cerrado en serie en la línea principal, interrumpiendo el flujo eléctrico hacia la bobina aún ante la presencia simultánea de la señal de marcha.',
    e: '¿Qué es la autorretención (o memoria por enclavamiento)? Es un circuito donde un contacto auxiliar normal abierto de la propia bobina de salida (Q1) se conecta en paralelo con el pulsador de marcha (I1). Al presionar I1, la bobina Q1 se energiza y cierra su contacto auxiliar. Al soltar I1, la corriente lógica sigue fluyendo a través de este contacto de Q1, manteniendo el motor en marcha ("sellado" o "retenido"). La parada I2 (N/A) se coloca en serie como contacto invertido (/I2): al pulsarlo se abre y corta la alimentación. Posee parada dominante: si se presionan ambos botones al mismo tiempo, el corte en serie prevalece y la salida es 0.',
    i: [['I1', 'Marcha', 'p'], ['I2', 'Parada', 'p']],
    o: ['Q1'],
    r: [
      { c: 'R1: Autorretención con parada dominante', p: [['I1'], ['Q1']], s: ['/I2'], o: 'Q1' }
    ],
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
      ['I2', 'Pulsador de detención de seguridad', 'NC', 'En reposo (abre a 0 al pulsarlo por seguridad fail-safe)'],
      ['Q1', 'Contactor de motor principal', 'Digital / Relé', 'Salida energizada (bloque RS en Set)']
    ],
    soft: [
      ['RS_Q1', 'Relé RS', 'Memoria con Reset dominante (/I2)']
    ],
    eq: [
      'Set(RS_Q1) = I1',
      'Reset(RS_Q1) = NOT(I2)',
      'Q1 = RS_Q1'
    ],
    sol: 'Circuito biestable resuelto mediante un relé autoenclavador con prioridad al Reset. El pulsador de arranque I1 excita el terminal Set. Por criterios de seguridad funcional, el pulsador de parada I2 posee contacto físico NC y entrega señal continua en reposo; se programa un contacto negado en el renglón correspondiente para enviar nivel 1 al terminal Reset únicamente cuando la línea física se abre al accionarlo o por corte de cable.',
    e: '¿Qué es un relé autoenclavador (bloque Set-Reset)? Es una función de memoria biestable con entradas independientes: S (Set: activa la salida en 1 de forma memorizada) y R (Reset: apaga la salida a 0). El reset es dominante (R > S). ¿Por qué el botón de detención físico es Normal Cerrado (N/C)? Por normativa de seguridad industrial (fail-safe): si el cable se corta o desconecta, la señal cae a 0 y la máquina se detiene sola. En la programación Ladder KOP, se debe colocar un contacto invertido (/I2), ya que al pulsar la detención la entrada física pasa de 1 a 0, haciendo que /I2 se cierre y envíe el pulso de 1 lógico al borne Reset.',
    i: [['I1', 'Arranque', 'p'], ['I2', 'Detención', 'p', 1]],
    o: ['Q1'],
    r: [
      { c: 'R1: Excitación del terminal Set mediante pulsador NA', s: ['I1'], o: 'S RS_Q1' },
      { c: 'R2: Excitación del terminal Reset por apertura de I2 (NC)', s: ['/I2'], o: 'R RS_Q1' },
      { c: 'R3: Gobierno del contactor principal Q1 desde el bloque RS', s: ['RS_Q1'], o: 'Q1' }
    ],
    ejecutar: (S, I) => {
      if (!I.I2) S.q = false;
      else if (I.I1) S.q = true;
      else S.q = Boolean(S.q);
      return { Q1: S.q, RS_Q1: S.q };
    }
  },
  {
    n: '4.3',
    t: 'Encendido Retardado con Pre-aviso',
    q: 'El motor debe activarse con un retardo de 5 segundos tras la orden de marcha. Entradas: I1 (Arranque N/A), I2 (Parada N/A). Salidas: Q1 (Motor), Q2 (Lámpara de aviso). Condición: Q2 debe permanecer encendida únicamente durante el conteo de los 5 segundos previos al arranque de Q1.',
    io: [
      ['I1', 'Pulsador de arranque', 'NA', 'Se presiona el pulsador'],
      ['I2', 'Pulsador de parada', 'NA', 'Se presiona el pulsador'],
      ['Q1', 'Contactor de motor principal', 'Digital / Relé', 'Salida energizada tras cumplirse el retardo'],
      ['Q2', 'Lámpara de pre-aviso', 'Digital / Relé', 'Salida energizada durante el conteo de 5 s']
    ],
    soft: [
      ['M1', 'Marca interna', 'Memoriza la orden de marcha general'],
      ['T1', 'TON (5 s)', 'Retardo previo al arranque del motor']
    ],
    eq: [
      'M1 = (I1 + M1) · NOT(I2)',
      'T1_IN = M1',
      'Q1 = M1 · T1',
      'Q2 = M1 · NOT(T1)'
    ],
    sol: 'Control temporizado articulado mediante una marca interna M1 retenida por autorretención desde I1 y desenergizada por I2. M1 habilita en paralelo un bloque TON de 5 segundos y la señalización Q2 mediante un contacto cerrado del propio temporizador. Durante los primeros 5 segundos, Q2 permanece activa y Q1 inhibida. Vencido el tiempo, T1 conmuta: abre el paso hacia la lámpara Q2 y cierra la alimentación al contactor Q1.',
    e: '¿Cómo opera el temporizador TON (Timer On-Delay / Retardo a la conexión)? Es un bloque que retrasa el encendido. Cuando su entrada recibe señal 1, el reloj comienza a contar; transcurrido el tiempo prefijado (5 segundos), su salida pasa a 1. Si la entrada se corta antes, el conteo se reinicia a 0. ¿Cómo se logra el pre-aviso? La marca interna M1 memoriza la pulsación de I1. Durante los primeros 5 segundos, M1 está activa pero el temporizador aún no venció: la condición (M1 · /T1) energiza la lámpara de aviso Q2. Cumplidos los 5 segundos, la salida T1 conmuta: abre /T1 (apagando la lámpara Q2) y cierra T1 (poniendo en marcha el motor Q1). Pulsar I2 en cualquier instante borra M1 y detiene todo.',
    i: [['I1', 'Arranque', 'p'], ['I2', 'Parada', 'p']],
    o: ['Q1', 'Q2'],
    r: [
      { c: 'R1: Memoria de orden de marcha general en marca M1', p: [['I1'], ['M1']], s: ['/I2'], o: 'M1' },
      { c: 'R2: Entrada IN del bloque temporizador TON T1 (5 s)', s: ['M1'], o: '[TON T1 | 5s]' },
      { c: 'R3: Puesta en marcha de Q1 tras conmutar el contacto T1', s: ['M1', 'T1'], o: 'Q1' },
      { c: 'R4: Lámpara de aviso Q2 activa mientras T1 no haya vencido', s: ['M1', '/T1'], o: 'Q2' }
    ],
    ejecutar: (S, I, dt) => {
      S.m = Boolean((I.I1 || S.m) && !I.I2);
      S.t = S.m ? (S.t || 0) + dt : 0;
      const cumplido = S.t >= 5;
      S.info = S.m ? `Conteo en progreso: ${Math.min(S.t, 5).toFixed(1)} / 5.0 s` : 'En espera de marcha';
      return { Q1: Boolean(S.m && cumplido), Q2: Boolean(S.m && !cumplido), M1: S.m, T1: cumplido };
    }
  }
];
