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
  fecha_inicio_membresia?: string;
}

interface Membresia {
  id: string;
  nombre: string;
  requiereEntrenador: boolean;
  dias?: number;
  tiquetes?: number;
}

interface Entrenador {
  id: string;
  nombre: string;
}

interface Entrada {
  id_usuario: number;
  fechaISO: string;
  fecha: string;
  hora: string;
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

  const [entradas, setEntradas] = useState<Entrada[]>([]);
  const [openEntrada, setOpenEntrada] = useState(false);
  const [usuarioEntrada, setUsuarioEntrada] = useState<Usuario | null>(null);

  const [openCedulaModal, setOpenCedulaModal] = useState(false);
  const [cedulaSearch, setCedulaSearch] = useState("");
  const [cedulaFoundUser, setCedulaFoundUser] = useState<Usuario | null>(null);
  const [cedulaMessage, setCedulaMessage] = useState<string | null>(null);

  const membresias: Membresia[] = [
    { id: "dia", nombre: "Uso de Máquinas (Día)", requiereEntrenador: false, dias: 1 },
    { id: "semana", nombre: "Membresía Semana", requiereEntrenador: true, dias: 7 },
    { id: "quincena", nombre: "Membresía Quincena", requiereEntrenador: true, dias: 15 },
    { id: "mes", nombre: "Membresía Mes", requiereEntrenador: true, dias: 30 },
    { id: "tiquetera", nombre: "Tiquetera 10 Días", requiereEntrenador: false, tiquetes: 10 },
  ];

  const entrenadores: Entrenador[] = [{ id: "e1", nombre: "María Gómez" }];

  const msPerDay = 24 * 60 * 60 * 1000;

  // NUEVO: Verifica si el usuario ya registró entrada hoy
  const usuarioRegistroHoy = (usuario: Usuario) => {
    const hoy = new Date();
    const hoyStr = hoy.toLocaleDateString();
    return entradas.some(
      (e) => e.id_usuario === usuario.id_usuario && e.fecha === hoyStr
    );
  };

  // Modificado: ahora incluye validación de entrada hoy
  const canRegisterEntry = (usuario: Usuario): { ok: boolean; message?: string } => {
    if (usuarioRegistroHoy(usuario)) {
      return { ok: false, message: "Ya registró entrada hoy" };
    }
    const m = membresias.find((mm) => mm.id === usuario.membresia);
    if (!m) return { ok: false, message: "Membresía no encontrada" };

    const entradasUsuario = entradas.filter((e) => e.id_usuario === usuario.id_usuario);

    if (m.tiquetes) {
      const restantes = m.tiquetes - entradasUsuario.length;
      if (restantes <= 0) return { ok: false, message: "La tiquetera no tiene pases disponibles" };
      return { ok: true };
    }

    if (m.dias) {
      const inicioISO = usuario.fecha_inicio_membresia ?? entradasUsuario[0]?.fechaISO;
      if (!inicioISO) return { ok: true }; // aún no inicia => permitir primera entrada

      const diffDays = calcularDiffDays(inicioISO);
      const diasIncluyendoHoy = m.dias - diffDays;
      if (diasIncluyendoHoy <= 0) return { ok: false, message: "La membresía ha expirado" };
      return { ok: true };
    }

    return { ok: true };
  };

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

  // utilidad: diferencia en días completos entre fecha inicio y hoy (entero >= 0)
  const calcularDiffDays = (inicioISO: string) => {
    const inicio = new Date(inicioISO);
    const hoy = new Date();
    const startUTC = Date.UTC(inicio.getFullYear(), inicio.getMonth(), inicio.getDate());
    const todayUTC = Date.UTC(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
    return Math.floor((todayUTC - startUTC) / msPerDay);
  };

  // Estado de la membresía (para mostrar): mostramos "días completos que quedan después de hoy"
  const obtenerEstadoMembresia = (usuario: Usuario): string => {
    const m = membresias.find((mm) => mm.id === usuario.membresia);
    if (!m) return "-";

    const entradasUsuario = entradas.filter((e) => e.id_usuario === usuario.id_usuario);

    // Tiquetera
    if (m.tiquetes) {
      const restantes = m.tiquetes - entradasUsuario.length;
      return `Tiquetes restantes: ${restantes >= 0 ? restantes : 0}`;
    }

    // Membresía por días
    if (m.dias) {
      const inicioISO = usuario.fecha_inicio_membresia ?? entradasUsuario[0]?.fechaISO;
      if (!inicioISO) return `Días restantes: ${m.dias}`; // aún no inicia

      const diffDays = calcularDiffDays(inicioISO);
      // días incluyendo hoy (ej: si diffDays=0 y m.dias=30 -> 30 días incluyendo hoy)
      const diasIncluyendoHoy = m.dias - diffDays;
      // Para mostrar "días completos que quedan después de hoy", restamos 1 (si hay al menos 1)
      const diasExcluyendoHoy = diasIncluyendoHoy > 0 ? diasIncluyendoHoy - 1 : 0;
      return `Días restantes: ${diasExcluyendoHoy > 0 ? diasExcluyendoHoy : 0}`;
    }

    return "-";
  };

  // Registra la entrada para un usuario (centralizado) - la mantenemos porque se usa desde 'Registrar por cédula'
  const registrarEntradaForUsuario = (usuario: Usuario): { ok: boolean; message?: string } => {
    const can = canRegisterEntry(usuario);
    if (!can.ok) return can;

    const now = new Date();
    const entrada: Entrada = {
      id_usuario: usuario.id_usuario!,
      fechaISO: now.toISOString(),
      fecha: now.toLocaleDateString(),
      hora: now.toLocaleTimeString(),
    };

    // Si la membresía tiene días y no tiene fecha de inicio la fijamos ahora (actualiza la lista 'usuarios')
    const m = membresias.find((mm) => mm.id === usuario.membresia);
    if (m?.dias && !usuario.fecha_inicio_membresia) {
      setUsuarios((prev) =>
        prev.map((u) =>
          u.id_usuario === usuario.id_usuario ? { ...u, fecha_inicio_membresia: now.toISOString() } : u
        )
      );
    }

    setEntradas((prev) => [...prev, entrada]);
    return { ok: true };
  };

  const handleRegistrarEntrada = (usuario: Usuario) => {
    setUsuarioEntrada(usuario);
    setOpenEntrada(true);
  };

  // ---- FIX: handler del modal "Registrar Ahora" corregido ----
  const handleRegistrarAhoraDesdeModal = () => {
    if (!usuarioEntrada) return;

    // 1) validar
    const can = canRegisterEntry(usuarioEntrada);
    if (!can.ok) {
      alert(can.message || "No se puede registrar la entrada");
      return;
    }

    // 2) construir entrada
    const now = new Date();
    const entrada: Entrada = {
      id_usuario: usuarioEntrada.id_usuario!,
      fechaISO: now.toISOString(),
      fecha: now.toLocaleDateString(),
      hora: now.toLocaleTimeString(),
    };

    // 3) si la membresía es por días y el usuario no tiene fecha de inicio, fijarla
    const m = membresias.find((mm) => mm.id === usuarioEntrada.membresia);
    if (m?.dias && !usuarioEntrada.fecha_inicio_membresia) {
      // actualizar el array global de usuarios (persistir fecha de inicio)
      setUsuarios((prev) =>
        prev.map((u) =>
          u.id_usuario === usuarioEntrada.id_usuario ? { ...u, fecha_inicio_membresia: now.toISOString() } : u
        )
      );
      // actualizar el usuario local del modal para que la UI del modal se refresque inmediatamente
      setUsuarioEntrada((prev) => (prev ? { ...prev, fecha_inicio_membresia: now.toISOString() } : prev));
    }

    // 4) agregar la entrada al historial
    setEntradas((prev) => [...prev, entrada]);

    alert("Entrada registrada correctamente");
  };

  const buscarPorCedula = () => {
    setCedulaMessage(null);
    setCedulaFoundUser(null);
    const ced = cedulaSearch.trim();
    if (!ced) {
      setCedulaMessage("Ingresa una cédula");
      return;
    }
    const found = usuarios.find((u) => u.cedula.trim() === ced);
    if (!found) {
      setCedulaMessage("Usuario no encontrado");
      return;
    }
    setCedulaFoundUser(found);
  };

  const handleRegistrarPorCedula = () => {
    if (!cedulaFoundUser) return;
    const res = registrarEntradaForUsuario(cedulaFoundUser);
    if (!res.ok) {
      alert(res.message || "No se puede registrar la entrada");
      return;
    }
    alert(`Entrada registrada para ${cedulaFoundUser.nombre}`);
    setCedulaSearch("");
    setCedulaFoundUser(null);
    setCedulaMessage(null);
    setOpenCedulaModal(false);
  };

  const membresiaSeleccionada = membresias.find((m) => m.id === formData.membresia);

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">Usuarios</h2>

      <div className="flex gap-2 mb-4">
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
          className="bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-700 transition"
        >
          + Nuevo Usuario
        </button>

        <button
          onClick={() => {
            setCedulaSearch("");
            setCedulaFoundUser(null);
            setCedulaMessage(null);
            setOpenCedulaModal(true);
          }}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          Registrar entrada por Cédula
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg shadow-md">
        <table className="w-full border-collapse bg-white rounded-lg overflow-hidden">
          <thead className="bg-cyan-600 text-white">
            <tr>
              <th className="p-2 border">Nombre</th>
              <th className="p-2 border">Cédula</th>
              <th className="p-2 border">Membresía</th>
              <th className="p-2 border">Entrenador</th>
              <th className="p-2 border">Estado Membresía</th>
              <th className="p-2 border">Acciones</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {usuarios.map((u) => {
              const canEntry = canRegisterEntry(u);
              return (
                <tr key={u.id_usuario} className="text-center hover:bg-gray-100 transition">
                  <td className="border p-2">{u.nombre}</td>
                  <td className="border p-2">{u.cedula}</td>
                  <td className="border p-2">{u.membresia}</td>
                  <td className="border p-2">{u.entrenador || "-"}</td>
                  <td className="border p-2">{obtenerEstadoMembresia(u)}</td>
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
                    <button
                      onClick={() => handleRegistrarEntrada(u)}
                      className={`bg-green-500 px-3 py-1 rounded text-white transition ${!canEntry.ok ? "opacity-50 cursor-not-allowed" : "hover:bg-green-600"}`}
                      disabled={!canEntry.ok}
                      title={!canEntry.ok ? canEntry.message : ""}
                    >
                      Registrar Entrada
                    </button>
                  </td>
                </tr>
              );
            })}
            {usuarios.length === 0 && (
              <tr>
                <td colSpan={7} className="p-4 text-gray-500 text-center">
                  No hay usuarios registrados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {openEntrada && usuarioEntrada && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white text-gray-800 p-6 rounded-xl w-1/2 shadow-xl max-h-[90vh] overflow-auto">
            <h3 className="text-xl font-semibold mb-4 text-cyan-600">
              Registrar Entrada - {usuarioEntrada.nombre}
            </h3>

            <p className="mb-4">{obtenerEstadoMembresia(usuarioEntrada)}</p>

            {/* Mensaje si ya registró hoy */}
            {!canRegisterEntry(usuarioEntrada).ok && canRegisterEntry(usuarioEntrada).message === "Ya registró entrada hoy" ? (
              <div className="mb-4 text-red-600 font-semibold">
                Ya registró entrada hoy.
              </div>
            ) : null}

            <button
              onClick={handleRegistrarAhoraDesdeModal}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
              disabled={!canRegisterEntry(usuarioEntrada).ok}
            >
              Registrar entrada
            </button>

            <div className="mt-4">
              <h4 className="font-semibold">Historial de Entradas:</h4>
              <ul className="list-disc ml-6">
                {entradas
                  .filter((e) => e.id_usuario === usuarioEntrada.id_usuario)
                  .map((e, i) => (
                    <li key={i}>
                      {e.fecha} - {e.hora}
                    </li>
                  ))}
              </ul>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setOpenEntrada(false)}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {openCedulaModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white text-gray-800 p-6 rounded-xl w-96 shadow-xl max-h-[90vh] overflow-auto">
            <h3 className="text-xl font-semibold mb-4 text-cyan-600">Registrar por Cédula</h3>

            <input
              type="text"
              placeholder="Cédula"
              value={cedulaSearch}
              onChange={(e) => setCedulaSearch(e.target.value)}
              className="w-full p-2 rounded border border-gray-300 mb-2"
            />

            <div className="flex gap-2">
              <button
                onClick={buscarPorCedula}
                className="bg-cyan-600 text-white px-3 py-1 rounded hover:bg-cyan-700 transition"
              >
                Buscar
              </button>
              <button
                onClick={() => setOpenCedulaModal(false)}
                className="bg-gray-300 text-gray-800 px-3 py-1 rounded hover:bg-gray-400 transition"
              >
                Cancelar
              </button>
            </div>

            {cedulaMessage && <p className="mt-3 text-sm text-red-600">{cedulaMessage}</p>}

            {cedulaFoundUser && (
              <div className="mt-4 border-t pt-3">
                <p>
                  <strong>{cedulaFoundUser.nombre}</strong> — {cedulaFoundUser.membresia}
                </p>
                <p className="mt-2">{obtenerEstadoMembresia(cedulaFoundUser)}</p>

                {/* Mensaje si ya registró hoy */}
                {!canRegisterEntry(cedulaFoundUser).ok && canRegisterEntry(cedulaFoundUser).message === "Ya registró entrada hoy" ? (
                  <div className="mb-2 text-red-600 font-semibold">
                    Ya registró entrada hoy.
                  </div>
                ) : null}

                <div className="flex justify-end gap-2 mt-4">
                  <button
                    onClick={handleRegistrarPorCedula}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
                    disabled={!canRegisterEntry(cedulaFoundUser).ok}
                  >
                    Registrar entrada
                  </button>
                  <button
                    onClick={() => {
                      setCedulaFoundUser(null);
                      setCedulaMessage(null);
                    }}
                    className="bg-gray-200 px-3 py-1 rounded"
                  >
                    Limpiar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

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