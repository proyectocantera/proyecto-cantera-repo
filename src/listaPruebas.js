import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from './supabaseClient';

export default function ListaPruebas() {
  const [jugadores, setJugadores] = useState([]);
  const [searchParams] = useSearchParams();
  const codigo = searchParams.get('codigo');

  useEffect(() => {
    if (codigo === '123abc') fetchJugadores();
  }, [codigo]);

  const fetchJugadores = async () => {
    const { data, error } = await supabase
      .from('pruebas')
      .select('*')
      .order('created_at');
    if (!error) setJugadores(data);
  };

  const aceptarJugador = async (id) => {
    const { error } = await supabase
      .from('pruebas')
      .update({ aceptado: true })
      .eq('id', id);
    if (!error) fetchJugadores();
  };

  if (codigo !== '123abc') return <p>Acceso no autorizado</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Jugadores inscritos en pruebas</h2>
      <ul>
        {jugadores.map((j) => (
          <li key={j.id} style={{ marginBottom: 10 }}>
            <strong>{j.first_name} {j.last_name}</strong> — {j.email}
            {j.aceptado ? (
              <span style={{ color: 'green', marginLeft: 10 }}>✅ Aceptado</span>
            ) : (
              <button onClick={() => aceptarJugador(j.id)} style={{ marginLeft: 10 }}>
                Aceptar
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
