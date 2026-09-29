/**
 * Estilos para componentes: tarjetas, SVG Ladder, simulación y maquetas.
 * Capa de presentación.
 */

export const estilosComponentesCss = `
.card {
  background: var(--bg-card);
  border: 1px solid var(--borde-card);
  border-radius: 18px;
  padding: 24px;
  margin: 0 0 28px;
  box-shadow: 0 10px 30px var(--sombra-card);
  scroll-margin-top: 70px;
  position: relative;
}
.cabecera-ejercicio-sticky {
  position: sticky;
  top: 58px;
  z-index: 20;
  background: var(--bg-card);
  padding: 16px 20px 14px;
  margin: -24px -24px 20px -24px;
  border-top-left-radius: 17px;
  border-top-right-radius: 17px;
  border-bottom: 1px solid var(--borde-card);
  box-shadow: 0 4px 14px var(--sombra-card);
}
.cabecera-ejercicio-sticky h2 {
  margin: 0 0 8px;
  font-size: 20px;
  color: var(--acento-azul);
}
.cabecera-ejercicio-sticky .q {
  margin: 0;
  font-size: 13.5px;
  line-height: 1.5;
  padding: 10px 14px;
}
h2 { margin: 0 0 12px; font-size: 22px; color: var(--acento-azul); }
h3 { margin: 18px 0 8px; font-size: 13px; letter-spacing: .08em; text-transform: uppercase; color: var(--texto-secundario); }
.q {
  border-left: 3px solid var(--acento-purpura);
  background: var(--bg-bloque-q);
  padding: 12px 18px;
  border-radius: 0 12px 12px 0;
  color: var(--texto-principal);
}
table { border-collapse: collapse; width: 100%; margin: 8px 0; }
td { border-bottom: 1px solid var(--borde-card); padding: 8px; font-size: 14px; }
td:first-child { width: 90px; color: var(--acento-purpura); font-family: ui-monospace, monospace; font-weight: 600; }
.svgw { overflow-x: auto; background: var(--bg-svg); border-radius: 14px; padding: 16px; border: 1px solid var(--borde-card); }
svg.ladder-svg .k { stroke: var(--trazo-inactivo); stroke-width: 2; fill: none; transition: stroke .2s, filter .2s; }
svg.ladder-svg .k.energized { stroke: var(--acento-azul); stroke-width: 2.5; filter: drop-shadow(0 0 5px var(--acento-azul)); }
svg.ladder-svg .b { fill: var(--fill-bloque); stroke: var(--trazo-inactivo); stroke-width: 1.5; transition: all .2s; }
svg.ladder-svg .b.energized { stroke: var(--acento-azul); fill: var(--fill-bloque-activo); filter: drop-shadow(0 0 6px rgba(56,189,248,0.4)); }
svg.ladder-svg .t { fill: var(--texto-contacto); font: 12px ui-monospace, monospace; text-anchor: middle; transition: fill .2s; }
svg.ladder-svg .t.energized { fill: var(--acento-azul); font-weight: bold; }
svg.ladder-svg .c { fill: var(--texto-secundario); font: 11px system-ui, sans-serif; font-style: italic; }
.sim { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; margin-top: 14px; }
.btn {
  background: var(--bg-btn); color: var(--texto-principal);
  border: 1px solid var(--borde-card); border-radius: 10px;
  padding: 10px 16px; cursor: pointer; user-select: none;
  font-size: 13px; font-weight: 500; transition: all .15s;
}
.btn:hover { background: var(--bg-btn-hover); }
.btn.on { background: #0369a1; border-color: var(--acento-azul); color: #fff; box-shadow: 0 0 12px rgba(56,189,248,0.4); }
.led {
  width: 46px; height: 46px; border-radius: 50%; background: var(--bg-led);
  display: grid; place-items: center; font-weight: 700; font-size: 13px;
  border: 2px solid var(--borde-card); transition: all .2s;
}
.led.on { background: var(--acento-verde); color: #064e3b; box-shadow: 0 0 20px var(--acento-verde); }
.info { color: var(--texto-secundario); font-family: ui-monospace, monospace; font-size: 13px; width: 100%; margin-top: 6px; }

/* Maquetas */
.maqueta-contenedor { margin: 16px 0; }
.maqueta-marco {
  background: var(--bg-maqueta); border: 1px dashed var(--borde-card);
  border-radius: 14px; padding: 18px;
}
.motor-chasis { display: flex; gap: 20px; align-items: center; }
.motor-svg.girando { animation: girarMotor 1.2s linear infinite; }
@keyframes girarMotor { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
.motor-estado-tag { font-weight: 700; font-size: 14px; border: 1px solid; border-radius: 8px; padding: 4px 10px; display: inline-flex; align-items: center; gap: 6px; }
.motor-led-dot { width: 8px; height: 8px; border-radius: 50%; }
.preaviso-caja { margin-top: 10px; }
.baliza-icono { padding: 6px 12px; border-radius: 6px; font-weight: 600; font-size: 12px; }
.baliza-activa { animation: parpadeoBaliza .6s alternate infinite; }
@keyframes parpadeoBaliza { from { opacity: .4; } to { opacity: 1; } }
.barra-progreso-bg { width: 180px; height: 8px; background: #334155; border-radius: 4px; overflow: hidden; margin-top: 6px; }
.barra-progreso-fill { height: 100%; background: var(--acento-ambar); transition: width .1s; }
.tanque-flex { display: flex; gap: 24px; align-items: center; flex-wrap: wrap; }
.tanque-visual { width: 140px; height: 160px; border: 3px solid var(--acento-azul); border-radius: 0 0 12px 12px; position: relative; background: var(--bg-svg); overflow: hidden; }
.tanque-nivel { position: absolute; bottom: 0; width: 100%; background: linear-gradient(180deg, #38bdf8, #0284c7); opacity: .85; transition: height .3s; display: grid; place-items: center; color: #fff; font-size: 12px; font-weight: 700; }
.marca-sensor { position: absolute; right: 4px; font-size: 10px; color: #94a3b8; font-family: monospace; }
.marca-sensor.s3 { top: 15px; } .marca-sensor.s1 { top: 70px; } .marca-sensor.s2 { top: 125px; }
.porton-fachada { position: relative; }
.porton-marco { width: 200px; height: 120px; border: 3px solid #64748b; background: var(--bg-svg); position: relative; overflow: hidden; margin: 10px 0; }
.porton-hoja { width: 100%; background: repeating-linear-gradient(0deg, #334155, #334155 10px, #1e293b 10px, #1e293b 20px); position: absolute; top: 0; transition: height .2s linear; display: flex; align-items: flex-end; justify-content: center; }
.porton-label { font-size: 11px; font-weight: 700; color: #38bdf8; background: rgba(0,0,0,0.6); padding: 2px 6px; border-radius: 4px; margin-bottom: 4px; }
.sensor-fc { font-size: 11px; color: var(--texto-secundario); font-family: monospace; }
.parking-grid { display: flex; flex-direction: column; gap: 12px; }
.display-cartel { font-size: 16px; font-weight: 800; padding: 8px 16px; border-radius: 8px; text-align: center; }
.display-cartel.completo { background: #7f1d1d; color: #fca5a5; border: 1px solid #ef4444; }
.display-cartel.libre { background: #064e3b; color: #86efac; border: 1px solid #22c55e; }
.barreras-status { display: flex; gap: 10px; flex-wrap: wrap; }
.barrera-badge { font-size: 12px; padding: 6px 10px; border-radius: 6px; background: var(--bg-btn); color: var(--texto-secundario); }
.barrera-badge.abierta { background: #0284c7; color: #fff; font-weight: 700; }
.barrera-badge.emitiendo { background: #d97706; color: #fff; font-weight: 700; }
.bombas-alternadas-grid { display: flex; gap: 16px; }
.bomba-card { background: var(--bg-btn); padding: 14px; border-radius: 10px; border: 1px solid var(--borde-card); display: flex; flex-direction: column; gap: 4px; align-items: center; width: 140px; }
.bomba-card.activa { border-color: var(--acento-verde); background: #064e3b; color: #fff; }
`;
