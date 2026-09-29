/**
 * Glosario didáctico de términos técnicos de automatización y PLC LOGO!.
 * Capa de dominio.
 */

export const glosarioTerminos = {
  'Siemens LOGO!': 'Micro-PLC modular para automatización básica de relés, temporizadores y contadores.',
  'LOGO!': 'Microcontrolador lógico programable de Siemens para aplicaciones industriales y edilicias.',
  'KOP': 'Diagrama de Contactos o Ladder (escalera), lenguaje gráfico basado en relés eléctricos.',
  'Ladder': 'Lenguaje de contactos en escalera (KOP) estandarizado por la norma IEC 61131-3.',
  'FBD': 'Diagrama de Bloques de Funciones (FUP en alemán), lenguaje gráfico de compuertas lógicas.',
  'AWL': 'Lista de Instrucciones (IL), lenguaje de programación de bajo nivel tipo ensamblador.',
  'TON': 'Timer On-Delay: Temporizador con retardo a la conexión. Cuenta mientras la entrada esté activa.',
  'TOF': 'Timer Off-Delay: Temporizador con retardo a la desconexión. Mantiene encendida la salida un tiempo extra.',
  'TP': 'Pulse Timer: Temporizador de impulso. Emite un pulso de duración calibrada ante un flanco.',
  'CTU': 'Count-Up: Contador ascendente por flancos de entrada hasta alcanzar el valor prefijado.',
  'CTUD': 'Count Up/Down: Contador bidireccional ascendente y descendente con reset y dirección.',
  'Autorretención': 'Circuito de sello donde un contacto auxiliar de la bobina sostiene su propia energización.',
  'Latching': 'Término en inglés para autorretención o memoria biestable de un relé.',
  'Relé autoenclavador': 'Bloque de función RS de LOGO! con memoria interna no volátil y reset prioritario.',
  'Enclavamiento': 'Interlock: Bloqueo eléctrico o lógico que impide la activación simultánea de salidas opuestas.',
  'N/A': 'Normalmente Abierto: Contacto que solo conduce corriente cuando su actuador está energizado.',
  'N/C': 'Normalmente Cerrado: Contacto que conduce en reposo y corta el paso al ser presionado.',
  'PE': 'Parada de Emergencia: Botonera tipo hongo con apertura forzada para corte seguro inmediato.',
  'Flanco positivo': 'Transición de estado bajo (0) a estado alto (1) en un ciclo de escaneo del PLC.'
};

/**
 * Resalta términos técnicos en un texto HTML envolviéndolos con etiquetas de tooltip.
 * @param {string} texto - Texto plano o HTML a procesar.
 * @returns {string} Texto con términos técnicos anotados para tooltips.
 */
export function enriquecerConGlosario(texto) {
  if (!texto) return '';
  let textoProcesado = texto;
  // Ordenar términos por longitud descendente para evitar colisiones de subcadenas
  const terminos = Object.keys(glosarioTerminos).sort((a, b) => b.length - a.length);

  terminos.forEach(termino => {
    // Regex para coincidencia exacta de palabra, evitando reemplazar dentro de tags HTML ya existentes
    const regex = new RegExp(`\\b(${termino})\\b(?![^<]*>|[^<>]*<\/span>)`, 'g');
    const explicacion = glosarioTerminos[termino];
    textoProcesado = textoProcesado.replace(regex, `<span class="termino-tecnico" tabindex="0" data-tooltip="${explicacion}">$1</span>`);
  });

  return textoProcesado;
}
