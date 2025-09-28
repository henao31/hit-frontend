import React, { useState } from "react";

interface Usuario {
  id_usuario?: number;
  nombre: string;
  cedula: string;
  fecha_nacimiento: string;
  telefono: string;
  objetivo: string;
  id_gimnasio: number;
  membresia?: string;
  entrenador?: string;
}

interface Membresia {
  id: string;
  nombre: string;
  requiereEntrenador: boolean;
}

interface Entrenador {
  id: string;
  nombre: string;
}

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [formData, setFormData] = useState<Usuario>({
    nombre: "",
    cedula: "",
    fecha_nacimiento: "",
    telefono: "",
    objetivo: "",
    id_gimnasio: 1,
    membresia: "dia",
    entrenador: "",
  });
  const [editando, setEditando] = useState<Usuario | null>(null);
  const [open, setOpen] = useState(false);

  // Membresías
  const membresias: Membresia[] = [
    { id: "dia", nombre: "Uso de Máquinas (Día)", requiereEntrenador: false },
    { id: "semana", nombre: "Membresía Semana", requiereEntrenador: true },
    { id: "quincena", nombre: "Membresía Quincena", requiereEntrenador: true },
    { id: "mes", nombre: "Membresía Mes", requiereEntrenador: true },
    { id: "tiquetera", nombre: "Tiquetera 10 Días", requiereEntrenador: false },
  ];

  // Entrenadores
  const entrenadores: Entrenador[] = [
    { id: "e1", nombre: "María Gómez" },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGuardar = () => {
    if (editando) {
      setUsuarios(
        usuarios.map((u) => (u.id_usuario === editando.id_usuario ? formData : u))
      );
    } else {
      const nuevoUsuario = { ...formData, id_usuario: Date.now() };
      setUsuarios([...usuarios, nuevoUsuario]);
    }
    setOpen(false);
    setFormData({
      nombre: "",
      cedula: "",
      fecha_nacimiento: "",
      telefono: "",
      objetivo: "",
      id_gimnasio: 1,
      membresia: "dia",
      entrenador: "",
    });
    setEditando(null);
  };

  const handleEditar = (usuario: Usuario) => {
    setEditando(usuario);
    setFormData(usuario);
    setOpen(true);
  };

  const handleEliminar = (usuario: Usuario) => {
    if (window.confirm(`¿Deseas eliminar a ${usuario.nombre}?`)) {
      setUsuarios(usuarios.filter((u) => u.id_usuario !== usuario.id_usuario));
    }
  };

  const membresiaSeleccionada = membresias.find((m) => m.id === formData.membresia);

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">Usuarios</h2>

      <button
        onClick={() => {
          setEditando(null);
          setFormData({
            nombre: "",
            cedula: "",
            fecha_nacimiento: "",
            telefono: "",
            objetivo: "",
            id_gimnasio: 1,
            membresia: "dia",
            entrenador: "",
          });
          setOpen(true);
        }}
        className="bg-cyan-600 text-white px-4 py-2 rounded mb-4 hover:bg-cyan-700 transition"
      >
        + Nuevo Usuario
      </button>

      {/* Tabla */}
      <div className="overflow-x-auto rounded-lg shadow-md">
        <table className="w-full border-collapse bg-white rounded-lg overflow-hidden">
          <thead className="bg-cyan-600 text-white">
            <tr>
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Nombre</th>
              <th className="p-2 border">Cédula</th>
              <th className="p-2 border">Fecha Nacimiento</th>
              <th className="p-2 border">Teléfono</th>
              <th className="p-2 border">Objetivo</th>
              <th className="p-2 border">Gimnasio</th>
              <th className="p-2 border">Membresía</th>
              <th className="p-2 border">Entrenador</th>
              <th className="p-2 border">Acciones</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {usuarios.map((u) => (
              <tr key={u.id_usuario} className="text-center hover:bg-gray-100 transition">
                <td className="border p-2">{u.id_usuario}</td>
                <td className="border p-2">{u.nombre}</td>
                <td className="border p-2">{u.cedula}</td>
                <td className="border p-2">{u.fecha_nacimiento}</td>
                <td className="border p-2">{u.telefono}</td>
                <td className="border p-2">{u.objetivo}</td>
                <td className="border p-2">{u.id_gimnasio}</td>
                <td className="border p-2">{u.membresia}</td>
                <td className="border p-2">{u.entrenador || "-"}</td>
                <td className="border p-2 flex justify-center gap-2">
                  <button
                    onClick={() => handleEditar(u)}
                    className="bg-cyan-600 px-3 py-1 rounded text-white hover:bg-cyan-700 transition"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleEliminar(u)}
                    className="bg-red-500 px-3 py-1 rounded text-white hover:bg-red-600 transition"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {usuarios.length === 0 && (
              <tr>
                <td colSpan={10} className="p-4 text-gray-500 text-center">
                  No hay usuarios registrados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
{open && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white text-gray-800 p-6 rounded-xl w-1/2 shadow-xl max-h-[90vh] overflow-auto">
      <h3 className="text-xl font-semibold mb-4 text-cyan-600">
        {editando ? "Editar Usuario" : "Nuevo Usuario"}
      </h3>

      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          placeholder="Nombre"
          className="p-2 rounded border border-gray-300 focus:ring-2 focus:ring-cyan-500 w-full"
        />
        <input
          type="text"
          name="cedula"
          value={formData.cedula}
          onChange={handleChange}
          placeholder="Cédula"
          className="p-2 rounded border border-gray-300 focus:ring-2 focus:ring-cyan-500 w-full"
        />
        <input
          type="date"
          name="fecha_nacimiento"
          value={formData.fecha_nacimiento}
          onChange={handleChange}
          className="p-2 rounded border border-gray-300 focus:ring-2 focus:ring-cyan-500 w-full"
        />
        <input
          type="text"
          name="telefono"
          value={formData.telefono}
          onChange={handleChange}
          placeholder="Teléfono"
          className="p-2 rounded border border-gray-300 focus:ring-2 focus:ring-cyan-500 w-full"
        />
        <input
          type="text"
          name="objetivo"
          value={formData.objetivo}
          onChange={handleChange}
          placeholder="Objetivo"
          className="p-2 rounded border border-gray-300 focus:ring-2 focus:ring-cyan-500 w-full col-span-2"
        />
        <input
          type="number"
          name="id_gimnasio"
          value={formData.id_gimnasio}
          onChange={handleChange}
          placeholder="ID Gimnasio"
          className="p-2 rounded border border-gray-300 focus:ring-2 focus:ring-cyan-500 w-full col-span-2"
        />

        {/* Membresía */}
        <select
          name="membresia"
          value={formData.membresia}
          onChange={handleChange}
          className="p-2 rounded border border-gray-300 focus:ring-2 focus:ring-cyan-500 w-full col-span-2"
        >
          {membresias.map((m) => (
            <option key={m.id} value={m.id}>
              {m.nombre}
            </option>
          ))}
        </select>

        {/* Entrenador */}
        {membresiaSeleccionada?.requiereEntrenador && (
          <select
            name="entrenador"
            value={formData.entrenador || ""}
            onChange={handleChange}
            className="p-2 rounded border border-gray-300 focus:ring-2 focus:ring-cyan-500 w-full col-span-2"
          >
            <option value="">Seleccionar Entrenador</option>
            {entrenadores.map((t) => (
              <option key={t.id} value={t.nombre}>
                {t.nombre}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="flex justify-end mt-6">
        <button
          onClick={() => setOpen(false)}
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded mr-2 hover:bg-gray-400 transition"
        >
          Cancelar
        </button>
        <button
          onClick={handleGuardar}
          className="bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-700 transition"
        >
          Guardar
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}
