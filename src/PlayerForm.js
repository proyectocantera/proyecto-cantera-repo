import React, { useState } from 'react';
import { supabase } from './supabaseClient';

export default function PlayerForm() {
  const [formData, setFormData] = useState({
    playerName: '',
    birthDate: '',
    tutorName: '',
    tutorPhone: '',
    medicalInfo: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { error } = await supabase.from('players').insert([{
      club_id: '00000000-0000-0000-0000-000000000000',
      player_name: formData.playerName,
      birth_date: formData.birthDate,
      tutor_name: formData.tutorName,
      tutor_phone: formData.tutorPhone,
      medical_info: formData.medicalInfo,
    }]);

    if (error) {
      alert('Error al guardar jugador');
      console.log(error);
    } else {
      alert('Jugador inscrito correctamente');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', maxWidth: 400, gap: 10 }}>
      <input name="playerName" placeholder="Nombre del jugador" onChange={handleChange} required />
      <input name="birthDate" type="date" onChange={handleChange} required />
      <input name="tutorName" placeholder="Nombre del tutor" onChange={handleChange} required />
      <input name="tutorPhone" placeholder="Teléfono del tutor" onChange={handleChange} required />
      <textarea name="medicalInfo" placeholder="Información médica" onChange={handleChange}></textarea>
      <button type="submit">Enviar</button>
    </form>
  );
}
