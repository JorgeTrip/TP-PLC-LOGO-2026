/**
 * Catálogo de ejercicios de PLC LOGO!: Bloque 3 (Ejercicios 4.7, 4.8 y 4.9).
 * Cumple normas IEC 61131-3 y cátedra UTN FRBA. Capa de dominio puro.
 */
import { detectarFlancoAscendente } from './tiposPlc.js';

export const ejerciciosBloque3 = [
  {
    n: '4.7',
    t: 'Sistema de Alerta Multifunción',
    q: 'Diseñar una lógica para un pulsador (I1) con tres funciones según el tiempo de presión: Presión simple: Enciende Q1 por 20 segundos. Presión 2 segundos: Activa alarma en cabina de seguridad (Q2). Presión 5 segundos: Activa parpadeo de emergencia (Q1 y Q2) a 0.5 Hz durante 2 minutos (Alarma de Incendio).',
    io: [
      ['I1', 'Pulsador multifunción de operador', 'NA', 'Se presiona el pulsador'],
      ['Q1', 'Luminaria general / evacuación', 'Digital / Relé', 'Salida energizada (20 s fija o parpadeo)'],
      ['Q2', 'Alarma en cabina de control', 'Digital / Relé', 'Salida energizada (fija en 2s o parpadeo)']
    ],
    soft: [
      ['T2', 'Retardo a la conexión (TON, 2 s)', 'Umbral de discriminación para cabina de control'],
      ['T5', 'Retardo a la conexión (TON, 5 s)', 'Umbral de discriminación para alarma de incendio'],
      ['M1', 'Temporizador de pulso (TP, 20 s)', 'Pulso de 20 s para iluminación ante presión simple'],
      ['M2', 'Relé autoenclavador (RS)', 'Enclavamiento de alarma fija en cabina de control'],
      ['M3', 'Temporizador de pulso (TP, 120 s)', 'Ventana de emergencia de incendio de 2 minutos'],
      ['M4', 'Generador de pulsos asíncrono', 'Oscilador simétrico a 0.5 Hz (1 s ON / 1 s OFF)']
    ],
    eq: [
      'T2_IN = I1 (TON, 2 s) ; T5_IN = I1 (TON, 5 s)',
      'M1 = TP(Flanco_Descendente(I1) · NOT(T2), 20 s)',
      'Set(M2) = Flanco_Ascendente(T2) · NOT(T5) ; Reset(M2) = M3',
      'M3 = TP(Flanco_Ascendente(T5), 120 s)',
      'M4 = M3 · Oscilador(1 s ON / 1 s OFF)',
      'Q1 = M1 + M4',
      'Q2 = (M2 · NOT(M3)) + M4'
    ],
    sol: 'Discriminación de consignas por medición de tiempo continuo de entrada mediante dos bloques TON regulados a 2 y 5 segundos. La liberación de I1 antes de los 2 segundos genera un flanco descendente condicionado por NOT(T2) que activa el temporizador M1 gobernando la iluminación Q1 durante 20 segundos. Sostener la presión entre 2 y 5 segundos activa T2 y enclava la alarma fija de cabina M2 (Q2). Superar los 5 segundos acciona el temporizador de incendio M3 durante 120 segundos: resetea la alarma simple de cabina y habilita el oscilador simétrico M4 a 0.5 Hz comandando de forma simultánea e intermitente Q1 y Q2 con prioridad máxima.',
    e: '¿Cómo discrimina un único pulsador entre tres funciones distintas? Se usan dos temporizadores TON conectados a I1: T2 (2 segundos) y T5 (5 segundos). 1) Presión simple: si se suelta antes de los 2 s (flanco descendente con /T2 activo), se dispara un pulso fijo TP de 20 s hacia Q1. 2) Presión de 2 s: al mantener pulsado 2 s continuos, T2 conmuta y enclava la alarma fija de cabina M2 (Q2). 3) Presión de 5 s (Incendio): al alcanzar 5 s continuos, T5 conmuta y dispara la emergencia M3 por 2 minutos (120 s), reseteando la alarma simple y habilitando un oscilador asíncrono de 0.5 Hz comandando sincrónicamente Q1 y Q2.',
    i: [['I1', 'Pulsador multifunción', 'p']],
    o: ['Q1', 'Q2'],
    r: [
      { c: 'R1: Discriminación de presión continua >= 2 s en bloque TON T2', s: ['I1'], o: '[TON T2 | 2s]' },
      { c: 'R2: Discriminación de presión continua >= 5 s en bloque TON T5', s: ['I1'], o: '[TON T5 | 5s]' },
      { c: 'R3: Disparo de pulso TP M1 (20 s) ante liberación previa a 2 s', s: ['[↓ I1]', '/T2'], o: '[TP M1 | 20s]' },
      { c: 'R4: Enclavamiento permanente de alarma fija M2 en cabina al superar 2 s', s: ['[↑ T2]', '/T5'], o: 'S M2' },
      { c: 'R5: Disparo de emergencia por incendio TP M3 (120 s) al superar 5 s', s: ['[↑ T5]'], o: '[TP M3 | 120s]' },
      { c: 'R6: Oscilador asíncrono M4 a 0.5 Hz habilitado por emergencia M3', s: ['M3'], o: '[Async M4 | 1s/1s]' },
      { c: 'R7: Salida de luz general Q1 gobernada por pulso simple M1 o parpadeo M4', p: [['M1'], ['M4']], o: 'Q1' },
      { c: 'R8: Salida de alarma Q2 gobernada por cabina M2 o parpadeo M4', p: [['M2', '/M3'], ['M4']], o: 'Q2' }
    ],
    ejecutar: (S, I, dt) => {
      if (I.I1) {
        S.presion = (S.presion || 0) + dt;
        if (S.presion >= 2 && !S.disparo2) { S.disparo2 = true; S.m2 = true; }
        if (S.presion >= 5 && !S.disparo5) {
          S.disparo5 = true; S.m2 = false; S.tEmergencia = 120; S.tReloj = 0;
        } else if (S.disparo5 && (S.tEmergencia || 0) > 0) {
          S.tReloj = (S.tReloj || 0) + dt;
        }
      } else {
        if (S.presion > 0 && S.presion < 2) S.tSimple = 20;
        S.presion = 0; S.disparo2 = false; S.disparo5 = false;
        if ((S.tEmergencia || 0) > 0) { S.tReloj = (S.tReloj || 0) + dt; }
      }
      const emergencia = (S.tEmergencia || 0) > 0;
      const cicloReloj = emergencia && Math.floor(S.tReloj || 0) % 2 === 0;
      S.info = S.presion > 0 ? `Presión continua: ${S.presion.toFixed(1)} s` : (emergencia ? `🔥 EMERGENCIA INCENDIO: ${S.tEmergencia.toFixed(0)} s` : (S.m2 ? 'Alarma en cabina activa' : ''));
      const salidas = {
        Q1: Boolean(emergencia ? cicloReloj : (S.tSimple || 0) > 0),
        Q2: Boolean(emergencia ? cicloReloj : Boolean(S.m2))
      };
      if (S.tSimple > 0) S.tSimple = Math.max(0, S.tSimple - dt);
      if (S.tEmergencia > 0) S.tEmergencia = Math.max(0, S.tEmergencia - dt);
      return salidas;
    }
  },
  {
    n: '4.8',
    t: 'Control de Acceso a Estacionamiento',
    q: 'Gestionar una playa con capacidad para 50 vehículos. Controlar barrera de entrada/salida y emisión de tickets. Al llegar a 50, bloquear entrada y activar cartel "COMPLETO" (Q3).',
    io: [
      ['I1', 'Sensor de carril de entrada', 'NA', 'Vehículo posicionado en la entrada'],
      ['I2', 'Sensor de carril de salida', 'NA', 'Vehículo posicionado en la salida'],
      ['I3', 'Pulsador de reset manual de cupos', 'NA', 'Se presiona el pulsador'],
      ['Q1', 'Motor de barrera de entrada', 'Digital / Relé', 'Salida energizada (abre barrera por 3 s)'],
      ['Q2', 'Motor de barrera de salida', 'Digital / Relé', 'Salida energizada (abre barrera por 3 s)'],
      ['Q3', 'Cartel luminoso "COMPLETO"', 'Digital / Relé', 'Salida energizada al alcanzar 50 vehículos'],
      ['Q4', 'Dispensador de tickets', 'Digital / Relé', 'Salida energizada (emite ticket por 1 s)']
    ],
    soft: [
      ['C1', 'Contador bidireccional (CTUD, PV=50)', 'Registra el balance neto vehicular (0 a 50)'],
      ['TP1', 'Temporizador de pulso (TP, 3 s)', 'Temporiza apertura de barrera de entrada Q1'],
      ['TP2', 'Temporizador de pulso (TP, 3 s)', 'Temporiza apertura de barrera de salida Q2'],
      ['TP3', 'Temporizador de pulso (TP, 1 s)', 'Temporiza la expulsión de ticket de ingreso Q4']
    ],
    eq: [
      'C1_CU = Flanco_Ascendente(I1 · NOT(Q3))',
      'C1_CD = Flanco_Ascendente(I2)',
      'C1_R = I3',
      'Q3 = C1  (Activo cuando valor actual >= 50)',
      'Q1 = TP(I1 · NOT(Q3), 3 s)',
      'Q4 = TP(I1 · NOT(Q3), 1 s)',
      'Q2 = TP(I2, 3 s)'
    ],
    sol: 'Gestión de capacidad mediante un contador ascendente/descendente CTUD prefijado en 50 unidades. La detección de un vehículo en I1 con cupo disponible (contacto cerrado NOT Q3) incrementa el conteo y dispara dos temporizadores de pulso: TP1 para levantar la barrera de entrada Q1 por 3 segundos y TP3 para emitir el ticket Q4 por 1 segundo. El sensor de egreso I2 descuenta unidades del acumulador mediante el borne CD y habilita la barrera de salida Q2 por 3 segundos a través de TP2. Al llegar a 50 rodados, la salida C1 enciende el cartel Q3 y abre su contacto normalmente cerrado en la entrada, inhibiendo el acceso y la expedición de tickets.',
    e: '¿Qué es un contador bidireccional CTUD? Es un bloque capaz de sumar y restar eventos según la entrada excitada. Cada vehículo en I1 (con /Q3 disponible) suma 1 al contador C1, activa la barrera de entrada Q1 por 3 s y expide un ticket Q4 por 1 s. Cada vehículo detectado al egresar por I2 resta 1 y abre la barrera de salida Q2 por 3 s. Al alcanzar 50 rodados, la salida C1 enciende el cartel Q3 y abre su contacto normalmente cerrado en la entrada, inhibiendo el acceso.',
    i: [['I1', 'Auto entrada', 'p'], ['I2', 'Auto salida', 'p'], ['I3', 'Reset cupos', 'p']],
    o: ['Q1', 'Q2', 'Q3', 'Q4'],
    r: [
      { c: 'R1: Registro neto en bloque CTUD C1 (PV=50) condicionado por /Q3', s: ['I1', '/Q3'], o: '[CTUD C1 | PV=50 | CD=I2 | R=I3]' },
      { c: 'R2: Cartel COMPLETO Q3 activado por salida del contador C1', s: ['C1'], o: 'Q3' },
      { c: 'R3: Apertura de barrera de entrada TP1 (3 s) por pulso en entrada', s: ['I1', '/Q3'], o: '[TP TP1 | 3s]' },
      { c: 'R4: Accionamiento de barrera de entrada Q1', s: ['TP1'], o: 'Q1' },
      { c: 'R5: Emisión de ticket TP3 (1 s) por vehículo ingresante', s: ['I1', '/Q3'], o: '[TP TP3 | 1s]' },
      { c: 'R6: Dispensador de ticket Q4', s: ['TP3'], o: 'Q4' },
      { c: 'R7: Apertura de barrera de salida TP2 (3 s) por vehículo saliente', s: ['I2'], o: '[TP TP2 | 3s]' },
      { c: 'R8: Accionamiento de barrera de salida Q2', s: ['TP2'], o: 'Q2' }
    ],
    ejecutar: (S, I, dt) => {
      const entrada = detectarFlancoAscendente(S, 'in', I.I1);
      const salida = detectarFlancoAscendente(S, 'out', I.I2);
      let cupo = S.c !== undefined ? S.c : 0;
      if (entrada && cupo < 50) { cupo++; S.tBarreraIn = 3; S.tTicket = 1; }
      if (salida) { S.tBarreraOut = 3; if (cupo > 0) cupo--; }
      if (I.I3) cupo = 0;
      S.c = cupo;
      S.info = `Ocupación: ${cupo} / 50 vehículos${cupo >= 50 ? ' [CARTEL COMPLETO ACTIVADO]' : ''}`;
      const completo = cupo >= 50;
      const res = {
        Q1: Boolean((S.tBarreraIn || 0) > 0),
        Q2: Boolean((S.tBarreraOut || 0) > 0),
        Q3: completo,
        Q4: Boolean((S.tTicket || 0) > 0),
        C1: completo,
        TP1: Boolean((S.tBarreraIn || 0) > 0),
        TP2: Boolean((S.tBarreraOut || 0) > 0),
        TP3: Boolean((S.tTicket || 0) > 0)
      };
      if (S.tBarreraIn > 0) S.tBarreraIn = Math.max(0, S.tBarreraIn - dt);
      if (S.tBarreraOut > 0) S.tBarreraOut = Math.max(0, S.tBarreraOut - dt);
      if (S.tTicket > 0) S.tTicket = Math.max(0, S.tTicket - dt);
      return res;
    }
  },
  {
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
      ['M0', 'Marca de estado', 'Estado 0: Portón detenido cerrado'],
      ['M1', 'Marca de estado', 'Estado 1: Portón abriendo (motor subida Q1)'],
      ['M2', 'Marca de estado', 'Estado 2: Portón detenido abierto o en pausa'],
      ['M3', 'Marca de estado', 'Estado 3: Portón cerrando (motor bajada Q2)']
    ],
    eq: [
      'Paso = Flanco_Ascendente(I1)',
      'Tope_Abierto = NOT(I2) ; Tope_Cerrado = NOT(I3)',
      'Transición_M0_a_M1 = M0 · Paso',
      'Transición_M1_a_M2 = M1 · (Paso + Tope_Abierto)',
      'Transición_M2_a_M3 = M2 · Paso',
      'Transición_M3_a_M0 = M3 · (Paso + Tope_Cerrado)',
      'Q1 = M1 · NOT(Q2)',
      'Q2 = M3 · NOT(Q1)'
    ],
    sol: 'Autómata secuencial cíclico de cuatro estados resuelto mediante marcas de memoria interbloqueadas. El ciclo operativo sigue la secuencia M0 (parado cerrado) -> M1 (abriendo) -> M2 (parado intermedio/abierto) -> M3 (cerrando) -> M0. Cada flanco de subida de I1 avanza una etapa y apaga la previa. Los finales de carrera físicos NC conmutan a 0 al ser pisados por el mecanismo; su lectura negada fuerza el paso inmediato al estado de detención correspondiente (Tope superior I2 detiene M1 pasando a M2; tope inferior I3 detiene M3 pasando a M0). Ambas salidas de potencia disponen de contactos cruzados de enclavamiento impidiendo colisiones eléctricas.',
    e: '¿Qué es una máquina de 4 estados Grafcet? Es una estructura secuencial cíclica donde el sistema recorre ordenadamente 4 fases: Estado 0 (Parado-Cerrado), Estado 1 (Abriendo Q1), Estado 2 (Parado-Abierto) y Estado 3 (Cerrando Q2). Cada pulsación de I1 avanza al estado inmediato siguiente y resetea taxativamente el anterior. Los finales de carrera N/C conmutan a 0 al ser pisados; su lectura invertida (/I2 o /I3) fuerza el paso al estado de parada correspondiente.',
    i: [['I1', 'Pulsador portón', 'p'], ['I2', 'Fin ABIERTO', 's', 1], ['I3', 'Fin CERRADO', 's', 1, 1]],
    o: ['Q1', 'Q2'],
    r: [
      { c: 'R1: Transición M0 -> M1 (Comienzo de apertura al pulsar I1)', s: ['M0', '[↑ I1]'], o: 'S M1' },
      { c: 'R2: Transición M1 -> M2 (Detención por tope abierto /I2 o pulsación)', p: [['M1', '[↑ I1]'], ['M1', '/I2']], o: 'S M2' },
      { c: 'R3: Transición M2 -> M3 (Comienzo de cierre al pulsar I1)', s: ['M2', '[↑ I1]'], o: 'S M3' },
      { c: 'R4: Transición M3 -> M0 (Detención por tope cerrado /I3 o pulsación)', p: [['M3', '[↑ I1]'], ['M3', '/I3']], o: 'S M0' },
      { c: 'R5: Motor de subida Q1 activo en M1 con interbloqueo eléctrico /Q2', s: ['M1', '/Q2'], o: 'Q1' },
      { c: 'R6: Motor de bajada Q2 activo en M3 con interbloqueo eléctrico /Q1', s: ['M3', '/Q1'], o: 'Q2' }
    ],
    ejecutar: (S, I) => {
      let estado = S.s !== undefined ? S.s : 0;
      if (detectarFlancoAscendente(S, 'btn', I.I1)) estado = (estado + 1) % 4;
      if (estado === 1 && !I.I2) estado = 2;
      if (estado === 3 && !I.I3) estado = 0;
      S.s = estado;
      const etiquetas = ['Parado (cerrado) - Próximo: ABRIR', 'ABRIENDO PORTÓN (Q1)', 'Parado (abierto) - Próximo: CERRAR', 'CERRANDO PORTÓN (Q2)'];
      S.info = etiquetas[estado];
      return {
        Q1: estado === 1,
        Q2: estado === 3,
        M0: estado === 0,
        M1: estado === 1,
        M2: estado === 2,
        M3: estado === 3
      };
    }
  }
];
