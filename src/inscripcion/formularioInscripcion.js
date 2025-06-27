import { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function FormularioInscripcion() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    club_id: 'CLUB_ID_DEMO',
    player_name: '',
    player_dni: '',
    birth_date: '',
    category: '',
    address: '',
    contact_email: '',
    tutor_name: '',
    tutor_phone: '',
    tutor2_name: '',
    tutor2_phone: '',
    medical_info: '',
    document_url: '',
    accept_privacy_policy: false,
    allow_image_rights: false,
  });
  const [enviado, setEnviado] = useState(false);
  const [errores, setErrores] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const validarStep = () => {
    let valid = true;
    let errs = {};

    if (step === 1) {
      if (!formData.player_name) { errs.player_name = 'Requerido'; valid = false; }
      if (!formData.birth_date) { errs.birth_date = 'Requerido'; valid = false; }
      if (!formData.category) { errs.category = 'Requerido'; valid = false; }
    }

    if (step === 2) {
      if (!formData.tutor_name) { errs.tutor_name = 'Requerido'; valid = false; }
      if (!formData.tutor_phone) { errs.tutor_phone = 'Requerido'; valid = false; }
      if (!formData.contact_email.includes('@')) { errs.contact_email = 'Email inválido'; valid = false; }
      if (!formData.address) { errs.address = 'Requerido'; valid = false; }
    }

    if (step === 3) {
      if (!formData.accept_privacy_policy) {
        errs.accept_privacy_policy = 'Necesario para continuar';
        valid = false;
      }
    }

    setErrores(errs);
    return valid;
  };

  const next = () => {
    if (validarStep()) setStep(step + 1);
  };

  const back = () => setStep(step - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('players').insert([formData]);
    if (!error) setEnviado(true);
  };

  if (enviado) return <p style={styles.msg}>✅ Inscripción completada. ¡Bienvenido al club!</p>;

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h2 style={styles.title}>Inscripción al club</h2>

      {step === 1 && (
        <>
          <input name="player_name" placeholder="Nombre completo del jugador" onChange={handleChange} style={styles.input} />
          {errores.player_name && <span style={styles.error}>{errores.player_name}</span>}

          <input name="player_dni" placeholder="DNI del jugador (opcional)" onChange={handleChange} style={styles.input} />

          <input name="birth_date" type="date" onChange={handleChange} style={styles.input} />
          {errores.birth_date && <span style={styles.error}>{errores.birth_date}</span>}

          <input name="category" placeholder="Categoría asignada (ej: Alevín A)" onChange={handleChange} style={styles.input} />
          {errores.category && <span style={styles.error}>{errores.category}</span>}
        </>
      )}

      {step === 2 && (
        <>
          <input name="tutor_name" placeholder="Nombre tutor principal" onChange={handleChange} style={styles.input} />
          {errores.tutor_name && <span style={styles.error}>{errores.tutor_name}</span>}

          <input name="tutor_phone" placeholder="Teléfono tutor principal" onChange={handleChange} style={styles.input} />
          {errores.tutor_phone && <span style={styles.error}>{errores.tutor_phone}</span>}

          <input name="tutor2_name" placeholder="Nombre segundo tutor (opcional)" onChange={handleChange} style={styles.input} />
          <input name="tutor2_phone" placeholder="Teléfono segundo tutor (opcional)" onChange={handleChange} style={styles.input} />

          <input name="contact_email" placeholder="Email de contacto" onChange={handleChange} style={styles.input} />
          {errores.contact_email && <span style={styles.error}>{errores.contact_email}</span>}

          <input name="address" placeholder="Dirección completa" onChange={handleChange} style={styles.input} />
          {errores.address && <span style={styles.error}>{errores.address}</span>}

          <textarea name="medical_info" placeholder="Información médica relevante (alergias, etc)" onChange={handleChange} style={styles.input} />
        </>
      )}

      {step === 3 && (
        <>
          <label>
            <input type="checkbox" name="accept_privacy_policy" onChange={handleChange} />
            Acepto la política de privacidad
          </label>
          {errores.accept_privacy_policy && <span style={styles.error}>{errores.accept_privacy_policy}</span>}

          <label>
            <input type="checkbox" name="allow_image_rights" onChange={handleChange} />
            Autorizo el uso de imagen del jugador para redes sociales del club
          </label>

          <p style={{ background: '#f3f3f3', padding: 12, borderRadius: 6 }}>
            <strong>Resumen:</strong><br />
            Jugador: {formData.player_name}<br />
            Categoría: {formData.category}<br />
            Tutor: {formData.tutor_name}<br />
            Email: {formData.contact_email}
          </p>
        </>
      )}

      <div style={styles.botones}>
        {step > 1 && <button type="button" onClick={back} style={styles.secundario}>Atrás</button>}
        {step < 3 && <button type="button" onClick={next} style={styles.primario}>Siguiente</button>}
        {step === 3 && <button type="submit" style={styles.primario}>Finalizar</button>}
      </div>
    </form>
  );
}

const styles = {
  form: { maxWidth: 500, margin: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 12, fontFamily: 'sans-serif' },
  title: { textAlign: 'center' },
  input: { padding: 10, border: '1px solid #ccc', borderRadius: 6 },
  botones: { display: 'flex', justifyContent: 'space-between' },
  primario: { padding: 10, backgroundColor: '#002f6c', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 'bold' },
  secundario: { padding: 10, backgroundColor: '#ccc', border: 'none', borderRadius: 6 },
  msg: { padding: 20, fontSize: 18 },
  error: { color: 'red', fontSize: 13 }
};
