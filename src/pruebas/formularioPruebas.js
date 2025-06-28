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
    categoria: '',
    observaciones: '',
    consentimiento_datos: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
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
        categoria: '',
        observaciones: '',
        consentimiento_datos: false,
      });
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
            { label: 'Fecha de nacimiento', name: 'fecha_nacimiento', type: 'date' },
            { label: 'Teléfono del tutor', name: 'contacto_tutor', type: 'text' },
            { label: 'Email', name: 'email', type: 'email' },
            { label: 'Posición preferida', name: 'posicion', type: 'text' },
            { label: 'Categoría estimada', name: 'categoria', type: 'text' },
          ].map(({ label, name, type }) => (
            <div key={name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              <input
                type={type}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                required={name !== 'posicion' && name !== 'categoria'}
                className="w-full rounded-xl border border-gray-300 px-4 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>
          ))}

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
