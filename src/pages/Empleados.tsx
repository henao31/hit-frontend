import React, { useState } from "react";

interface Cargo {
  idCargo: number;
  nombre: string;
  descripcion: string;
}

interface Horario {
  dia: string;
  inicio: string;
  fin: string;
  activo?: boolean;
}

interface Empleado {
  idEmpleado: number;
  nombre: string;
  cedula: string;
  fechaNacimiento: string;
  correo: string;
  salario: number;
  horarios: Horario[];
  idCargo: number;
  idGimnasio: number;
}

export default function Empleados() {
  const [tab, setTab] = useState<"empleados" | "cargos" | "nomina">("empleados");
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<Empleado | null>(null);
  const [formData, setFormData] = useState<Empleado | null>(null);

  const diasSemana = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
  const cargos: Cargo[] = [
    { idCargo: 1, nombre: "Entrenador", descripcion: "Guiar a los clientes en rutinas" },
    { idCargo: 2, nombre: "Recepcionista", descripcion: "Atención al cliente y registros" },
  ];

  const [empleados, setEmpleados] = useState<Empleado[]>([
    {
      idEmpleado: 1,
      nombre: "Juan Pérez",
      cedula: "123456789",
      fechaNacimiento: "1990-05-14",
      correo: "juan@example.com",
      salario: 2000000,
      horarios: [
        { dia: "Lunes", inicio: "08:00", fin: "17:00", activo: true },
        { dia: "Martes", inicio: "08:00", fin: "17:00", activo: true },
        { dia: "Miércoles", inicio: "08:00", fin: "17:00", activo: true },
        { dia: "Jueves", inicio: "08:00", fin: "17:00", activo: true },
        { dia: "Viernes", inicio: "08:00", fin: "17:00", activo: true },
      ],
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
      horarios: [
        { dia: "Lunes", inicio: "09:00", fin: "18:00", activo: true },
        { dia: "Martes", inicio: "09:00", fin: "18:00", activo: true },
        { dia: "Miércoles", inicio: "09:00", fin: "18:00", activo: true },
        { dia: "Jueves", inicio: "09:00", fin: "18:00", activo: true },
        { dia: "Viernes", inicio: "09:00", fin: "18:00", activo: true },
        { dia: "Sábado", inicio: "09:00", fin: "14:00", activo: true },
      ],
      idCargo: 2,
      idGimnasio: 1,
    },
  ]);

  const handleOpenModal = (empleado?: Empleado) => {
    setSelected(empleado || null);
    if (empleado) {
      setFormData({ ...empleado });
    } else {
      setFormData({
        idEmpleado: Date.now(),
        nombre: "",
        cedula: "",
        fechaNacimiento: "",
        correo: "",
        salario: 0,
        horarios: diasSemana.map((d) => ({ dia: d, inicio: "08:00", fin: "17:00", activo: false })),
        idCargo: cargos[0].idCargo,
        idGimnasio: 1,
      });
    }
    setModalOpen(true);
  };

  const handleFormChange = (key: keyof Empleado, value: any) => {
    if (formData) setFormData({ ...formData, [key]: value });
  };

  const handleHorarioChange = (index: number, key: "inicio" | "fin", value: string) => {
    if (!formData) return;
    const nuevosHorarios = [...formData.horarios];
    nuevosHorarios[index][key] = value;
    setFormData({ ...formData, horarios: nuevosHorarios });
  };

  const handleSubmit = () => {
    if (!formData) return;

    if (selected) {
      setEmpleados(empleados.map((e) => (e.idEmpleado === formData.idEmpleado ? formData : e)));
    } else {
      setEmpleados([...empleados, formData]);
    }

    setModalOpen(false);
    setFormData(null);
    setSelected(null);
  };

  const renderHorarios = (horarios: Horario[]) => (
    <ul className="list-disc list-inside">
      {horarios
        .filter((h) => h.activo)
        .map((h, i) => (
          <li key={i}>
            {h.dia}: {h.inicio} - {h.fin}
          </li>
        ))}
    </ul>
  );

const renderTabla = () => {
  if (tab === "empleados") {
    return (
      <table className="w-full border border-gray-200 mt-4 rounded-lg overflow-hidden shadow-sm bg-white">
        <thead className="bg-green-500 text-white">
          <tr>
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Nombre</th>
            <th className="p-2 border">Cédula</th>
            <th className="p-2 border">Correo</th>
            <th className="p-2 border">Salario</th>
            <th className="p-2 border">Horarios</th>
            <th className="p-2 border">Cargo</th>
            <th className="p-2 border">Acciones</th>
          </tr>
        </thead>
        <tbody className="text-gray-700">
          {empleados.map((e) => (
            <tr key={e.idEmpleado} className="text-center hover:bg-gray-50 transition">
              <td className="border p-2">{e.idEmpleado}</td>
              <td className="border p-2">{e.nombre}</td>
              <td className="border p-2">{e.cedula}</td>
              <td className="border p-2">{e.correo}</td>
              <td className="border p-2 font-semibold text-green-600">
                ${e.salario.toLocaleString()}
              </td>
              <td className="border p-2 text-left">{renderHorarios(e.horarios)}</td>
              <td className="border p-2">{cargos.find((c) => c.idCargo === e.idCargo)?.nombre}</td>
              <td className="border p-2 flex justify-center gap-1">
                <button
                  onClick={() => handleOpenModal(e)}
                  className="bg-green-500 px-3 py-1 rounded text-white hover:bg-green-600 transition"
                >
                  Editar
                </button>
                <button
                  onClick={() => {
                    if (window.confirm(`¿Seguro que deseas eliminar a ${e.nombre}?`)) {
                      setEmpleados(empleados.filter(emp => emp.idEmpleado !== e.idEmpleado));
                    }
                  }}
                  className="bg-red-500 px-3 py-1 rounded text-white hover:bg-red-600 transition"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
};

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">Gestión de Empleados</h2>

      <div className="flex gap-2 mb-6 justify-center flex-wrap">
        {["empleados", "cargos", "nomina"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t as any)}
            className={`px-4 py-2 rounded-lg transition font-semibold ${
              tab === t
                ? "bg-green-500 text-white shadow"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-green-100"
            }`}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      <div className="flex justify-center mb-4">
        <button
          onClick={() => handleOpenModal()}
          className="bg-green-500 text-white px-5 py-2 rounded-lg hover:bg-green-600 shadow transition font-semibold"
        >
          + Nuevo Empleado
        </button>
      </div>

      {renderTabla()}

      {modalOpen && formData && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white text-gray-800 p-6 rounded-xl w-[650px] shadow-xl max-h-[90vh] overflow-auto">
            <h3 className="text-2xl font-bold mb-4 text-center">
              {selected ? "Editar Empleado" : "Nuevo Empleado"}
            </h3>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Nombre"
                value={formData.nombre}
                onChange={(e) => handleFormChange("nombre", e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />
              <input
                type="text"
                placeholder="Cédula"
                value={formData.cedula}
                onChange={(e) => handleFormChange("cedula", e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />
              <input
                type="email"
                placeholder="Correo"
                value={formData.correo}
                onChange={(e) => handleFormChange("correo", e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />
              <input
                type="number"
                placeholder="Salario"
                value={formData.salario}
                onChange={(e) => handleFormChange("salario", Number(e.target.value))}
                className="w-full px-3 py-2 border rounded-lg"
              />
              <select
                value={formData.idCargo}
                onChange={(e) => handleFormChange("idCargo", Number(e.target.value))}
                className="w-full px-3 py-2 border rounded-lg"
              >
                {cargos.map((c) => (
                  <option key={c.idCargo} value={c.idCargo}>
                    {c.nombre}
                  </option>
                ))}
              </select>

              <div>
                <h4 className="font-semibold mb-2">Horarios (Selecciona los días)</h4>
                {formData.horarios.map((h, idx) => (
                  <div key={idx} className="flex flex-wrap items-center gap-3 mb-2">
                    <label className="flex items-center gap-1 w-28">
                      <input
                        type="checkbox"
                        checked={h.activo ?? false}
                        onChange={(e) => {
                          const nuevosHorarios = [...formData.horarios];
                          nuevosHorarios[idx].activo = e.target.checked;
                          setFormData({ ...formData, horarios: nuevosHorarios });
                        }}
                        className="accent-green-500"
                      />
                      {h.dia}
                    </label>

                    {h.activo && (
                      <>
                        <input
                          type="time"
                          value={h.inicio}
                          onChange={(e) => handleHorarioChange(idx, "inicio", e.target.value)}
                          className="px-3 py-1 border rounded-lg w-24"
                        />
                        <span>-</span>
                        <input
                          type="time"
                          value={h.fin}
                          onChange={(e) => handleHorarioChange(idx, "fin", e.target.value)}
                          className="px-3 py-1 border rounded-lg w-24"
                        />
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => {
                  setModalOpen(false);
                  setFormData(null);
                  setSelected(null);
                }}
                className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                className="bg-green-500 px-4 py-2 rounded-lg text-white hover:bg-green-600 transition"
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
