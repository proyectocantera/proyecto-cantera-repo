import emailjs from 'emailjs-com';

export function enviarCorreoFichaje({ to_name, to_email, categoria, equipo, enlace_grupo }) {
  const payload = {
    to_name,
    to_email,
    categoria,
    equipo,
    enlace_grupo,
  };

  console.log('📤 Enviando email con:', payload);

  return emailjs.send(
    'service_zza1ls9',     // Tu Service ID
    'template_7t8lbcc',    // Tu Template ID
    payload,
    '3e1E8u3H44cK4mxga'  // TU CLAVE PÚBLICA de EmailJS
  );
}
