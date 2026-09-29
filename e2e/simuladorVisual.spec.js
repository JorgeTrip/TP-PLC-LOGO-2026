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

  // Interacción en Ejercicio 4.1: pulsar marcha I1
  const botonI1 = tarjetas.first().locator('button', { hasText: 'I1 · Marcha' });
  const ledQ1 = tarjetas.first().locator('.led', { hasText: 'Q1' });

  await expect(ledQ1).not.toHaveClass(/on/);
  await botonI1.dispatchEvent('pointerdown');
  await page.waitForTimeout(100);
  await expect(ledQ1).toHaveClass(/on/);
  await botonI1.dispatchEvent('pointerup');
  await page.waitForTimeout(100);
  // Debe permanecer encendido por autorretención
  await expect(ledQ1).toHaveClass(/on/);
});
