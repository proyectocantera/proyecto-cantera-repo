import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { enviarCorreoFichaje } from '../utils/email';


export default function PanelEntrenadores() {
  const [jugadores, setJugadores] = useState([]);
  const [categoriaFiltrada, setCategoriaFiltrada] = useState('');

  const obtenerInscripciones = async () => {
    const { data, error } = await supabase
      .from('inscripcion_pruebas')
      .select('*');

    if (!error) setJugadores(data);
    else console.error('Error obteniendo inscripciones:', error);
  };

  useEffect(() => {
    obtenerInscripciones();
  }, []);

  const asignarEquipo = async (jugador, equipo) => {
    const { data: grupo, error: errorGrupo } = await supabase
      .from('categorias_grupos')
      .select('enlace_whatsapp')
      .eq('categoria', jugador.categoria_asignada)
      .eq('equipo', equipo)
      .single();

    if (errorGrupo) {
      alert('No se pudo obtener el enlace del grupo');
      console.error(errorGrupo);
      return;
    }

    const { error: errorUpdate } = await supabase
      .from('inscripcion_pruebas')
      .update({
        estado: equipo === 'Descartado' ? 'descartado' : 'aceptado',
        equipo: equipo,
        enlace_grupo: equipo === 'Descartado' ? null : grupo.enlace_whatsapp,
      })
      .eq('inscripcion_id', jugador.inscripcion_id);

    if (!errorUpdate) {
      alert(`Jugador asignado a equipo ${equipo}`);
      obtenerInscripciones();
    } else {
      alert('Error actualizando al jugador');
      console.error(errorUpdate);
    }
  };

  const jugadoresFiltrados = categoriaFiltrada
    ? jugadores.filter(j => j.categoria_asignada === categoriaFiltrada)
    : jugadores;

  const pendientes = jugadoresFiltrados.filter(j => j.estado === 'pendiente');
  const aceptados = jugadoresFiltrados.filter(j => j.estado === 'aceptado');

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-800">Panel de Entrenadores</h2>

      <div className="mb-6">
        <label className="block mb-1 font-medium">Filtrar por categoría:</label>
        <select
          className="border rounded px-4 py-2"
          value={categoriaFiltrada}
          onChange={(e) => setCategoriaFiltrada(e.target.value)}
        >
          <option value="">Todas</option>
          <option value="Chupetín">Chupetín</option>
          <option value="Prebenjamín">Prebenjamín</option>
          <option value="Benjamín">Benjamín</option>
          <option value="Alevín">Alevín</option>
          <option value="Infantil">Infantil</option>
          <option value="Cadete">Cadete</option>
          <option value="Juvenil">Juvenil</option>
        </select>
      </div>

      <div className="mb-8">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">⏳ Jugadores pendientes</h3>
        <div className="space-y-4">
          {pendientes.map(jugador => (
            <div key={jugador.inscripcion_id} className="border p-4 rounded shadow">
              <h3 className="text-xl font-semibold">{jugador.nombre} {jugador.apellidos}</h3>
              <p><strong>Fecha Nacimiento:</strong> {jugador.fecha_nacimiento}</p>
              <p><strong>Posición:</strong> {jugador.posicion}</p>
              <p><strong>Teléfono:</strong> {jugador.contacto_tutor}</p>
              <p><strong>Categoría:</strong> {jugador.categoria_asignada}</p>
              <p><strong>Observaciones:</strong> {jugador.observaciones || 'Ninguna'}</p>

              <div className="mt-4 flex flex-wrap gap-2">
                {['A', 'B', 'C', 'Descartado'].map(equipo => (
                  <button
                    key={equipo}
                    onClick={() => asignarEquipo(jugador, equipo)}
                    className={`px-4 py-2 rounded text-white font-semibold ${
                      equipo === 'Descartado'
                        ? 'bg-red-600 hover:bg-red-700'
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    Asignar a {equipo}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {pendientes.length === 0 && (
            <p className="text-center text-gray-500">No hay jugadores pendientes.</p>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">✅ Jugadores aceptados</h3>
        <div className="space-y-4">
          {aceptados.map(jugador => (
            <div key={jugador.inscripcion_id} className="border p-4 rounded shadow bg-green-50">
              <h3 className="text-xl font-semibold">{jugador.nombre} {jugador.apellidos}</h3>
              <p><strong>Fecha Nacimiento:</strong> {jugador.fecha_nacimiento}</p>
              <p><strong>Posición:</strong> {jugador.posicion}</p>
              <p><strong>Teléfono:</strong> {jugador.contacto_tutor}</p>
              <p><strong>Categoría:</strong> {jugador.categoria_asignada}</p>
              <p><strong>Equipo:</strong> {jugador.equipo}</p>
              <p><strong>Enlace grupo:</strong> {jugador.enlace_grupo}</p>
              <p><strong>Observaciones:</strong> {jugador.observaciones || 'Ninguna'}</p>

              <div className="mt-4 p-3 bg-green-100 border border-green-400 rounded">
                <p className="text-green-800 font-semibold">
                  ✅ FICHAR AL JUGADOR {jugador.nombre} {jugador.apellidos} PARA EL EQUIPO {jugador.categoria_asignada} {jugador.equipo}
                </p>
                <button
                  className="mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  onClick={() =>
                    enviarCorreoFichaje({
                        to_name: `${jugador.nombre} ${jugador.apellidos}`,
                        to_email: jugador.email,
                        categoria: jugador.categoria_asignada,
                        equipo: jugador.equipo,
                        enlace_grupo: jugador.enlace_grupo,
                    })
                        .then(() => alert('Correo enviado al tutor con el enlace de WhatsApp ✅'))
                        .catch((err) => {
                        console.error('Error al enviar correo:', err);
                        alert('Hubo un problema al enviar el correo');
                        })
                    }
                >
                  Confirmar fichaje y enviar enlace
                </button>
              </div>
            </div>
          ))}

          {aceptados.length === 0 && (
            <p className="text-center text-gray-500">No hay jugadores aceptados.</p>
          )}
        </div>
      </div>
    </div>
  );
}
