import React, { useState } from "react";

// Definimos el tipo de usuario según tu tabla
interface Usuario {
  idUsuario: number;
  nombre: string;
  cedula: string;
  fechaNacimiento: string;
  telefono: string;
  objetivo: string;
  idGimnasio: number;
}

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([
    {
      idUsuario: 1,
      nombre: "Juan Pérez",
      cedula: "12345678",
      fechaNacimiento: "1995-05-21",
      telefono: "321654987",
      objetivo: "Perder peso",
      idGimnasio: 10,
    },
  ]);

  const [editando, setEditando] = useState<Usuario | null>(null);
  const [open, setOpen] = useState(false);

  // Abrir modal en modo edición
  const handleEditar = (usuario: Usuario) => {
    setEditando(usuario);
    setOpen(true);
  };

  // Eliminar usuario
  const handleEliminar = (id: number) => {
    if (confirm(`¿Seguro que deseas eliminar el usuario con ID: ${id}?`)) {
      setUsuarios((prev) => prev.filter((u) => u.idUsuario !== id));
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Usuarios</h2>

      {/* Botón nuevo usuario */}
      <button
        onClick={() => {
          setEditando(null);
          setOpen(true);
        }}
        className="bg-cyan-600 text-white px-4 py-2 rounded mb-4 hover:bg-cyan-700"
      >
        + Nuevo Usuario
      </button>

      {/* Tabla de usuarios */}
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-800 text-white">
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Nombre</th>
            <th className="p-2 border">Cédula</th>
            <th className="p-2 border">Fecha Nacimiento</th>
            <th className="p-2 border">Teléfono</th>
            <th className="p-2 border">Objetivo</th>
            <th className="p-2 border">ID Gimnasio</th>
            <th className="p-2 border">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((u) => (
            <tr key={u.idUsuario} className="text-center">
              <td className="border p-2">{u.idUsuario}</td>
              <td className="border p-2">{u.nombre}</td>
              <td className="border p-2">{u.cedula}</td>
              <td className="border p-2">{u.fechaNacimiento}</td>
              <td className="border p-2">{u.telefono}</td>
              <td className="border p-2">{u.objetivo}</td>
              <td className="border p-2">{u.idGimnasio}</td>
              <td className="border p-2">
                <button
                  onClick={() => handleEditar(u)}
                  className="bg-blue-600 text-white px-3 py-1 rounded mr-2 hover:bg-blue-700"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleEliminar(u.idUsuario)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-900 text-white p-6 rounded-lg w-1/2">
            <h3 className="text-xl font-semibold mb-4">
              {editando ? "Editar Usuario" : "Nuevo Usuario"}
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                value={editando?.nombre ?? ""}
                readOnly
                placeholder="Nombre"
                className="p-2 rounded bg-gray-800 w-full"
              />
              <input
                type="text"
                value={editando?.cedula ?? ""}
                readOnly
                placeholder="Cédula"
                className="p-2 rounded bg-gray-800 w-full"
              />
              <input
                type="date"
                value={editando?.fechaNacimiento ?? ""}
                readOnly
                className="p-2 rounded bg-gray-800 w-full"
              />
              <input
                type="text"
                value={editando?.telefono ?? ""}
                readOnly
                placeholder="Teléfono"
                className="p-2 rounded bg-gray-800 w-full"
              />
              <input
                type="text"
                value={editando?.objetivo ?? ""}
                readOnly
                placeholder="Objetivo"
                className="p-2 rounded bg-gray-800 w-full col-span-2"
              />
              <input
                type="number"
                value={editando?.idGimnasio ?? ""}
                readOnly
                placeholder="ID Gimnasio"
                className="p-2 rounded bg-gray-800 w-full col-span-2"
              />
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setOpen(false)}
                className="bg-gray-600 px-4 py-2 rounded mr-2 hover:bg-gray-700"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
