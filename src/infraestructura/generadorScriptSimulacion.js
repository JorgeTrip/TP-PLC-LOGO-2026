/**
 * Generador del script de simulación con control de temas y anclas de sidebar.
 * Capa de infraestructura.
 */

export function generarScriptSimulacion() {
  return `
<script>
  // Control de Tema Claro / Oscuro
  const btnTema = document.getElementById('btn-tema');
  const iconoTema = document.getElementById('icono-tema');
  const textoTema = document.getElementById('texto-tema');
  const temaGuardado = localStorage.getItem('tp_plc_tema') || 'dark';

  function aplicarTema(t) {
    document.documentElement.setAttribute('data-theme', t);
    iconoTema.textContent = t === 'dark' ? '🌙' : '☀️';
    textoTema.textContent = t === 'dark' ? 'Oscuro' : 'Claro';
    localStorage.setItem('tp_plc_tema', t);
  }
  aplicarTema(temaGuardado);

  btnTema.onclick = () => {
    const actual = document.documentElement.getAttribute('data-theme');
    aplicarTema(actual === 'dark' ? 'light' : 'dark');
  };

  // Selector de velocidad
  let velocidad = 1;
  const selectorVel = document.getElementById('selector-velocidad');
  [1, 5, 20].forEach(v => {
    const b = document.createElement('button');
    b.className = 'btn' + (v === 1 ? ' on' : '');
    b.textContent = 'x' + v;
    b.onclick = () => {
      velocidad = v;
      [...selectorVel.children].forEach(c => c.classList.toggle('on', c === b));
    };
    selectorVel.append(b);
  });

  const contenedor = document.getElementById('contenedor-ejercicios');
  catalogoEjerciciosPlc.forEach(ej => {
    const estado = {}, pulsados = {}, retenidos = {};
    ej.i.forEach(([n,,,,d]) => { pulsados[n] = Boolean(d); });

    const card = document.createElement('section');
    card.className = 'card';
    card.id = 'ejercicio-' + ej.n.replace('.', '-');

    const h2 = document.createElement('h2');
    h2.textContent = ej.n + ' · ' + ej.t;
    card.append(h2);

    const h3Enun = document.createElement('h3');
    h3Enun.textContent = 'Enunciado';
    const divQ = document.createElement('div');
    divQ.className = 'q';
    divQ.textContent = ej.q;
    card.append(h3Enun, divQ);

    const h3Io = document.createElement('h3');
    h3Io.textContent = 'Asignación de Entradas y Salidas';
    const tabla = document.createElement('table');
    ej.io.forEach(([sym, desc]) => {
      const tr = document.createElement('tr');
      const td1 = document.createElement('td'); td1.textContent = sym;
      const td2 = document.createElement('td'); td2.textContent = desc;
      tr.append(td1, td2);
      tabla.append(tr);
    });
    card.append(h3Io, tabla);

    const h3Sol = document.createElement('h3');
    h3Sol.textContent = 'Solución y Análisis Técnico';
    const pSol = document.createElement('p');
    pSol.style.color = 'var(--texto-secundario)';
    pSol.textContent = ej.e;
    card.append(h3Sol, pSol);

    const h3Kop = document.createElement('h3');
    h3Kop.textContent = 'Diagrama de Contactos Ladder (KOP) — Monitoreo en Vivo';
    const svgWrap = document.createElement('div');
    svgWrap.className = 'svgw';
    card.append(h3Kop, svgWrap);

    const h3Maq = document.createElement('h3');
    h3Maq.textContent = 'Gemelo Visual del Proceso Industrial';
    const maqWrap = document.createElement('div');
    maqWrap.className = 'maqueta-wrapper';
    card.append(h3Maq, maqWrap);

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
    card.append(h3Sim, simDiv);
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
