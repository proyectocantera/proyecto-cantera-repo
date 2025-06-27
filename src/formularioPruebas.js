import { useState } from 'react';
import { supabase } from './supabaseClient';

export default function FormularioPruebas() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    birth_year: '',
    email: '',
    position: '',
    reference: '',
  });
  const [enviado, setEnviado] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const next = () => setStep((prev) => prev + 1);
  const back = () => setStep((prev) => prev - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('pruebas').insert([formData]);
    if (!error) setEnviado(true);
  };

  if (enviado) return <p style={styles.msg}>✅ ¡Inscripción enviada! Te contactaremos pronto.</p>;

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h2 style={styles.title}>Inscripción a pruebas</h2>

      {step === 1 && (
        <>
          <input name="first_name" placeholder="Nombre" onChange={handleChange} required style={styles.input} />
          <input name="last_name" placeholder="Apellidos" onChange={handleChange} required style={styles.input} />
          <input name="birth_year" placeholder="Año de nacimiento" onChange={handleChange} required style={styles.input} />
        </>
      )}

      {step === 2 && (
        <>
          <input name="email" type="email" placeholder="Correo electrónico" onChange={handleChange} required style={styles.input} />
          <input name="position" placeholder="Posición preferida (opcional)" onChange={handleChange} style={styles.input} />
          <input name="reference" placeholder="¿Cómo conociste el club? (opcional)" onChange={handleChange} style={styles.input} />
        </>
      )}

      {step === 3 && (
        <div style={styles.resumen}>
          <p><strong>Nombre:</strong> {formData.first_name} {formData.last_name}</p>
          <p><strong>Año de nacimiento:</strong> {formData.birth_year}</p>
          <p><strong>Email:</strong> {formData.email}</p>
          <p><strong>Posición:</strong> {formData.position || '-'}</p>
          <p><strong>Referencia:</strong> {formData.reference || '-'}</p>
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
  form: { maxWidth: 420, margin: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 12, fontFamily: 'sans-serif' },
  title: { textAlign: 'center' },
  input: { padding: 10, border: '1px solid #ccc', borderRadius: 6 },
  botones: { display: 'flex', justifyContent: 'space-between' },
  primario: { padding: 10, backgroundColor: '#002f6c', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 'bold' },
  secundario: { padding: 10, backgroundColor: '#ccc', border: 'none', borderRadius: 6 },
  msg: { padding: 20, fontSize: 18 },
  resumen: { backgroundColor: '#f5f5f5', padding: 15, borderRadius: 6 }
};
