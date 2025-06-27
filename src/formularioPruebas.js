import { useState } from 'react';
import { supabase } from './supabaseClient';

export default function TryoutForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    tutorName: '',
    email: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { error } = await supabase.from('pruebas').insert([{
      first_name: formData.firstName,
      last_name: formData.lastName,
      tutor_name: formData.tutorName,
      email: formData.email,
    }]);

    if (error) {
      alert('Error al registrar.');
      console.log(error);
    } else {
      alert('Registro enviado con éxito.');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', maxWidth: 400, gap: 10 }}>
      <input name="firstName" placeholder="Nombre del jugador" onChange={handleChange} required />
      <input name="lastName" placeholder="Apellido del jugador" onChange={handleChange} required />
      <input name="tutorName" placeholder="Nombre del tutor (opcional)" onChange={handleChange} />
      <input name="email" placeholder="Correo electrónico de contacto" onChange={handleChange} required />
      <button type="submit">Enviar</button>
    </form>
  );
}
