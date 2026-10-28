# Halloween Óptica — sitio web para GitHub Pages

Sitio estático responsive, sin frameworks ni dependencias externas. Funciona en móvil, tablet, computador y navegador de Smart TV compatible.

## Publicar en GitHub Pages
1. Crea un repositorio nuevo en GitHub, por ejemplo `halloween-optica`.
2. Sube todos los archivos y carpetas de este proyecto a la raíz del repositorio (`index.html`, `styles.css`, `app.js`).
3. En el repositorio, entra a **Settings → Pages**.
4. En **Build and deployment**, selecciona **Deploy from a branch**.
5. Selecciona la rama `main` y la carpeta `/ (root)`, y pulsa **Save**.
6. Espera a que termine el despliegue. La dirección normalmente será `https://TU-USUARIO.github.io/halloween-optica/`.

Alternativa: puedes usar el flujo de GitHub Actions incluido en `.github/workflows/pages.yml` si configuras Pages para desplegar con GitHub Actions.

## Controles
- Pestaña **Promociones**: muestra las ofertas.
- Pestaña **Ruleta**: abre la ruleta de seis sectores.
- **Girar ruleta**: selecciona un resultado al azar y anima el giro con desaceleración.
- **Ventana emergente**: al terminar el giro, presenta el resultado en una ventana animada con icono, mensaje y efectos temáticos según el resultado. Permite cerrar la ventana o girar otra vez.
- **Reiniciar**: restablece el ángulo y el resultado.
- La ventana de resultado se puede cerrar con el botón, tocando el fondo o pulsando `Escape` en teclado.

## Personalización
- Colores: variables CSS al principio de `styles.css`.
- Textos, porcentajes, resultados y colores de cada sector: lista `outcomes` en `app.js`.
- Textos de las tarjetas promocionales y aviso legal: `index.html`.

La ruleta es informativa; no entrega premios reales ni garantiza beneficios. Confirma las condiciones comerciales en tienda.
