import { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function FormularioPruebas() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    birth_date: '',
    email: '',
    position: '',
    reference: '',
  });
  const [enviado, setEnviado] = useState(false);
  const [errores, setErrores] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validarStep = () => {
    let valid = true;
    let errs = {};

    if (step === 1) {
      if (!formData.first_name) { errs.first_name = 'Obligatorio'; valid = false; }
      if (!formData.last_name) { errs.last_name = 'Obligatorio'; valid = false; }
      if (!/^\d{2}\/\d{2}\/\d{4}$/.test(formData.birth_date)) {
        errs.birth_date = 'Formato inválido (DD/MM/AAAA)';
        valid = false;
      }
    }

    if (step === 2) {
      if (!formData.email || !formData.email.includes('@')) {
        errs.email = 'Email inválido';
        valid = false;
      }
      if (!formData.position) {
        errs.position = 'Selecciona una posición';
        valid = false;
      }
    }

    setErrores(errs);
    return valid;
  };

  const next = () => {
    if (validarStep()) setStep((prev) => prev + 1);
  };

  const back = () => setStep((prev) => prev - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('pruebas').insert([formData]);
    if (!error) setEnviado(true);
  };

  const calcularCategoriaYHorario = () => {
    const year = parseInt(formData.birth_date.split('/')[2]);
    if (year >= 2016) return 'Prebenjamín – Lunes 17:00-18:00';
    if (year >= 2014) return 'Benjamín – Martes 17:00-18:15';
    if (year >= 2012) return 'Alevín – Miércoles 18:00-19:15';
    if (year >= 2010) return 'Infantil – Jueves 18:30-20:00';
    return 'Cadete/Juvenil – Viernes 19:00-20:30';
  };

  if (enviado) return <p style={styles.msg}>✅ ¡Inscripción enviada! Te contactaremos pronto.</p>;

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h2 style={styles.title}>Inscripción a pruebas</h2>

      {step === 1 && (
        <>
          <input name="first_name" placeholder="Nombre" onChange={handleChange} style={styles.input} />
          {errores.first_name && <span style={styles.error}>{errores.first_name}</span>}

          <input name="last_name" placeholder="Apellidos" onChange={handleChange} style={styles.input} />
          {errores.last_name && <span style={styles.error}>{errores.last_name}</span>}

          <input name="birth_date" placeholder="Fecha nacimiento (DD/MM/AAAA)" onChange={handleChange} style={styles.input} />
          {errores.birth_date && <span style={styles.error}>{errores.birth_date}</span>}
        </>
      )}

      {step === 2 && (
        <>
          <input name="email" type="email" placeholder="Correo electrónico" onChange={handleChange} style={styles.input} />
          {errores.email && <span style={styles.error}>{errores.email}</span>}

          <select name="position" onChange={handleChange} style={styles.input} defaultValue="">
            <option value="" disabled>Selecciona posición</option>
            <option value="Portero">Portero</option>
            <option value="Defensa">Defensa</option>
            <option value="Medio">Medio</option>
            <option value="Delantero">Delantero</option>
          </select>
          {errores.position && <span style={styles.error}>{errores.position}</span>}

          <input name="reference" placeholder="¿Cómo conociste el club? (opcional)" onChange={handleChange} style={styles.input} />
        </>
      )}

      {step === 3 && (
        <div style={styles.resumen}>
          <p><strong>Jugador:</strong> {formData.first_name} {formData.last_name}</p>
          <p><strong>Fecha nacimiento:</strong> {formData.birth_date}</p>
          <p><strong>Email:</strong> {formData.email}</p>
          <p><strong>Posición:</strong> {formData.position}</p>
          <p><strong>Referencia:</strong> {formData.reference || '-'}</p>
          <p><strong>Horario de pruebas:</strong> {calcularCategoriaYHorario()}</p>
        </div>
      )}

      <div style={styles.botones}>
        {step > 1 && <button type="button" onClick={back} style={styles.secundario}>Atrás</button>}
        {step < 3 && <button type="button" onClick={next} style={styles.primario}>Siguiente</button>}
        {step === 3 && <button type="submit" style={styles.primario}>Enviar</button>}
      </div>
    </form>
  );
}

const styles = {
  form: { maxWidth: 440, margin: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 12, fontFamily: 'sans-serif' },
  title: { textAlign: 'center' },
  input: { padding: 10, border: '1px solid #ccc', borderRadius: 6 },
  botones: { display: 'flex', justifyContent: 'space-between' },
  primario: { padding: 10, backgroundColor: '#002f6c', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 'bold' },
  secundario: { padding: 10, backgroundColor: '#ccc', border: 'none', borderRadius: 6 },
  msg: { padding: 20, fontSize: 18 },
  resumen: { backgroundColor: '#f5f5f5', padding: 15, borderRadius: 6 },
  error: { color: 'red', fontSize: 13 }
};
