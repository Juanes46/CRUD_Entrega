import { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Alert } from "react-native";
import {obtenerContactos,agregarContacto,actualizarContacto,eliminarContacto,
} from "../utils/contactos-storage";

export default function Contactos() {
    const [contactos, setContactos] = useState([]);
    const [nombre, setNombre] = useState("");
    const [telefono, setTelefono] = useState("");
    const [idEditando, setIdEditando] = useState(null);

    // Al montar la pantalla, se carga lo que ya esté guardado en AsyncStorage.
    useEffect(() => {
        cargarContactos();
    }, []);

    const cargarContactos = async () => {
        const lista = await obtenerContactos();
        setContactos(lista);
    };

    const limpiarFormulario = () => {
        setNombre("");
        setTelefono("");
        setIdEditando(null);
    };

    const guardar = async () => {
        if (nombre.trim() === "" || telefono.trim() === "") {
            Alert.alert("Datos incompletos", "Ingresa nombre y teléfono.");
            return;
        }

        let actualizados;
        if (idEditando) {
            actualizados = await actualizarContacto(idEditando, nombre, telefono);
        } else {
            actualizados = await agregarContacto(nombre, telefono);
        }
        setContactos(actualizados);
        limpiarFormulario();
    };

    const editar = (contacto) => {
        setIdEditando(contacto.id);
        setNombre(contacto.nombre);
        setTelefono(contacto.telefono);
    };

    const eliminar = (id) => {
        Alert.alert("Eliminar contacto", "¿Seguro que quieres eliminarlo?", [
            { text: "Cancelar", style: "cancel" },
            {
                text: "Eliminar",
                style: "destructive",
                onPress: async () => {
                    const actualizados = await eliminarContacto(id);
                    setContactos(actualizados);
                    if (idEditando === id) limpiarFormulario();
                },
            },
        ]);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>Mis Contactos</Text>

            <Text style={styles.label}>Nombre</Text>
            <TextInput
                style={styles.input}
                value={nombre}
                onChangeText={setNombre}
                placeholder="Ej: Juan Pérez"
            />

            <Text style={styles.label}>Teléfono</Text>
            <TextInput
                style={styles.input}
                value={telefono}
                onChangeText={setTelefono}
                placeholder="Ej: 3001234567"
                keyboardType="phone-pad"
            />

            <TouchableOpacity style={styles.boton} onPress={guardar}>
                <Text style={styles.botonTexto}>
                    {idEditando ? "Actualizar Contacto" : "Agregar Contacto"}
                </Text>
            </TouchableOpacity>

            {idEditando && (
                <TouchableOpacity style={styles.botonCancelar} onPress={limpiarFormulario}>
                    <Text style={styles.botonCancelarTexto}>Cancelar edición</Text>
                </TouchableOpacity>
            )}

            <FlatList
                style={{ marginTop: 20 }}
                data={contactos}
                keyExtractor={(item) => item.id}
                ListEmptyComponent={
                    <Text style={styles.vacio}>Aún no hay contactos guardados.</Text>
                }
                renderItem={({ item }) => (
                    <View style={styles.fila}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.nombreTexto}>{item.nombre}</Text>
                            <Text style={styles.telefonoTexto}>{item.telefono}</Text>
                        </View>
                        <TouchableOpacity onPress={() => editar(item)}>
                            <Text style={styles.editar}>Editar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => eliminar(item.id)}>
                            <Text style={styles.eliminar}>Eliminar</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: "#fff" },
    titulo: { fontSize: 22, fontWeight: "bold", marginBottom: 15, textAlign: "center" },
    label: { fontSize: 16, marginBottom: 5 },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 10,
        fontSize: 16,
        marginBottom: 15,
    },
    boton: { backgroundColor: "#3b82f6", padding: 15, borderRadius: 10 },
    botonTexto: { color: "#fff", textAlign: "center", fontSize: 16, fontWeight: "600" },
    botonCancelar: { marginTop: 10, padding: 10 },
    botonCancelarTexto: { color: "#6b7280", textAlign: "center", fontSize: 14 },
    vacio: { textAlign: "center", color: "#9ca3af", marginTop: 20, fontSize: 15 },
    fila: {
        flexDirection: "row",
        alignItems: "center",
        gap: 15,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    nombreTexto: { fontSize: 16, fontWeight: "600" },
    telefonoTexto: { fontSize: 14, color: "#6b7280" },
    editar: { color: "#3b82f6", fontWeight: "600" },
    eliminar: { color: "#ef4444", fontWeight: "600" },
});
