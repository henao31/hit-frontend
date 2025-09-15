import React, { useState, useMemo } from "react";

interface Movimiento {
  idMovimiento: number;
  tipo: "ingreso" | "egreso";
  monto: number;
  fecha: string;
  descripcion: string;
  responsable: number;
  idGimnasio: number;
}

export default function Caja() {
  const [dineroInicial] = useState<number>(500000); // Puedes cambiar el valor inicial
  const [movimientos, setMovimientos] = useState<Movimiento[]>([
    {
      idMovimiento: 1,
      tipo: "ingreso",
      monto: 150000,
      fecha: "2025-09-14",
      descripcion: "Pago mensualidad",
      responsable: 3,
      idGimnasio: 1,
    },
    {
      idMovimiento: 2,
      tipo: "egreso",
      monto: 50000,
      fecha: "2025-09-14",
      descripcion: "Compra de pesas",
      responsable: 2,
      idGimnasio: 1,
    },
  ]);

  const [editando, setEditando] = useState<Movimiento | null>(null);
  const [open, setOpen] = useState(false);

  // Calcular totales dinámicamente
  const { totalIngresos, totalEgresos, saldoActual } = useMemo(() => {
    const ingresos = movimientos
      .filter((m) => m.tipo === "ingreso")
      .reduce((acc, m) => acc + m.monto, 0);

    const egresos = movimientos
      .filter((m) => m.tipo === "egreso")
      .reduce((acc, m) => acc + m.monto, 0);

    return {
      totalIngresos: ingresos,
      totalEgresos: egresos,
      saldoActual: dineroInicial + ingresos - egresos,
    };
  }, [movimientos, dineroInicial]);

  const handleEditar = (mov: Movimiento) => {
    setEditando(mov);
    setOpen(true);
  };

  const handleEliminar = (id: number) => {
    if (confirm(`¿Eliminar movimiento con ID: ${id}?`)) {
      setMovimientos((prev) => prev.filter((m) => m.idMovimiento !== id));
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Caja</h2>

      {/* Tarjetas resumen */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-800 text-white p-4 rounded-lg shadow text-center">
          <h3 className="text-lg font-semibold">Dinero Inicial</h3>
          <p className="text-2xl font-bold text-yellow-400">
            ${dineroInicial.toLocaleString()}
          </p>
        </div>
        <div className="bg-gray-800 text-white p-4 rounded-lg shadow text-center">
          <h3 className="text-lg font-semibold">Ingresos</h3>
          <p className="text-2xl font-bold text-green-400">
            ${totalIngresos.toLocaleString()}
          </p>
        </div>
        <div className="bg-gray-800 text-white p-4 rounded-lg shadow text-center">
          <h3 className="text-lg font-semibold">Egresos</h3>
          <p className="text-2xl font-bold text-red-400">
            ${totalEgresos.toLocaleString()}
          </p>
        </div>
        <div className="bg-gray-900 text-white p-4 rounded-lg shadow text-center">
          <h3 className="text-lg font-semibold">Saldo Actual</h3>
          <p
            className={`text-2xl font-bold ${
              saldoActual >= 0 ? "text-cyan-400" : "text-red-500"
            }`}
          >
            ${saldoActual.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Botón nuevo movimiento */}
      <button
        onClick={() => {
          setEditando(null);
          setOpen(true);
        }}
        className="bg-cyan-600 text-white px-4 py-2 rounded mb-4 hover:bg-cyan-700"
      >
        + Nuevo Movimiento
      </button>

      {/* Tabla */}
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-800 text-white">
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Tipo</th>
            <th className="p-2 border">Monto</th>
            <th className="p-2 border">Fecha</th>
            <th className="p-2 border">Descripción</th>
            <th className="p-2 border">Responsable</th>
            <th className="p-2 border">ID Gimnasio</th>
            <th className="p-2 border">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {movimientos.map((m) => (
            <tr key={m.idMovimiento} className="text-center">
              <td className="border p-2">{m.idMovimiento}</td>
              <td
                className={`border p-2 font-bold ${
                  m.tipo === "ingreso" ? "text-green-500" : "text-red-500"
                }`}
              >
                {m.tipo}
              </td>
              <td className="border p-2">${m.monto.toLocaleString()}</td>
              <td className="border p-2">{m.fecha}</td>
              <td className="border p-2">{m.descripcion}</td>
              <td className="border p-2">{m.responsable}</td>
              <td className="border p-2">{m.idGimnasio}</td>
              <td className="border p-2">
                <button
                  onClick={() => handleEditar(m)}
                  className="bg-blue-600 text-white px-3 py-1 rounded mr-2 hover:bg-blue-700"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleEliminar(m.idMovimiento)}
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
              {editando ? "Editar Movimiento" : "Nuevo Movimiento"}
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <select
                value={editando?.tipo ?? ""}
                className="p-2 rounded bg-gray-800 w-full"
              >
                <option value="">Selecciona tipo</option>
                <option value="ingreso">Ingreso</option>
                <option value="egreso">Egreso</option>
              </select>
              <input
                type="number"
                value={editando?.monto ?? ""}
                readOnly
                placeholder="Monto"
                className="p-2 rounded bg-gray-800 w-full"
              />
              <input
                type="date"
                value={editando?.fecha ?? ""}
                readOnly
                className="p-2 rounded bg-gray-800 w-full"
              />
              <input
                type="number"
                value={editando?.responsable ?? ""}
                readOnly
                placeholder="Responsable"
                className="p-2 rounded bg-gray-800 w-full"
              />
              <input
                type="text"
                value={editando?.descripcion ?? ""}
                readOnly
                placeholder="Descripción"
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
                className="bg-gray-600 px-4 py-2 rounded hover:bg-gray-700"
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
