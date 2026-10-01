/**
 * Catálogo de ejercicios de PLC LOGO!: Bloque 3 (Ejercicios 4.7, 4.8 y 4.9).
 * Explicaciones técnicas y didácticas exhaustivas. Capa de dominio puro.
 */
import { detectarFlancoAscendente } from './tiposPlc.js';

export const ejerciciosBloque3 = [
  {
    n: '4.7',
    t: 'Sistema de Alerta Multifunción',
    q: 'Lógica para un pulsador (I1): Presión simple: Q1 por 20s. Presión 2s: Alarma cabina Q2. Presión 5s: Parpadeo de emergencia (Q1 y Q2) a 0.5 Hz durante 2 min (incendio).',
    io: [
      ['I1', 'Pulsador multifunción de operador', 'NA', 'Se presiona el pulsador'],
      ['Q1', 'Luminaria general / evacuación', 'Digital / Relé', 'Salida energizada (luz continua o parpadeo)'],
      ['Q2', 'Sirena / alarma en cabina de control', 'Digital / Relé', 'Salida energizada (alarma fija o parpadeo)']
    ],
    soft: [
      ['T2', 'Temporizador TON (On-Delay)', 'Discrimina pulsación continua mayor o igual a 2 segundos'],
      ['T5', 'Temporizador TON (On-Delay)', 'Discrimina pulsación continua mayor o igual a 5 segundos (alarma de incendio)'],
      ['M1', 'Generador de pulso (TP)', 'Genera pulso temporizado de 20 s para Q1 ante pulsación simple (< 2 s)'],
      ['M2', 'Marca interna de memoria', 'Activa la alarma en cabina Q2 tras 2 s continuos de pulsación'],
      ['M3', 'Generador de pulso (TP)', 'Mantiene la emergencia de incendio durante 120 s tras 5 s de pulsación'],
      ['M4', 'Generador asíncrono de pulsos', 'Oscilador a 0.5 Hz (1 s ON / 1 s OFF) para destello sincrónico']
    ],
    e: '¿Cómo discrimina un único pulsador entre tres funciones distintas? Se usan dos temporizadores TON conectados a I1: T2 (2 segundos) y T5 (5 segundos). 1) Presión simple: si el operario suelta el botón antes de los 2 s (flanco descendente de I1 con /T2 activo), se dispara un pulso fijo TP de 20 s hacia la luz Q1. 2) Presión de 2 s: al mantener pulsado 2 s continuos, T2 conmuta y activa la alarma en cabina Q2. 3) Presión de 5 s (Alarma de Incendio): al alcanzar 5 s continuos, T5 conmuta y dispara la marca de emergencia M3 por 2 minutos (120 s). Ésta habilita un generador de pulsos asíncrono de 0.5 Hz (periodo de 2 s: 1 s encendido y 1 s apagado), haciendo parpadear sincrónicamente a Q1 y Q2 con prioridad absoluta sobre cualquier otra maniobra.',
    i: [['I1', 'Pulsador multifunción', 'p']],
    o: ['Q1', 'Q2'],
    r: [
      { c: 'Detección de presión continua mayor o igual a 2 segundos', s: ['I1', '[TON 2s]'], o: 'T2' },
      { c: 'Detección de presión continua mayor o igual a 5 segundos', s: ['I1', '[TON 5s]'], o: 'T5' },
      { c: 'Presión simple (soltar antes de 2 s): disparo de pulso de luz TP de 20 s', s: ['[↓ I1]', '/T2', '[TP 20s]'], o: 'M1' },
      { c: 'Alarma fija en cabina al superar 2 segundos de presión continua', s: ['[↑ T2]', '[TP 20s]'], o: 'M2' },
      { c: 'Emergencia de incendio activada al superar 5 segundos de presión', s: ['[↑ T5]', '[TP 120s]'], o: 'M3' },
      { c: 'Generador asíncrono de parpadeo a 0.5 Hz (1 s ON / 1 s OFF)', s: ['M3', '[Async 1s/1s]'], o: 'M4' },
      { c: 'Salida de luz principal Q1 (activa por pulso simple o parpadeo de incendio)', p: [['M1'], ['M4']], o: 'Q1' },
      { c: 'Salida de cabina Q2 (el parpadeo de incendio tiene prioridad)', p: [['M2', '/M3'], ['M4']], o: 'Q2' }
    ],
    ejecutar: (S, I, dt) => {
      if (I.I1) {
        S.presion = (S.presion || 0) + dt;
        if (S.presion >= 2 && !S.disparo2) { S.disparo2 = true; S.tCabina = 20; }
        if (S.presion >= 5 && !S.disparo5) {
          S.disparo5 = true; S.tEmergencia = 120; S.tReloj = 0;
        } else if (S.disparo5 && (S.tEmergencia || 0) > 0) {
          S.tReloj = (S.tReloj || 0) + dt;
        }
      } else {
        if (S.presion > 0 && S.presion < 2) S.tSimple = 20;
        S.presion = 0; S.disparo2 = false; S.disparo5 = false;
        if ((S.tEmergencia || 0) > 0) { S.tReloj = (S.tReloj || 0) + dt; }
      }
      const emergenciaActiva = (S.tEmergencia || 0) > 0;
      const cicloReloj = emergenciaActiva && Math.floor(S.tReloj || 0) % 2 === 0;
      S.info = S.presion > 0 ? `Presión continua: ${S.presion.toFixed(1)} s` : (emergenciaActiva ? `🔥 EMERGENCIA INCENDIO: ${S.tEmergencia.toFixed(0)} s` : '');
      const salidas = {
        Q1: Boolean(emergenciaActiva ? cicloReloj : (S.tSimple || 0) > 0),
        Q2: Boolean(emergenciaActiva ? cicloReloj : (S.tCabina || 0) > 0)
      };
      if (S.tSimple > 0) S.tSimple = Math.max(0, S.tSimple - dt);
      if (S.tCabina > 0) S.tCabina = Math.max(0, S.tCabina - dt);
      if (S.tEmergencia > 0) S.tEmergencia = Math.max(0, S.tEmergencia - dt);
      return salidas;
    }
  },
  {
    n: '4.8',
    t: 'Control de Acceso a Estacionamiento',
    q: 'Playa con capacidad para 50 vehículos. Controlar barrera entrada/salida y emisión de tickets. Al llegar a 50: bloquear entrada y activar cartel "COMPLETO" (Q3).',
    io: [
      ['I1', 'Sensor de carril de entrada', 'NA', 'Vehículo posicionado sobre el sensor de entrada'],
      ['I2', 'Sensor de carril de salida', 'NA', 'Vehículo posicionado sobre el sensor de salida'],
      ['I3', 'Pulsador de reset manual de cupos', 'NA', 'Se presiona el pulsador'],
      ['Q1', 'Motor de barrera de entrada', 'Digital / Relé', 'Salida energizada (barrera abre durante 3 s)'],
      ['Q2', 'Motor de barrera de salida', 'Digital / Relé', 'Salida energizada (barrera abre durante 3 s)'],
      ['Q3', 'Cartel luminoso exterior COMPLETO', 'Digital / Relé', 'Salida energizada (cupo de 50 vehículos alcanzado)'],
      ['Q4', 'Dispensador automático de tickets', 'Digital / Relé', 'Salida energizada (emite ticket durante 1 s)']
    ],
    soft: [
      ['C1', 'Contador bidireccional (CTUD)', 'Registra ocupación neta (suma con I1, resta con I2, límite en 50)'],
      ['TP1', 'Temporizador TP (Pulso)', 'Temporiza 3 segundos la apertura de barrera de entrada Q1'],
      ['TP2', 'Temporizador TP (Pulso)', 'Temporiza 3 segundos la apertura de barrera de salida Q2'],
      ['TP3', 'Temporizador TP (Pulso)', 'Temporiza 1 segundo la emisión de ticket Q4']
    ],
    e: '¿Qué es un contador bidireccional CTUD (Count Up/Down)? Es un bloque capaz de sumar y restar eventos según la entrada excitada. Cada vehículo detectado por el sensor de entrada I1 (con cupo disponible /Q3) suma 1 al contador C1, abre la barrera de entrada Q1 por 3 segundos mediante un pulso TP y emite un ticket Q4 por 1 segundo. Cada vehículo detectado al egresar por el sensor I2 resta 1 al contador y abre la barrera de salida Q2 por 3 segundos. Al alcanzar los 50 vehículos, la salida C1 activa el cartel "COMPLETO" (Q3). Su contacto normalmente cerrado /Q3 se abre en la rama de entrada, bloqueando físicamente el paso y la entrega de tickets hasta que un auto desocupe una plaza.',
    i: [['I1', 'Auto entrada', 'p'], ['I2', 'Auto salida', 'p'], ['I3', 'Reset cupos', 'p']],
    o: ['Q1', 'Q2', 'Q3', 'Q4'],
    r: [
      { c: 'Barrera de entrada habilitada únicamente si hay cupo disponible (/Q3)', s: ['I1', '/Q3', '[TP 3s]'], o: 'Q1' },
      { c: 'Emisión automática de ticket de ingreso durante 1 segundo', s: ['I1', '/Q3', '[TP 1s]'], o: 'Q4' },
      { c: 'Barrera de salida accionada por el vehículo saliente', s: ['I2', '[TP 3s]'], o: 'Q2' },
      { c: 'Contador bidireccional CTUD: suma con I1, resta con I2 y resetea con I3', s: ['[UP/DOWN 0-50 · +=I1·/Q3 · -=I2 · R=I3]'], o: 'C1' },
      { c: 'Activación del cartel luminoso COMPLETO al alcanzar la cota de 50 autos', s: ['C1'], o: 'Q3' }
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
      const res = {
        Q1: Boolean((S.tBarreraIn || 0) > 0),
        Q2: Boolean((S.tBarreraOut || 0) > 0),
        Q3: Boolean(cupo >= 50),
        Q4: Boolean((S.tTicket || 0) > 0)
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
    q: 'Controlar portón con un único pulsador (I1): Ciclo Abrir - Parar - Cerrar - Parar. Finales de carrera I2 e I3 (ambos N/C) detienen motor en extremos.',
    io: [
      ['I1', 'Pulsador único de comando', 'NA', 'Se presiona el pulsador'],
      ['I2', 'Final de carrera FC ABIERTO', 'NC', 'Portón fuera del tope superior (abre a 0 al alcanzar apertura total)'],
      ['I3', 'Final de carrera FC CERRADO', 'NC', 'Portón fuera del tope inferior (abre a 0 al alcanzar cierre total)'],
      ['Q1', 'Motor sentido abrir portón', 'Digital / Relé', 'Salida energizada (motor eleva el portón)'],
      ['Q2', 'Motor sentido cerrar portón', 'Digital / Relé', 'Salida energizada (motor desciende el portón)']
    ],
    soft: [
      ['M0', 'Marca interna (Estado 0)', 'Estado de reposo con portón detenido y cerrado'],
      ['M1', 'Marca interna (Estado 1)', 'Estado activo de apertura con motor Q1 en ascenso'],
      ['M2', 'Marca interna (Estado 2)', 'Estado de reposo con portón detenido y abierto'],
      ['M3', 'Marca interna (Estado 3)', 'Estado activo de cierre con motor Q2 en descenso']
    ],
    e: '¿Qué es una máquina de 4 estados? Es una estructura secuencial cíclica donde el sistema recorre ordenadamente 4 fases: Estado 0 (Parado-Cerrado), Estado 1 (Abriendo Q1), Estado 2 (Parado-Abierto) y Estado 3 (Cerrando Q2). Cada pulsación de I1 avanza al estado inmediato siguiente. ¿Cómo actúan los finales de carrera N/C (limit switches)? Son interruptores mecánicos de seguridad colocados en los extremos. Al estar en reposo cerrado, el portón pisa I3, abriendo el circuito eléctrico (señal 0). En Ladder, el contacto invertido /I3 detecta esta apertura y asegura el estado de reposo cerrado. Al abrir por completo, el portón presiona I2 (señal cae a 0), y el contacto /I2 fuerza la detención inmediata (Estado 2), apagando el motor de subida Q1.',
    i: [['I1', 'Pulsador portón', 'p'], ['I2', 'Fin ABIERTO', 's', 1], ['I3', 'Fin CERRADO', 's', 1, 1]],
    o: ['Q1', 'Q2'],
    r: [
      { c: 'Transición de parado-cerrado (M0) hacia movimiento de apertura (M1)', s: ['M0', '[↑ I1]'], o: 'S M1' },
      { c: 'Detención de apertura por pulsación intermedia o final de carrera abierto /I2', p: [['M1', '[↑ I1]'], ['M1', '/I2']], o: 'S M2' },
      { c: 'Transición de parado-abierto (M2) hacia movimiento de cierre (M3)', s: ['M2', '[↑ I1]'], o: 'S M3' },
      { c: 'Detención de cierre por pulsación intermedia o final de carrera cerrado /I3', p: [['M3', '[↑ I1]'], ['M3', '/I3']], o: 'S M0' },
      { c: 'Accionamiento del motor de subida Q1 durante la etapa M1', s: ['M1'], o: 'Q1' },
      { c: 'Accionamiento del motor de bajada Q2 durante la etapa M3', s: ['M3'], o: 'Q2' }
    ],
    ejecutar: (S, I) => {
      let estado = S.s !== undefined ? S.s : 0;
      if (detectarFlancoAscendente(S, 'btn', I.I1)) estado = (estado + 1) % 4;
      if (estado === 1 && !I.I2) estado = 2;
      if (estado === 3 && !I.I3) estado = 0;
      S.s = estado;
      const etiquetas = ['Parado (cerrado) - Próximo: ABRIR', 'ABRIENDO PORTÓN (Q1)', 'Parado (abierto) - Próximo: CERRAR', 'CERRANDO PORTÓN (Q2)'];
      S.info = etiquetas[estado];
      return { Q1: estado === 1, Q2: estado === 3 };
    }
  }
];
