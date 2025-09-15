import React, { useState } from "react";

interface Membresia {
  tipo: string;
  precio: string;
  beneficios: string;
  fechaInicio: string;
  fechaFin: string;
}

export default function Membresias() {
  const [tab, setTab] = useState<
    "dia" | "semana" | "quincena" | "mes" | "tiquetera"
  >("dia");

  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<Membresia | null>(null);

  // Datos simulados
  const membresias: Record<string, Membresia> = {
    dia: {
      tipo: "Membresía por Día",
      precio: "$10.000",
      beneficios: "Acceso completo por un solo día.",
      fechaInicio: "2025-09-14",
      fechaFin: "2025-09-14",
    },
    semana: {
      tipo: "Membresía por Semana",
      precio: "$50.000",
      beneficios: "Acceso ilimitado por 7 días.",
      fechaInicio: "2025-09-14",
      fechaFin: "2025-09-21",
    },
    quincena: {
      tipo: "Membresía por Quincena",
      precio: "$80.000",
      beneficios: "Acceso ilimitado por 15 días.",
      fechaInicio: "2025-09-14",
      fechaFin: "2025-09-29",
    },
    mes: {
      tipo: "Membresía por Mes",
      precio: "$150.000",
      beneficios: "Acceso ilimitado por 30 días.",
      fechaInicio: "2025-09-14",
      fechaFin: "2025-10-14",
    },
    tiquetera: {
      tipo: "Membresía Tiquetera",
      precio: "$80.000 / 10 días",
      beneficios: "Compra un paquete de 10 días y úsalos cuando quieras.",
      fechaInicio: "2025-09-14",
      fechaFin: "2025-10-14",
    },
  };

  const handleOpen = (tipo: string) => {
    setSelected(membresias[tipo]);
    setModalOpen(true);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Membresías</h2>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {["dia", "semana", "quincena", "mes", "tiquetera"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t as any)}
            className={`px-4 py-2 rounded transition ${
              tab === t
                ? "bg-cyan-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Tarjeta */}
      <div
        onClick={() => handleOpen(tab)}
        className="cursor-pointer bg-gray-900 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition"
      >
        <h3 className="text-xl font-bold mb-2">{membresias[tab].tipo}</h3>
        <p className="text-gray-400">{membresias[tab].beneficios}</p>
        <p className="mt-2 font-semibold text-cyan-400">
          {membresias[tab].precio}
        </p>
      </div>

      {/* Modal */}
      {modalOpen && selected && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-gray-900 text-white p-6 rounded-xl w-96 shadow-lg">
            <h3 className="text-xl font-bold mb-4">{selected.tipo}</h3>
            <p>
              <span className="font-semibold">Precio:</span> {selected.precio}
            </p>
            <p>
              <span className="font-semibold">Beneficios:</span>{" "}
              {selected.beneficios}
            </p>
            <p>
              <span className="font-semibold">Inicio:</span>{" "}
              {selected.fechaInicio}
            </p>
            <p>
              <span className="font-semibold">Fin:</span> {selected.fechaFin}
            </p>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setModalOpen(false)}
                className="bg-cyan-600 px-4 py-2 rounded hover:bg-cyan-700"
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
