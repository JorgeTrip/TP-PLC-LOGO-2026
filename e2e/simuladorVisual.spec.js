/**
 * Prueba End-to-End con Playwright para la plataforma interactiva del TP PLC 2026.
 * Valida la renderización visual de diagramas Ladder, maquetas y reactividad.
 */
import { test, expect } from '@playwright/test';
import path from 'path';

test('Debe cargar la plataforma y renderizar los 11 ejercicios con diagramas Ladder y controles', async ({ page }) => {
  const rutaHtml = path.resolve('./dist/TP_PLC_LOGO_2026.html');
  await page.goto(`file://${rutaHtml}`);

  // Verificar título del encabezado
  await expect(page.locator('header h1')).toContainText('TP PLC Siemens LOGO! 2026');

  // Verificar que existen 11 tarjetas de ejercicios con cabecera sticky de enunciado
  const tarjetas = page.locator('#contenedor-ejercicios section.card');
  await expect(tarjetas).toHaveCount(11);

  const cabecerasSticky = page.locator('.cabecera-ejercicio-sticky');
  await expect(cabecerasSticky).toHaveCount(11);

  // Verificar que cada cabecera contiene el enunciado (.q)
  const primerEnunciado = cabecerasSticky.first().locator('.q');
  await expect(primerEnunciado).toBeVisible();

  // Verificar que cada ejercicio tiene su SVG Ladder renderizado
  const svgs = page.locator('svg.ladder-svg');
  await expect(svgs).toHaveCount(11);

  // Verificar tooltips en enlaces de ejercicios de la barra lateral
  const enlaceConTooltip = page.locator('.sidebar-link[href="#ejercicio-4-1"]');
  await expect(enlaceConTooltip).toHaveAttribute('data-tooltip', /4\.1/);

  // Verificar presencia de términos técnicos interactivos con data-tooltip
  const terminosTecnicos = page.locator('.termino-tecnico');
  const cantidadTerminos = await terminosTecnicos.count();
  expect(cantidadTerminos).toBeGreaterThan(5);

  // En escritorio el header del drawer móvil debe estar oculto
  await expect(page.locator('.sidebar-header-movil')).toBeHidden();

  // Los botones del encabezado en escritorio deben estar contenidos dentro de la altura de la barra (58px)
  const headerDesktop = await page.locator('header').boundingBox();
  expect(headerDesktop.height).toBeLessThanOrEqual(60);

  // Verificar persistencia de cabecera sticky en escritorio al scrollear
  const card45 = page.locator('#ejercicio-4-5');
  await card45.scrollIntoViewIfNeeded();
  await page.mouse.wheel(0, 100);
  const sticky45 = card45.locator('.cabecera-ejercicio-sticky');
  await expect(sticky45).toBeVisible();

  // Verificar que el sidebar de escritorio no tiene desborde horizontal (sin scroll lateral)
  const sidebarDesktop = page.locator('#sidebar-principal');
  const sinScrollLateralSidebar = await sidebarDesktop.evaluate(el => el.scrollWidth <= el.clientWidth);
  expect(sinScrollLateralSidebar).toBe(true);

  // Verificar z-index del botón FAB flotante
  const zIndexFab = await page.locator('#btn-fab-top').evaluate(el => window.getComputedStyle(el).zIndex);
  expect(Number(zIndexFab)).toBeGreaterThanOrEqual(9999);

  // Verificar disposición horizontal de 2 columnas en banco de simulación
  const primerBanco = page.locator('.banco-simulacion').first();
  const boxLadder = await primerBanco.locator('.col-ladder').boundingBox();
  const boxInteractiva = await primerBanco.locator('.col-interactiva').boundingBox();
  expect(boxInteractiva.x).toBeGreaterThan(boxLadder.x);

  // Verificar estructura canónica de 4 columnas en Tabla de Asignación de I/O
  const primerCard = page.locator('#contenedor-ejercicios section.card').first();
  const tablaIo = primerCard.locator('table.tabla-io');
  await expect(tablaIo).toBeVisible();
  const cabecerasIo = tablaIo.locator('thead th');
  await expect(cabecerasIo).toHaveCount(4);
  await expect(cabecerasIo.nth(0)).toHaveText('Borne');
  await expect(cabecerasIo.nth(1)).toHaveText('Señal');
  await expect(cabecerasIo.nth(2)).toHaveText('Tipo de contacto');
  await expect(cabecerasIo.nth(3)).toHaveText('Vale 1 cuando...');

  // Verificar que ejercicio 4.1 no tiene tabla de software y ejercicio 4.3 sí la tiene con 3 columnas
  await expect(primerCard.locator('table.tabla-software')).toHaveCount(0);
  const card43 = page.locator('#ejercicio-4-3');
  const tablaSoft43 = card43.locator('table.tabla-software');
  await expect(tablaSoft43).toBeVisible();
  const cabecerasSoft = tablaSoft43.locator('thead th');
  await expect(cabecerasSoft).toHaveCount(3);
  await expect(cabecerasSoft.nth(0)).toHaveText('ID');
  await expect(cabecerasSoft.nth(1)).toHaveText('Tipo de bloque');
  await expect(cabecerasSoft.nth(2)).toHaveText('Función lógica');

  // Verificar presencia de bloques: Ecuaciones Lógicas, Solución Adoptada y Análisis Didáctico
  await expect(primerCard.locator('.bloque-ecuaciones pre.codigo-ecuaciones')).toBeVisible();
  await expect(primerCard.locator('.bloque-solucion-adoptada .parrafo-solucion-adoptada')).toBeVisible();
  await expect(primerCard.locator('.bloque-analisis-didactico .parrafo-analisis-didactico')).toBeVisible();

  // Verificar disposición lado a lado de las tablas en escritorio para ejercicio 4.3
  const boxIo43 = await card43.locator('table.tabla-io').boundingBox();
  const boxSoft43 = await tablaSoft43.boundingBox();
  expect(boxSoft43.x).toBeGreaterThan(boxIo43.x);

  // Verificar que ninguna tabla de software presenta scroll horizontal en escritorio
  const tablasContenedorSoft = page.locator('.contenedor-tabla-grupo:has(table.tabla-software) .tabla-contenedor');
  const countSoft = await tablasContenedorSoft.count();
  for (let i = 0; i < countSoft; i++) {
    const contenedor = tablasContenedorSoft.nth(i);
    const info = await contenedor.evaluate(el => ({ sw: el.scrollWidth, cw: el.clientWidth }));
    expect(info.sw <= info.cw + 1, `Tabla de software índice ${i} no debe tener scroll horizontal`).toBe(true);
  }
});

test('Debe optimizar la experiencia en móvil con drawer lateral y controles táctiles', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  const rutaHtml = path.resolve('./dist/TP_PLC_LOGO_2026.html');
  await page.goto(`file://${rutaHtml}`);

  // En móvil el botón de menú debe estar visible
  const btnMenu = page.locator('#btn-menu-movil');
  await expect(btnMenu).toBeVisible();

  const sidebar = page.locator('#sidebar-principal');
  await expect(sidebar).not.toHaveClass(/abierto/);

  // Abrir menú drawer
  await btnMenu.click();
  await expect(sidebar).toHaveClass(/abierto/);

  // Al hacer clic en un ejercicio, debe cerrar el drawer automáticamente
  const enlace42 = sidebar.locator('a[href="#ejercicio-4-2"]');
  await enlace42.click();
  await expect(sidebar).not.toHaveClass(/abierto/);

  // Verificar que el ancho de la página no desborda los 375px (sin scroll lateral)
  const noDesbordaHorizontal = await page.evaluate(() => {
    return document.documentElement.scrollWidth <= window.innerWidth;
  });
  expect(noDesbordaHorizontal).toBe(true);

  // Al hacer scroll hacia abajo en el ejercicio 4.10, la cabecera sticky debe ser visible
  const card410 = page.locator('#ejercicio-4-10');
  await card410.scrollIntoViewIfNeeded();
  await page.mouse.wheel(0, 150);
  await page.waitForTimeout(100);
  const sticky410 = card410.locator('.cabecera-ejercicio-sticky');
  await expect(sticky410).toBeVisible();

  // Verificar que en el Ejercicio 4.10 los sensores estan fuera del tanque
  const sensoresFuera = card410.locator('.tanque-visual .marca-sensor');
  await expect(sensoresFuera).toHaveCount(0);
  const escalaExterna = card410.locator('.escala-sensores');
  await expect(escalaExterna).toBeVisible();

  // Verificar FAB volver al top
  const fabTop = page.locator('#btn-fab-top');
  await expect(fabTop).toHaveClass(/visible/);
  await fabTop.click();
  await page.waitForFunction(() => window.scrollY < 500, null, { timeout: 3000 }).catch(() => {});
  const scrollY = await page.evaluate(() => window.scrollY);
  expect(scrollY).toBeLessThan(1000);
});
