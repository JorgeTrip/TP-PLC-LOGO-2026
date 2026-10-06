/**
 * Prueba End-to-End para el apartado tutorial de Guía de Construcción en LOGO!Soft Comfort
 * y el renderizado de bloques especiales en diagramas KOP.
 */
import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('Guía de Construcción en LOGO!Soft Comfort y Diagramas KOP', () => {
  test('Debe renderizar los 11 apartados tutoriales de LOGO!Soft y diagramas con bloques especiales', async ({ page }) => {
    const rutaHtml = path.resolve('./dist/TP_PLC_LOGO_2026.html');
    await page.goto(`file://${rutaHtml}`);

    // Verificar que existen exactamente 11 bloques de guía LOGO!Soft
    const bloquesGuia = page.locator('.bloque-guia-logo');
    await expect(bloquesGuia).toHaveCount(11);

    // Verificar encabezado y badge en cada guía
    const primerGuia = bloquesGuia.first();
    await expect(primerGuia.locator('.titulo-guia-logo')).toContainText('Guía de Construcción en LOGO!Soft Comfort');
    await expect(primerGuia.locator('.badge-logo-software')).toContainText('Tutorial KOP');

    // Ejercicio 4.1: lógica combinacional pura sin bloques especiales
    const guia41 = page.locator('#ejercicio-4-1 .bloque-guia-logo');
    await expect(guia41).toContainText('Ninguno. Se resuelve con lógica combinacional pura');
    await expect(guia41).toContainText('Parada dominante');

    // Ejercicio 4.2: relé autoenclavador con pines S y R
    const guia42 = page.locator('#ejercicio-4-2 .bloque-guia-logo');
    await expect(guia42).toContainText('Relé autoenclavador (B001, menú Otros)');
    await expect(guia42).toContainText('Terminal superior S (Set), terminal inferior R (Reset)');

    // Ejercicio 4.9: secuencia Grafcet
    const guia49 = page.locator('#ejercicio-4-9 .bloque-guia-logo');
    await expect(guia49).toContainText('Grafcet');

    // Ejercicio 4.10: doctrina de cátedra
    const guia410 = page.locator('#ejercicio-4-10 .bloque-guia-logo');
    await expect(guia410).toContainText('parada de emergencia PE se cablea electromecánicamente');

    // Ejercicio 4.11: relé de impulsos
    const guia411 = page.locator('#ejercicio-4-11 .bloque-guia-logo');
    await expect(guia411).toContainText('Relé de impulsos (B001, menú Otros)');

    // Verificar renderizado de bloques especiales en SVG de 4.2
    const svg42 = page.locator('#ejercicio-4-2 svg.ladder-svg');
    const pinesS = svg42.locator('text', { hasText: 'S' });
    expect(await pinesS.count()).toBeGreaterThan(0);
  });
});
