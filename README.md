

# PokéAPI Battle Arena

Proyecto de Programación Web 1 que utiliza la PokéAPI para crear una batalla entre dos Pokémon.

## Funcionalidades

- Búsqueda de Pokémon mediante la PokéAPI.
- Sugerencias mientras el usuario escribe.
- Selección de dos Pokémon.
- Visualización de sprite, HP y cuatro movimientos.
- Ataques con daño aleatorio.
- Actualización del HP durante la batalla.
- Determinación del ganador cuando un Pokémon llega a 0 HP.
- Botón para jugar otra vez y seleccionar nuevos Pokémon.

## Tecnologías

- HTML
- CSS
- JavaScript
- PokéAPI

## API

La aplicación utiliza la API pública:

https://pokeapi.co/api/v2

Se utiliza `fetch`, `async/await` y debounce para manejar las solicitudes de forma asíncrona.

## Archivos

- `index.html`: estructura de la aplicación.
- `styles.css`: estilos de la aplicación.
- `app.js`: búsqueda, API y lógica de la batalla.