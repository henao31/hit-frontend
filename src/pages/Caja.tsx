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
  const [dineroInicial] = useState<number>(500000);
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
  const [formData, setFormData] = useState<Movimiento>({
    idMovimiento: 0,
    tipo: "ingreso",
    monto: 0,
    fecha: new Date().toISOString().split("T")[0],
    descripcion: "",
    responsable: 0,
    idGimnasio: 1,
  });

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
    setFormData(mov);
    setOpen(true);
  };

  const handleEliminar = (id: number) => {
    if (window.confirm(`¿Eliminar movimiento con ID: ${id}?`)) {
      setMovimientos((prev) => prev.filter((m) => m.idMovimiento !== id));
    }
  };

  const handleGuardar = () => {
    if (formData.tipo === "egreso" && formData.monto > saldoActual) {
      alert("El egreso no puede ser mayor al saldo actual");
      return;
    }

    if (editando) {
      setMovimientos((prev) =>
        prev.map((m) => (m.idMovimiento === formData.idMovimiento ? formData : m))
      );
    } else {
      setMovimientos([
        ...movimientos,
        { ...formData, idMovimiento: Date.now() },
      ]);
    }
    setOpen(false);
    setEditando(null);
    setFormData({
      idMovimiento: 0,
      tipo: "ingreso",
      monto: 0,
      fecha: new Date().toISOString().split("T")[0],
      descripcion: "",
      responsable: 0,
      idGimnasio: 1,
    });
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">Caja</h2>

      {/* Resumen */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white text-gray-800 p-4 rounded-lg shadow text-center border border-gray-200">
          <h3 className="text-lg font-semibold">Dinero Inicial</h3>
          <p className="text-2xl font-bold text-yellow-600">
            ${dineroInicial.toLocaleString()}
          </p>
        </div>
        <div className="bg-white text-gray-800 p-4 rounded-lg shadow text-center border border-gray-200">
          <h3 className="text-lg font-semibold">Ingresos</h3>
          <p className="text-2xl font-bold text-green-600">
            ${totalIngresos.toLocaleString()}
          </p>
        </div>
        <div className="bg-white text-gray-800 p-4 rounded-lg shadow text-center border border-gray-200">
          <h3 className="text-lg font-semibold">Egresos</h3>
          <p className="text-2xl font-bold text-red-600">
            ${totalEgresos.toLocaleString()}
          </p>
        </div>
        <div className="bg-white text-gray-800 p-4 rounded-lg shadow text-center border border-gray-200">
          <h3 className="text-lg font-semibold">Saldo Actual</h3>
          <p
            className={`text-2xl font-bold ${
              saldoActual >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            ${saldoActual.toLocaleString()}
          </p>
        </div>
      </div>

      <button
        onClick={() => {
          setEditando(null);
          setFormData({
            idMovimiento: 0,
            tipo: "ingreso",
            monto: 0,
            fecha: new Date().toISOString().split("T")[0],
            descripcion: "",
            responsable: 0,
            idGimnasio: 1,
          });
          setOpen(true);
        }}
        className="bg-cyan-600 text-white px-4 py-2 rounded mb-4 hover:bg-cyan-700 transition"
      >
        + Nuevo Movimiento
      </button>

      {/* Tabla */}
      <table className="w-full border-collapse bg-white shadow rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-cyan-600 text-white">
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
            <tr
              key={m.idMovimiento}
              className="text-center hover:bg-gray-50 transition"
            >
              <td className="border p-2">{m.idMovimiento}</td>
              <td
                className={`border p-2 font-bold ${
                  m.tipo === "ingreso" ? "text-green-600" : "text-red-600"
                }`}
              >
                {m.tipo}
              </td>
              <td className="border p-2">${m.monto.toLocaleString()}</td>
              <td className="border p-2">{m.fecha}</td>
              <td className="border p-2">{m.descripcion}</td>
              <td className="border p-2">{m.responsable}</td>
              <td className="border p-2">{m.idGimnasio}</td>
              <td className="border p-2 flex justify-center gap-2">
                <button
                  onClick={() => handleEditar(m)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleEliminar(m.idMovimiento)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
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
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white text-gray-800 p-6 rounded-xl w-1/2 shadow-xl max-h-[90vh] overflow-auto">
            <h3 className="text-xl font-semibold mb-4 text-cyan-600">
              {editando ? "Editar Movimiento" : "Nuevo Movimiento"}
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <select
                value={formData.tipo}
                onChange={(e) =>
                  setFormData({ ...formData, tipo: e.target.value as "ingreso" | "egreso" })
                }
                className="p-2 rounded border border-gray-300 focus:ring-2 focus:ring-cyan-500 w-full"
              >
                <option value="ingreso">Ingreso</option>
                <option value="egreso">Egreso</option>
              </select>
              <input
                type="number"
                value={formData.monto}
                onChange={(e) =>
                  setFormData({ ...formData, monto: Number(e.target.value) })
                }
                placeholder="Monto"
                className="p-2 rounded border border-gray-300 focus:ring-2 focus:ring-cyan-500 w-full"
              />
              <input
                type="date"
                value={formData.fecha}
                onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                className="p-2 rounded border border-gray-300 focus:ring-2 focus:ring-cyan-500 w-full"
              />
              <input
                type="number"
                value={formData.responsable}
                onChange={(e) =>
                  setFormData({ ...formData, responsable: Number(e.target.value) })
                }
                placeholder="Responsable"
                className="p-2 rounded border border-gray-300 focus:ring-2 focus:ring-cyan-500 w-full"
              />
              <input
                type="text"
                value={formData.descripcion}
                onChange={(e) =>
                  setFormData({ ...formData, descripcion: e.target.value })
                }
                placeholder="Descripción"
                className="p-2 rounded border border-gray-300 focus:ring-2 focus:ring-cyan-500 w-full col-span-2"
              />
              <input
                type="number"
                value={formData.idGimnasio}
                onChange={(e) =>
                  setFormData({ ...formData, idGimnasio: Number(e.target.value) })
                }
                placeholder="ID Gimnasio"
                className="p-2 rounded border border-gray-300 focus:ring-2 focus:ring-cyan-500 w-full col-span-2"
              />
            </div>

            <div className="flex justify-end mt-6 gap-2">
              <button
                onClick={() => setOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
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
