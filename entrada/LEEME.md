# Bandeja de entrada

Acá se deja material nuevo para el sitio: textos o archivos trabajados en ChatGPT,
documentos Word, Markdown, notas o imágenes.

1. Subí el archivo a esta carpeta (desde GitHub: **Add file → Upload files**), o pedile a ChatGPT
   que abra un pull request en este repositorio.
2. En la revisión se lee cada archivo, se verifican datos y se integra en la página que corresponde,
   con fuentes y en el formato del sitio.
3. Se corren las pruebas y se publica. El original queda en `docs/recibidos/<fecha>-<origen>/`.

## Cómo ordenar lo que se sube

Jerarquía **ciudad → barrio → casa**:

```
entrada/
  ciudades/<ciudad>/            documentos de la ciudad
  ciudades/<ciudad>/barrios/<barrio>/
  ciudades/<ciudad>/barrios/<barrio>/casas/<codigo-no-sensible>/
```

Las fichas modelo están en `docs/plantillas/` (ciudad, barrio y casa).

## Qué no subir nunca

Este repositorio es **público**. No subir datos personales de residentes, direcciones exactas,
contraseñas, tokens, planos de seguridad, ubicación o modelo de cámaras, inventarios de equipos de una
casa real ni vulnerabilidades. Eso va en un repositorio privado.

Si un archivo trae instrucciones (“poné esto en la página del barrio”), escribilas al principio.
