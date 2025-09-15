import React, { useState } from "react";

interface Cargo {
  idCargo: number;
  nombre: string;
  descripcion: string;
}

interface Empleado {
  idEmpleado: number;
  nombre: string;
  cedula: string;
  fechaNacimiento: string;
  correo: string;
  salario: number;
  horario: string;
  idCargo: number;
  idGimnasio: number;
}

interface Nomina {
  idNomina: number;
  idEmpleado: number;
  periodo: string;
  salarioBase: number;
  horasExtra: number;
  deducciones: number;
  total: number;
  idGimnasio: number;
}

export default function Empleados() {
  const [tab, setTab] = useState<"empleados" | "cargos" | "nomina">("empleados");
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<any>(null);

  // Datos simulados
  const cargos: Cargo[] = [
    { idCargo: 1, nombre: "Entrenador", descripcion: "Guiar a los clientes en rutinas" },
    { idCargo: 2, nombre: "Recepcionista", descripcion: "Atención al cliente y registros" },
  ];

  const empleados: Empleado[] = [
    {
      idEmpleado: 1,
      nombre: "Juan Pérez",
      cedula: "123456789",
      fechaNacimiento: "1990-05-14",
      correo: "juan@example.com",
      salario: 2000000,
      horario: "Lunes a Viernes 8-5",
      idCargo: 1,
      idGimnasio: 1,
    },
    {
      idEmpleado: 2,
      nombre: "María Gómez",
      cedula: "987654321",
      fechaNacimiento: "1995-07-22",
      correo: "maria@example.com",
      salario: 1800000,
      horario: "Lunes a Sábado 9-6",
      idCargo: 2,
      idGimnasio: 1,
    },
  ];

  const nomina: Nomina[] = [
    {
      idNomina: 1,
      idEmpleado: 1,
      periodo: "2025-09-01",
      salarioBase: 2000000,
      horasExtra: 10,
      deducciones: 150000,
      total: 2100000,
      idGimnasio: 1,
    },
    {
      idNomina: 2,
      idEmpleado: 2,
      periodo: "2025-09-01",
      salarioBase: 1800000,
      horasExtra: 5,
      deducciones: 100000,
      total: 1850000,
      idGimnasio: 1,
    },
  ];

  // Renderizar tabla según tab
  const renderTabla = () => {
    if (tab === "empleados") {
      return (
        <table className="w-full border-collapse mt-4">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Nombre</th>
              <th className="p-2 border">Cédula</th>
              <th className="p-2 border">Correo</th>
              <th className="p-2 border">Salario</th>
              <th className="p-2 border">Horario</th>
              <th className="p-2 border">Cargo</th>
              <th className="p-2 border">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {empleados.map((e) => (
              <tr key={e.idEmpleado} className="text-center">
                <td className="border p-2">{e.idEmpleado}</td>
                <td className="border p-2">{e.nombre}</td>
                <td className="border p-2">{e.cedula}</td>
                <td className="border p-2">{e.correo}</td>
                <td className="border p-2">${e.salario.toLocaleString()}</td>
                <td className="border p-2">{e.horario}</td>
                <td className="border p-2">
                  {cargos.find((c) => c.idCargo === e.idCargo)?.nombre}
                </td>
                <td className="border p-2">
                  <button
                    onClick={() => {
                      setSelected(e);
                      setModalOpen(true);
                    }}
                    className="bg-blue-600 px-3 py-1 rounded text-white hover:bg-blue-700"
                  >
                    Ver
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    if (tab === "cargos") {
      return (
        <table className="w-full border-collapse mt-4">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Nombre</th>
              <th className="p-2 border">Descripción</th>
            </tr>
          </thead>
          <tbody>
            {cargos.map((c) => (
              <tr key={c.idCargo} className="text-center">
                <td className="border p-2">{c.idCargo}</td>
                <td className="border p-2">{c.nombre}</td>
                <td className="border p-2">{c.descripcion}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    if (tab === "nomina") {
      return (
        <table className="w-full border-collapse mt-4">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="p-2 border">ID Nómina</th>
              <th className="p-2 border">Empleado</th>
              <th className="p-2 border">Periodo</th>
              <th className="p-2 border">Salario Base</th>
              <th className="p-2 border">Horas Extra</th>
              <th className="p-2 border">Deducciones</th>
              <th className="p-2 border">Total</th>
            </tr>
          </thead>
          <tbody>
            {nomina.map((n) => (
              <tr key={n.idNomina} className="text-center">
                <td className="border p-2">{n.idNomina}</td>
                <td className="border p-2">
                  {empleados.find((e) => e.idEmpleado === n.idEmpleado)?.nombre}
                </td>
                <td className="border p-2">{n.periodo}</td>
                <td className="border p-2">${n.salarioBase.toLocaleString()}</td>
                <td className="border p-2">{n.horasExtra}</td>
                <td className="border p-2">${n.deducciones.toLocaleString()}</td>
                <td className="border p-2 font-bold text-cyan-400">
                  ${n.total.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Gestión de Empleados</h2>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {["empleados", "cargos", "nomina"].map((t) => (
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

      {/* Botón nuevo */}
      <button
        onClick={() => {
          setSelected(null);
          setModalOpen(true);
        }}
        className="bg-cyan-600 text-white px-4 py-2 rounded mb-4 hover:bg-cyan-700"
      >
        + Nuevo {tab === "empleados" ? "Empleado" : tab === "cargos" ? "Cargo" : "Registro Nómina"}
      </button>

      {/* Tabla */}
      {renderTabla()}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-gray-900 text-white p-6 rounded-xl w-96 shadow-lg">
            <h3 className="text-xl font-bold mb-4">
              {selected
                ? `Detalle ${tab.slice(0, 1).toUpperCase() + tab.slice(1)}`
                : `Nuevo ${tab.slice(0, 1).toUpperCase() + tab.slice(1)}`}
            </h3>

            {selected ? (
              <div className="space-y-2">
                {Object.entries(selected).map(([k, v]) => (
                  <p key={k}>
                    <span className="font-semibold">{k}: </span> {String(v)}
                  </p>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">
                Aquí irá el formulario para crear un nuevo {tab}.
              </p>
            )}

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
