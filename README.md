# App_Contactos

CRUD de contactos (nombre y teléfono) usando **AsyncStorage** en React Native / Expo Router.

## Cómo correrlo

1. Descomprime el proyecto.
2. Abre una terminal dentro de la carpeta `App_Contactos`.
3. Instala las dependencias:
   ```
   npm install
   ```
4. Corre en modo web:
   ```
   npm run web
   ```
   o en un emulador/dispositivo:
   ```
   npm start
   ```

## Estructura

- `app/_layout.jsx` — layout raíz (Stack de expo-router).
- `app/index.jsx` — pantalla única con el CRUD completo (formulario + lista).
- `utils/contactos-storage.js` — funciones que hablan con AsyncStorage:
  `obtenerContactos`, `agregarContacto`, `actualizarContacto`, `eliminarContacto`.

## Cómo funciona el CRUD

- **Crear**: llenas nombre y teléfono y tocas "Agregar Contacto".
- **Leer**: la lista se carga automáticamente al abrir la app (`useEffect` + `obtenerContactos`).
- **Actualizar**: tocas "Editar" en un contacto, el formulario se llena con sus datos y el botón cambia a "Actualizar Contacto".
- **Eliminar**: tocas "Eliminar" y confirmas; se borra de la lista y de AsyncStorage.

Todo se guarda como un único arreglo JSON bajo la clave `@contactos` en AsyncStorage.
