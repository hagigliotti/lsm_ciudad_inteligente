// Configuración del sitio. Lo único que hay que tocar para Google Analytics.
export const CONFIG = {
  // Pegá acá tu ID de medición de Google Analytics 4 (formato G-XXXXXXXXXX).
  // Mientras esté vacío, no se carga nada de Google. Aunque lo completes,
  // solo se carga si la persona acepta en el aviso de cookies.
  gaId: '',

  // Clave pública de Web3Forms para recibir las ideas del formulario por email.
  // Si la dejás vacía, el formulario se muestra pero avisa que está desactivado.
  web3formsKey: 'c487f5f1-eec9-4a61-accb-7c836c9ac9d0',

  // Límite de envíos desde un mismo navegador (el límite real lo aplica el servidor de Web3Forms).
  limite: { porHora: 3, esperaSegundos: 45 },
};
