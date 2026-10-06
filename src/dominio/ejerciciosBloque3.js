/**
 * Catálogo de ejercicios de PLC LOGO!: Bloque 3 (Ejercicios 4.7, 4.8 y 4.9).
 * Cumple normas IEC 61131-3 y cátedra UTN FRBA. Capa de dominio puro.
 */
import { detectarFlancoAscendente } from './tiposPlc.js';
import { ejercicioPorton4_9 } from './ejercicioPorton4_9.js';

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
      ['T2', 'TON (2 s)', 'Alarma cabina (presión >= 2 s)'],
      ['T5', 'TON (5 s)', 'Alarma incendio (presión >= 5 s)'],
      ['M1', 'TP (20 s)', 'Pulso de luz ante presión simple'],
      ['M2', 'Relé RS', 'Enclavamiento de alarma en cabina'],
      ['M3', 'TP (120 s)', 'Emergencia incendio (2 minutos)'],
      ['M4', 'Async (0.5 Hz)', 'Parpadeo simétrico de emergencia']
    ],
    eq: [
      'Set(M2) = Flanco_Descendente(I1) · T2 · NOT(T5)',
      'M1 = TP(Flanco_Descendente(I1) · NOT(T2), 20 s)',
      'T2_IN = I1 (TON, PT = 2 s) ; T5_IN = I1 (TON, PT = 5 s)',
      'M3 = TP(Flanco_Ascendente(T5), 120 s) ; Reset(M2) = Flanco_Ascendente(T5)',
      'M4 = M3 · Oscilador(1 s ON / 1 s OFF)',
      'Q1 = M1 + M4 ; Q2 = (M2 · NOT(M3)) + M4'
    ],
    sol: 'Discriminación temporal inmune a carreras de escaneo. Para evitar que la desactivación de los temporizadores al soltar I1 borre el tiempo acumulado antes de evaluarlo, los renglones de decisión por flanco descendente [↓ I1] se ejecutan antes de los bloques TON en el ciclo de scan: R1 enclava la alarma en cabina M2 si T2 estaba activo sin alcanzar T5, y R2 dispara la luz general M1 (20 s) si no se alcanzó T2. Superados 5 s continuos, el flanco de T5 enclava la emergencia M3 (120 s), resetea M2 y activa el oscilador asíncrono M4 a 0.5 Hz modulando Q1 y Q2.',
    e: '¿Cómo resolver la carrera de escaneo al evaluar el tiempo de pulsación? En PLC, al soltar I1 (1 a 0), un TON se apaga de inmediato. Si las decisiones se ubican antes de los temporizadores en el orden del scan, el autómata evalúa [↓ I1] con el estado aún activo de T2 y T5. Así, soltar con 2 s <= t < 5 s enclava cabina M2 sin disparar la luz de 20 s. Al llegar a 5 s, el flanco de T5 activa la emergencia de 2 min M3 y el oscilador a 0.5 Hz.',
    i: [['I1', 'Pulsador multifunción', 'p']],
    o: ['Q1', 'Q2'],
    r: [
      { c: 'R1: Enclavamiento de alarma cabina M2 al soltar con 2 s <= t < 5 s (previo a reset de TON)', s: ['[↓ I1]', 'T2', '/T5'], o: 'S M2' },
      { c: 'R2: Disparo de pulso TP M1 (20 s) al soltar con t < 2 s (previo a reset de TON)', s: ['[↓ I1]', '/T2'], o: '[TP M1 | 20s]' },
      { c: 'R3: Medición de tiempo continuo 2 s en bloque TON T2', s: ['I1'], o: '[TON T2 | 2s]' },
      { c: 'R4: Medición de tiempo continuo 5 s en bloque TON T5', s: ['I1'], o: '[TON T5 | 5s]' },
      { c: 'R5: Disparo de emergencia por incendio TP M3 (120 s) al alcanzar 5 s', s: ['[↑ T5]'], o: '[TP M3 | 120s]' },
      { c: 'R6: Reset forzado de memoria de cabina M2 por flanco de incendio', s: ['[↑ T5]'], o: 'R M2' },
      { c: 'R7: Oscilador asíncrono M4 a 0.5 Hz habilitado durante emergencia M3', s: ['M3'], o: '[Async M4 | 1s/1s]' },
      { c: 'R8: Salida de luz general Q1 gobernada por pulso simple M1 o parpadeo M4', p: [['M1'], ['M4']], o: 'Q1' },
      { c: 'R9: Salida de alarma Q2 gobernada por cabina M2 o parpadeo M4', p: [['M2', '/M3'], ['M4']], o: 'Q2' }
    ],
    ejecutar: (S, I, dt) => {
      if (I.I1) {
        S.presion = (S.presion || 0) + dt;
        if (S.presion >= 5 && !S.disparo5) {
          S.disparo5 = true; S.m2 = false; S.tEmergencia = 120; S.tReloj = 0;
        } else if (S.disparo5 && (S.tEmergencia || 0) > 0) {
          S.tReloj = (S.tReloj || 0) + dt;
        }
      } else {
        if (S.presion > 0 && S.presion < 2) S.tSimple = 20;
        else if (S.presion >= 2 && S.presion < 5) S.m2 = true;
        S.presion = 0; S.disparo2 = false; S.disparo5 = false;
        if ((S.tEmergencia || 0) > 0) S.tReloj = (S.tReloj || 0) + dt;
      }
      const emergencia = (S.tEmergencia || 0) > 0;
      const cicloReloj = emergencia && Math.floor(S.tReloj || 0) % 2 === 0;
      S.info = S.presion > 0 ? `Presión continua: ${S.presion.toFixed(1)} s` : (emergencia ? `🔥 EMERGENCIA INCENDIO: ${S.tEmergencia.toFixed(0)} s` : (S.m2 ? 'Alarma cabina activa' : ''));
      if (S.tSimple > 0) S.tSimple = Math.max(0, S.tSimple - dt);
      if (S.tEmergencia > 0) S.tEmergencia = Math.max(0, S.tEmergencia - dt);
      return {
        Q1: Boolean(emergencia ? cicloReloj : (S.tSimple || 0) > 0),
        Q2: Boolean(emergencia ? cicloReloj : Boolean(S.m2))
      };
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
      ['C1', 'Contador adelante/atrás', 'Balance vehicular nativo LOGO! (Cnt=pulsos, Dir=0 suma/1 resta)'],
      ['TP1', 'TP (3 s)', 'Temporiza apertura barrera entrada Q1'],
      ['TP2', 'TP (3 s)', 'Temporiza apertura barrera salida Q2'],
      ['TP3', 'TP (1 s)', 'Temporiza emisión de ticket Q4']
    ],
    eq: [
      'C1_Cnt = (I1 · NOT(Q3)) + I2',
      'C1_Dir = I2',
      'C1_R = I3',
      'Q3 = C1  (Activo cuando valor actual >= 50)',
      'Q1 = TP(I1 · NOT(Q3), 3 s) ; Q4 = TP(I1 · NOT(Q3), 1 s)',
      'Q2 = TP(I2, 3 s)'
    ],
    sol: 'Gestión de capacidad basada en el bloque nativo de Siemens LOGO! Contador adelante/atrás (C1) prefijado en 50 unidades. A diferencia del bloque genérico IEC, LOGO! posee una única entrada de pulsos Cnt y un borne de dirección Dir (0 = incremento, 1 = decremento). El borne Cnt recibe en paralelo los pulsos de ingreso con cupo libre (I1 · NOT Q3) y los de egreso (I2), mientras que Dir es excitado por I2 para descontar del balance. Al llegar a 50 vehículos, C1 enciende el cartel Q3 e inhibe nuevos ingresos. Los temporizadores de pulso TP gobiernan las barreras (3 s) y ticket (1 s).',
    e: '¿Cómo opera el contador adelante/atrás nativo de Siemens LOGO!? En LOGO! el bloque no dispone de entradas CU y CD separadas, sino de una entrada de conteo Cnt y un borne de dirección Dir. Los pulsos de ingreso (I1 · /Q3) y egreso (I2) se conectan en paralelo a Cnt, mientras que el sensor I2 comanda Dir para restar rodados. Al alcanzar 50 vehículos, C1 activa el cartel Q3 e inhibe el ingreso.',
    i: [['I1', 'Auto entrada', 'p'], ['I2', 'Auto salida', 'p'], ['I3', 'Reset cupos', 'p']],
    o: ['Q1', 'Q2', 'Q3', 'Q4'],
    r: [
      { c: 'R1: Entrada de pulsos Cnt en Contador C1 (PV=50) desde ingreso (/Q3) o egreso I2', p: [['I1', '/Q3'], ['I2']], o: 'C1 (Cnt)' },
      { c: 'R2: Selección de dirección Dir en Contador C1 desde sensor de egreso I2 (resta)', s: ['I2'], o: 'C1 (Dir)' },
      { c: 'R3: Reset manual del contador C1 desde pulsador I3', s: ['I3'], o: 'C1 (R)' },
      { c: 'R4: Cartel COMPLETO Q3 activado por salida del contador C1', s: ['C1'], o: 'Q3' },
      { c: 'R5: Apertura de barrera de entrada TP1 (3 s) por pulso en entrada', s: ['I1', '/Q3'], o: '[TP TP1 | 3s]' },
      { c: 'R6: Accionamiento de barrera de entrada Q1', s: ['TP1'], o: 'Q1' },
      { c: 'R7: Emisión de ticket TP3 (1 s) por vehículo ingresante', s: ['I1', '/Q3'], o: '[TP TP3 | 1s]' },
      { c: 'R8: Dispensador de ticket Q4', s: ['TP3'], o: 'Q4' },
      { c: 'R9: Apertura de barrera de salida TP2 (3 s) por vehículo saliente', s: ['I2'], o: '[TP TP2 | 3s]' },
      { c: 'R10: Accionamiento de barrera de salida Q2', s: ['TP2'], o: 'Q2' }
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
  ejercicioPorton4_9
];
