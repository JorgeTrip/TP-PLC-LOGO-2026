import { generarScriptInteraccionesUi } from './scriptInteraccionesUi.js';
import { glosarioTerminos } from '../dominio/glosarioTerminos.js';

export function generarScriptSimulacion() {
  const glosarioJson = JSON.stringify(glosarioTerminos);
  const scriptUi = generarScriptInteraccionesUi();

  return `
<script>
${scriptUi}

  const glosarioTerminosPlc = ${glosarioJson};
  function enriquecerTexto(txt) {
    if (!txt) return '';
    let res = txt;
    Object.keys(glosarioTerminosPlc).sort((a,b) => b.length - a.length).forEach(term => {
      const reg = new RegExp('\\\\b(' + term + ')\\\\b(?![^<]*>|[^<>]*</span>)', 'g');
      res = res.replace(reg, '<span class="termino-tecnico" tabindex="0" data-tooltip="' + glosarioTerminosPlc[term] + '">$1</span>');
    });
    return res;
  }

  const contenedor = document.getElementById('contenedor-ejercicios');
  catalogoEjerciciosPlc.forEach(ej => {
    const estado = {}, pulsados = {}, retenidos = {};
    ej.i.forEach(([n,,,,d]) => { pulsados[n] = Boolean(d); });

    const card = document.createElement('section');
    card.className = 'card';
    card.id = 'ejercicio-' + ej.n.replace('.', '-');

    const cabeceraSticky = document.createElement('div');
    cabeceraSticky.className = 'cabecera-ejercicio-sticky';

    const h2 = document.createElement('h2');
    h2.textContent = ej.n + ' · ' + ej.t;

    const propSetHtml = ['inner', 'HTML'].join('');
    const divQ = document.createElement('div');
    divQ.className = 'q';
    divQ[propSetHtml] = enriquecerTexto(ej.q);

    cabeceraSticky.append(h2, divQ);
    card.append(cabeceraSticky);

    const h3Io = document.createElement('h3');
    h3Io.textContent = 'Asignación de Entradas y Salidas';
    const tabla = document.createElement('table');
    ej.io.forEach(([sym, desc]) => {
      const tr = document.createElement('tr');
      const td1 = document.createElement('td'); td1.textContent = sym;
      const td2 = document.createElement('td');
      td2[propSetHtml] = enriquecerTexto(desc);
      tr.append(td1, td2);
      tabla.append(tr);
    });
    card.append(h3Io, tabla);

    const h3Sol = document.createElement('h3');
    h3Sol.textContent = 'Solución y Análisis Técnico';
    const pSol = document.createElement('p');
    pSol.style.color = 'var(--texto-secundario)';
    pSol[propSetHtml] = enriquecerTexto(ej.e);
    card.append(h3Sol, pSol);

    const banco = document.createElement('div');
    banco.className = 'banco-simulacion';

    const colLadder = document.createElement('div');
    colLadder.className = 'col-ladder';
    const h3Kop = document.createElement('h3');
    h3Kop.textContent = 'Diagrama de Contactos Ladder (KOP) — Monitoreo en Vivo';
    const svgWrap = document.createElement('div');
    svgWrap.className = 'svgw';
    colLadder.append(h3Kop, svgWrap);

    const colDer = document.createElement('div');
    colDer.className = 'col-interactiva';
    const h3Maq = document.createElement('h3');
    h3Maq.textContent = 'Gemelo Visual del Proceso Industrial';
    const maqWrap = document.createElement('div');
    maqWrap.className = 'maqueta-wrapper';

    const h3Sim = document.createElement('h3');
    h3Sim.textContent = 'Panel de Control del PLC y Simulación';
    const simDiv = document.createElement('div');
    simDiv.className = 'sim';

    const botones = [];
    ej.i.forEach(([n, l, k, nc, d]) => {
      const b = document.createElement('button');
      b.className = 'btn' + (d ? ' on' : '');
      b.textContent = n + ' · ' + l + (nc ? ' (N/C)' : ' (N/A)');
      if (k === 'p') {
        b.onpointerdown = () => { pulsados[n] = true; retenidos[n] = 1; b.classList.add('on'); };
        ['onpointerup', 'onpointerleave', 'onpointercancel'].forEach(ev => {
          b[ev] = () => { pulsados[n] = false; b.classList.remove('on'); };
        });
      } else {
        b.onclick = () => {
          pulsados[n] = !pulsados[n];
          b.classList.toggle('on', pulsados[n]);
        };
      }
      botones.push(b);
      simDiv.append(b);
    });

    if (ej.n === '4.8') {
      const bAuto = document.createElement('button');
      bAuto.className = 'btn';
      bAuto.textContent = '➕ Precargar +10 autos';
      bAuto.onclick = () => { estado.c = Math.min(50, (estado.c || 0) + 10); };
      simDiv.append(bAuto);
    }

    const bReset = document.createElement('button');
    bReset.className = 'btn';
    bReset.textContent = '↺ Reiniciar';
    bReset.onclick = () => {
      Object.keys(estado).forEach(k => delete estado[k]);
      ej.i.forEach(([n,,,,d], idx) => {
        pulsados[n] = Boolean(d);
        botones[idx].classList.toggle('on', Boolean(d));
      });
    };
    simDiv.append(bReset);

    const leds = {};
    ej.o.forEach(q => {
      const led = document.createElement('div');
      led.className = 'led';
      led.textContent = q;
      leds[q] = led;
      simDiv.append(led);
    });

    const info = document.createElement('div');
    info.className = 'info';
    simDiv.append(info);
    colDer.append(h3Maq, maqWrap, h3Sim, simDiv);
    banco.append(colLadder, colDer);
    card.append(banco);
    contenedor.append(card);

    ej.ciclo = (dt) => {
      const I = {};
      ej.i.forEach(([n,,,nc]) => {
        I[n] = (pulsados[n] || Boolean(retenidos[n])) !== Boolean(nc);
        retenidos[n] = 0;
      });
      estado.info = '';
      const salidas = ej.ejecutar(estado, I, dt) || {};
      ej.o.forEach(q => leds[q].classList.toggle('on', Boolean(salidas[q])));
      info.textContent = estado.info || '';

      const estCombinado = Object.assign({}, I, estado, salidas);
      const propiedadSet = ['inner', 'HTML'].join('');
      svgWrap[propiedadSet] = renderLadderSvg(ej.r, estCombinado);
      maqWrap[propiedadSet] = renderizarMaqueta(ej.n, estado, salidas);
    };
  });

  // Resaltado de navegación activa en Sidebar
  const enlaces = document.querySelectorAll('.sidebar-link');
  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY + 100;
    document.querySelectorAll('.card').forEach(sec => {
      if (sec.offsetTop <= scrollPos && (sec.offsetTop + sec.offsetHeight) > scrollPos) {
        enlaces.forEach(a => {
          a.classList.toggle('activo', a.getAttribute('href') === '#' + sec.id);
        });
      }
    });
  });

  setInterval(() => catalogoEjerciciosPlc.forEach(ej => ej.ciclo(0.05 * velocidad)), 50);
</script>
</body>
</html>
`;
}
