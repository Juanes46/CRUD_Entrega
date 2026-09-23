import AsyncStorage from "@react-native-async-storage/async-storage";

// Clave con la que se guarda la lista de contactos en AsyncStorage.
// AsyncStorage solo guarda texto, por eso la lista se convierte
// a JSON antes de guardarla y se vuelve a parsear al leerla.
const CLAVE_CONTACTOS = "@contactos";

// Devuelve el arreglo de contactos guardado (o [] si no hay nada aún).
export const obtenerContactos = async () => {
    try {
        const json = await AsyncStorage.getItem(CLAVE_CONTACTOS);
        return json ? JSON.parse(json) : [];
    } catch (error) {
        console.error("Error al leer contactos:", error);
        return [];
    }
};

// Sobrescribe la lista completa de contactos.
const guardarContactos = async (contactos) => {
    try {
        await AsyncStorage.setItem(CLAVE_CONTACTOS, JSON.stringify(contactos));
    } catch (error) {
        console.error("Error al guardar contactos:", error);
    }
};

// Crea un contacto nuevo (nombre y teléfono) y lo agrega a la lista.
export const agregarContacto = async (nombre, telefono) => {
    const contactos = await obtenerContactos();
    const nuevoContacto = {
        id: Date.now().toString(),
        nombre: nombre.trim(),
        telefono: telefono.trim(),
    };
    const actualizados = [...contactos, nuevoContacto];
    await guardarContactos(actualizados);
    return actualizados;
};

// Actualiza el nombre/teléfono de un contacto existente por su id.
export const actualizarContacto = async (id, nombre, telefono) => {
    const contactos = await obtenerContactos();
    const actualizados = contactos.map((c) =>
        c.id === id ? { ...c, nombre: nombre.trim(), telefono: telefono.trim() } : c
    );
    await guardarContactos(actualizados);
    return actualizados;
};

// Elimina un contacto por su id.
export const eliminarContacto = async (id) => {
    const contactos = await obtenerContactos();
    const actualizados = contactos.filter((c) => c.id !== id);
    await guardarContactos(actualizados);
    return actualizados;
};
