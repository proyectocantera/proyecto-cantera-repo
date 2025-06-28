import { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function FormularioPruebas() {
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    fecha_nacimiento: '',
    contacto_tutor: '',
    email: '',
    posicion: '',
    observaciones: '',
    consentimiento_datos: false,
  });

  const [categoriaDetectada, setCategoriaDetectada] = useState('');
  const [horarioPruebas, setHorarioPruebas] = useState(null);
  const [errores, setErrores] = useState({
    email: '',
    contacto_tutor: '',
  });

  function calcularCategoria(fechaNacimiento) {
    const anio = new Date(fechaNacimiento).getFullYear();

    if ([2007, 2008, 2009].includes(anio)) return 'Juvenil';
    if ([2010, 2011].includes(anio)) return 'Cadete';
    if ([2012, 2013].includes(anio)) return 'Infantil';
    if ([2014, 2015].includes(anio)) return 'Alevín';
    if ([2016, 2017].includes(anio)) return 'Benjamín';
    if ([2018, 2019].includes(anio)) return 'Prebenjamín';
    if (anio >= 2020) return 'Chupetín';

    return 'Fuera de rango';
  }

  const handleChange = async (e) => {
    const { name, value, type, checked } = e.target;
    const newForm = { ...formData, [name]: type === 'checkbox' ? checked : value };
    const newErrores = { ...errores };

    if (name === 'contacto_tutor') {
      const telefonoValido = /^[0-9]{9,}$/.test(value);
      newErrores.contacto_tutor = telefonoValido ? '' : 'Número no válido';
    }

    if (name === 'email') {
      const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      newErrores.email = emailValido ? '' : 'Email no válido';
    }

    setFormData(newForm);
    setErrores(newErrores);

    if (name === 'fecha_nacimiento') {
      const categoria = calcularCategoria(value);
      setCategoriaDetectada(categoria);

      const { data, error } = await supabase
        .from('categorias_horarios')
        .select('dia, hora, lugar')
        .eq('categoria', categoria)
        .single();

      setHorarioPruebas(!error ? data : null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (errores.email || errores.contacto_tutor) {
      alert('Corrige los errores antes de enviar.');
      return;
    }

    const categoria_asignada = calcularCategoria(formData.fecha_nacimiento);

    const payload = {
      ...formData,
      categoria_asignada,
      fecha_inscripcion: new Date().toISOString().split('T')[0],
      estado: 'pendiente',
    };

    const { error } = await supabase.from('inscripcion_pruebas').insert([payload]);

    if (!error) {
      alert('Inscripción enviada con éxito');
      setFormData({
        nombre: '',
        apellidos: '',
        fecha_nacimiento: '',
        contacto_tutor: '',
        email: '',
        posicion: '',
        observaciones: '',
        consentimiento_datos: false,
      });
      setCategoriaDetectada('');
      setHorarioPruebas(null);
    } else {
      alert('Hubo un error al enviar la inscripción');
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 to-blue-200 flex items-center justify-center px-4">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-xl p-10">
        <h1 className="text-4xl font-bold text-center text-blue-800 mb-10">Inscripción a Pruebas del Club</h1>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[ 
            { label: 'Nombre', name: 'nombre', type: 'text' },
            { label: 'Apellidos', name: 'apellidos', type: 'text' },
            { label: 'Teléfono del tutor', name: 'contacto_tutor', type: 'text' },
            { label: 'Email', name: 'email', type: 'email' },
          ].map(({ label, name, type }) => (
            <div key={name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              <input
                type={type}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                required
                className={`w-full rounded-xl border px-4 py-2 bg-gray-50 focus:outline-none focus:ring-2 transition ${errores[name] ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
              />
              {errores[name] && (
                <p className="text-sm text-red-600 mt-1">{errores[name]}</p>
              )}
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de nacimiento</label>
            <input
              type="date"
              name="fecha_nacimiento"
              value={formData.fecha_nacimiento}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-gray-300 px-4 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
            {categoriaDetectada && (
              <p className="mt-2 text-sm text-blue-700 font-semibold">
                Categoría detectada: {categoriaDetectada}
              </p>
            )}
            {horarioPruebas && (
              <p className="text-sm text-gray-600">
                🗓️ Pruebas: {horarioPruebas.dia} a las {horarioPruebas.hora} en {horarioPruebas.lugar}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Posición preferida</label>
            <select
              name="posicion"
              value={formData.posicion}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 px-4 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              required
            >
              <option value="">Selecciona una opción</option>
              <option value="Portero">Portero</option>
              <option value="Defensa">Defensa</option>
              <option value="Mediocentro">Mediocentro</option>
              <option value="Delantero">Delantero</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
            <textarea
              name="observaciones"
              value={formData.observaciones}
              onChange={handleChange}
              rows={4}
              className="w-full rounded-xl border border-gray-300 px-4 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          <div className="md:col-span-2 flex items-start space-x-3">
            <input
              type="checkbox"
              name="consentimiento_datos"
              checked={formData.consentimiento_datos}
              onChange={handleChange}
              className="mt-1 h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label className="text-sm text-gray-700 leading-snug">
              Acepto el tratamiento de datos personales conforme al RGPD.
            </label>
          </div>

          <div className="md:col-span-2 text-center mt-6">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold px-8 py-3 rounded-full shadow-md transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300"
            >
              Enviar inscripción
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
