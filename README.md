# Desarrollo Web

Proyecto académico con un landing y módulos de práctica. La Carta 2 abre **Cuentas Claras**, una SPA de finanzas personales en `modules/finanzas/finanzas.html`.

## Módulo de finanzas

- Caracterización inicial de ingresos, gastos fijos y gastos compartidos.
- Dashboard con tarjetas Bootstrap para ingresos, compromisos, disponible y gasto diario.
- Registro de movimientos por categoría.
- Persistencia en el navegador con `localStorage` y objetos JSON.
- Reinicio completo de la configuración.

## Publicación en GitHub Pages

El repositorio incluye `.github/workflows/pages.yml`. Para publicar:

1. Sube el contenido a la rama `main` o `master`.
2. En GitHub, abre **Settings > Pages**.
3. Selecciona **GitHub Actions** como fuente de publicación.
4. Espera la ejecución del workflow `Publicar en GitHub Pages`.

El enlace de la Carta 2 usa rutas relativas, por lo que funciona en GitHub Pages sin configuración adicional.
