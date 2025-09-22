"use client";
import React, { useState } from "react";
import { FaCreditCard } from "react-icons/fa";

interface Membresia {
  tipo: string;
  precio: number;
  beneficios: string;
  fechaInicio: string;
  fechaFin: string;
  imagen: string;
}

export default function Membresias() {
  const [tab, setTab] = useState<"dia" | "semana" | "quincena" | "mes" | "tiquetera">("dia");
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<Membresia | null>(null);

  const [membresias, setMembresias] = useState<Record<string, Membresia>>({
    dia: {
      tipo: "Membresía por Día",
      precio: 10000,
      beneficios: "Acceso completo por un solo día.",
      fechaInicio: "2025-09-14",
      fechaFin: "2025-09-14",
      imagen: "", // dejamos vacío para probar fallback
    },
    semana: {
      tipo: "Membresía por Semana",
      precio: 50000,
      beneficios: "Acceso ilimitado por 7 días.",
      fechaInicio: "2025-09-14",
      fechaFin: "2025-09-21",
      imagen: "",
    },
    quincena: {
      tipo: "Membresía por Quincena",
      precio: 80000,
      beneficios: "Acceso ilimitado por 15 días.",
      fechaInicio: "2025-09-14",
      fechaFin: "2025-09-29",
      imagen: "",
    },
    mes: {
      tipo: "Membresía por Mes",
      precio: 150000,
      beneficios: "Acceso ilimitado por 30 días.",
      fechaInicio: "2025-09-14",
      fechaFin: "2025-10-14",
      imagen: "",
    },
    tiquetera: {
      tipo: "Membresía Tiquetera",
      precio: 80000,
      beneficios: "Compra un paquete de 10 días y úsalos cuando quieras.",
      fechaInicio: "2025-09-14",
      fechaFin: "2025-10-14",
      imagen: "",
    },
  });

  const formatDate = (fecha: string) =>
    new Date(fecha).toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" });

  const handleOpenModal = (tipo: string, edit = false) => {
    setTab(tipo as any);
    setEditMode(edit);
    setFormData(edit ? { ...membresias[tipo] } : null);
    setModalOpen(true);
  };

  const handleFormChange = (key: keyof Membresia, value: any) => {
    if (!formData) return;
    setFormData({ ...formData, [key]: value });
  };

  const handleSave = () => {
    if (!formData) return;
    setMembresias({ ...membresias, [tab]: formData });
    setModalOpen(false);
    setEditMode(false);
    setFormData(null);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">Membresías</h2>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap justify-center">
        {Object.keys(membresias).map((key) => (
          <button
            key={key}
            onClick={() => setTab(key as any)}
            className={`px-4 py-2 rounded-lg transition font-semibold ${
              tab === key
                ? "bg-green-500 text-white shadow-lg"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-green-100"
            }`}
          >
            {membresias[key].tipo}
          </button>
        ))}
      </div>

      {/* Tarjeta */}
      <div
        onClick={() => handleOpenModal(tab)}
        className="cursor-pointer bg-white rounded-xl shadow-lg hover:shadow-2xl transition max-w-md mx-auto p-6 flex flex-col items-center gap-4"
      >
        <div className="w-24 h-24 rounded-full border p-1 border-gray-200 flex items-center justify-center bg-gray-100 relative">
          {membresias[tab].imagen ? (
            <img
              src={membresias[tab].imagen}
              alt={membresias[tab].tipo}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <FaCreditCard className="text-gray-400 text-3xl" />
          )}
        </div>
        <h3 className="text-2xl font-bold text-center text-gray-800">{membresias[tab].tipo}</h3>
        <p className="text-gray-600 text-center">{membresias[tab].beneficios}</p>
        <p className="mt-2 font-bold text-green-500 text-lg">${membresias[tab].precio.toLocaleString()}</p>
        <p className="mt-1 text-gray-500 text-center">
          {formatDate(membresias[tab].fechaInicio)} - {formatDate(membresias[tab].fechaFin)}
        </p>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white text-gray-800 p-6 rounded-xl w-full max-w-md shadow-xl overflow-auto">
            {editMode ? (
              <>
                <h3 className="text-2xl font-bold mb-4 text-center">Editar Membresía</h3>
                <div className="flex flex-col gap-3">
                  <input
                    type="text"
                    placeholder="Tipo"
                    value={formData?.tipo}
                    onChange={(e) => handleFormChange("tipo", e.target.value)}
                    className="w-full px-3 py-2 border rounded"
                  />
                  <input
                    type="number"
                    placeholder="Precio"
                    value={formData?.precio}
                    onChange={(e) => handleFormChange("precio", Number(e.target.value))}
                    className="w-full px-3 py-2 border rounded"
                  />
                  <textarea
                    placeholder="Beneficios"
                    value={formData?.beneficios}
                    onChange={(e) => handleFormChange("beneficios", e.target.value)}
                    className="w-full px-3 py-2 border rounded"
                  />
                  <input
                    type="date"
                    value={formData?.fechaInicio}
                    onChange={(e) => handleFormChange("fechaInicio", e.target.value)}
                    className="w-full px-3 py-2 border rounded"
                  />
                  <input
                    type="date"
                    value={formData?.fechaFin}
                    onChange={(e) => handleFormChange("fechaFin", e.target.value)}
                    className="w-full px-3 py-2 border rounded"
                  />
                  <input
                    type="text"
                    placeholder="URL de imagen"
                    value={formData?.imagen}
                    onChange={(e) => handleFormChange("imagen", e.target.value)}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                <div className="flex justify-center mt-6 gap-2">
                  <button
                    onClick={() => { setModalOpen(false); setEditMode(false); setFormData(null); }}
                    className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSave}
                    className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
                  >
                    Guardar
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="w-32 h-32 mx-auto mb-4 rounded-full border border-gray-200 flex items-center justify-center bg-gray-100 relative">
                  {membresias[tab].imagen ? (
                    <img
                      src={membresias[tab].imagen}
                      alt={membresias[tab].tipo}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <FaCreditCard className="text-gray-400 text-5xl" />
                  )}
                </div>
                <h3 className="text-2xl font-bold mb-2 text-center">{membresias[tab].tipo}</h3>
                <p className="text-gray-600 mb-2 text-center">{membresias[tab].beneficios}</p>
                <p className="text-green-500 font-bold text-center mb-1">
                  Precio: ${membresias[tab].precio.toLocaleString()}
                </p>
                <p className="text-gray-500 text-center">
                  {formatDate(membresias[tab].fechaInicio)} - {formatDate(membresias[tab].fechaFin)}
                </p>
                <div className="flex justify-center mt-6 gap-2">
                  <button
                    onClick={() => setModalOpen(false)}
                    className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
                  >
                    Cerrar
                  </button>
                  <button
                    onClick={() => handleOpenModal(tab, true)}
                    className="bg-yellow-500 text-white px-6 py-2 rounded hover:bg-yellow-600"
                  >
                    Editar
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
