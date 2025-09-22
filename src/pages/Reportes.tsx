"use client";
import React, { useState, useMemo } from "react";
import { FaUsers, FaDollarSign, FaMoneyBillWave, FaClipboardList } from "react-icons/fa";

interface Movimiento {
  id: number;
  tipo: "ingreso" | "egreso";
  monto: number;
  fecha: string;
  descripcion: string;
}

export default function Reportes() {
  const [movimientos] = useState<Movimiento[]>([
    { id: 1, tipo: "ingreso", monto: 300000, fecha: "2025-09-01", descripcion: "Pago mensualidad" },
    { id: 2, tipo: "egreso", monto: 100000, fecha: "2025-09-05", descripcion: "Compra de mancuernas" },
    { id: 3, tipo: "ingreso", monto: 200000, fecha: "2025-09-10", descripcion: "Pago membresía personalizada" },
    { id: 4, tipo: "egreso", monto: 50000, fecha: "2025-09-12", descripcion: "Compra botellas de agua" },
  ]);

  const [filtroTipo, setFiltroTipo] = useState<"todos" | "ingreso" | "egreso">("todos");
  const [fechaInicio, setFechaInicio] = useState<string>("");
  const [fechaFin, setFechaFin] = useState<string>("");

  // Filtrar movimientos según filtros
  const movimientosFiltrados = useMemo(() => {
    return movimientos.filter((m) => {
      const cumpleTipo = filtroTipo === "todos" || m.tipo === filtroTipo;
      const cumpleFecha =
        (!fechaInicio || m.fecha >= fechaInicio) &&
        (!fechaFin || m.fecha <= fechaFin);
      return cumpleTipo && cumpleFecha;
    });
  }, [movimientos, filtroTipo, fechaInicio, fechaFin]);

  // Totales dinámicos según filtrado
  const { totalIngresos, totalEgresos, saldoActual } = useMemo(() => {
    const ingresos = movimientosFiltrados
      .filter((m) => m.tipo === "ingreso")
      .reduce((acc, m) => acc + m.monto, 0);

    const egresos = movimientosFiltrados
      .filter((m) => m.tipo === "egreso")
      .reduce((acc, m) => acc + m.monto, 0);

    return {
      totalIngresos: ingresos,
      totalEgresos: egresos,
      saldoActual: ingresos - egresos,
    };
  }, [movimientosFiltrados]);

  const handleExport = (tipo: string) => {
    alert(`Exportando reporte en formato ${tipo}...`);
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold mb-4 text-green-500">📊 Reportes</h2>

      {/* Filtros */}
      <div className="flex flex-wrap gap-4 mb-4 items-end">
        <div>
          <label className="block mb-1 font-semibold">Tipo</label>
          <select
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value as any)}
            className="p-2 rounded bg-gray-800 text-white w-full"
          >
            <option value="todos">Todos</option>
            <option value="ingreso">Ingresos</option>
            <option value="egreso">Egresos</option>
          </select>
        </div>
        <div>
          <label className="block mb-1 font-semibold">Fecha inicio</label>
          <input
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
            className="p-2 rounded bg-gray-800 text-white w-full"
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Fecha fin</label>
          <input
            type="date"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
            className="p-2 rounded bg-gray-800 text-white w-full"
          />
        </div>
      </div>

      {/* Tarjetas resumen */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-900 text-white rounded-lg shadow-md p-4 flex items-center gap-3">
          <FaUsers className="text-cyan-400 text-3xl" />
          <div>
            <h3 className="text-lg font-semibold">Movimientos Filtrados</h3>
            <p className="text-2xl font-bold">{movimientosFiltrados.length}</p>
          </div>
        </div>
        <div className="bg-gray-900 text-white rounded-lg shadow-md p-4 flex items-center gap-3">
          <FaDollarSign className="text-green-400 text-3xl" />
          <div>
            <h3 className="text-lg font-semibold">Ingresos</h3>
            <p className="text-2xl font-bold">${totalIngresos.toLocaleString()}</p>
          </div>
        </div>
        <div className="bg-gray-900 text-white rounded-lg shadow-md p-4 flex items-center gap-3">
          <FaMoneyBillWave className="text-red-500 text-3xl" />
          <div>
            <h3 className="text-lg font-semibold">Egresos</h3>
            <p className="text-2xl font-bold">${totalEgresos.toLocaleString()}</p>
          </div>
        </div>
        <div className="bg-gray-900 text-white rounded-lg shadow-md p-4 flex items-center gap-3">
          <FaClipboardList className="text-yellow-400 text-3xl" />
          <div>
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
      </div>

      {/* Botones de exportación */}
      <div className="flex gap-4">
        <button
          onClick={() => handleExport("PDF")}
          className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded transition"
        >
          Exportar PDF
        </button>
        <button
          onClick={() => handleExport("Excel")}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition"
        >
          Exportar Excel
        </button>
      </div>

      {/* Tabla de movimientos */}
      <div className="bg-gray-900 text-white rounded-lg shadow-md p-4 overflow-x-auto">
        <h3 className="text-lg font-semibold mb-4">Movimientos recientes</h3>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-800">
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Tipo</th>
              <th className="p-2 border">Monto</th>
              <th className="p-2 border">Fecha</th>
              <th className="p-2 border">Descripción</th>
            </tr>
          </thead>
          <tbody>
            {movimientosFiltrados.map((m) => (
              <tr key={m.id} className="text-center hover:bg-gray-700 transition">
                <td className="border p-2">{m.id}</td>
                <td
                  className={`border p-2 font-bold ${
                    m.tipo === "ingreso" ? "text-green-400" : "text-red-500"
                  }`}
                >
                  {m.tipo.charAt(0).toUpperCase() + m.tipo.slice(1)}
                </td>
                <td className="border p-2">${m.monto.toLocaleString()}</td>
                <td className="border p-2">{m.fecha}</td>
                <td className="border p-2">{m.descripcion}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
