import { BrowserRouter, Routes, Route } from 'react-router-dom';
import FormularioPruebas from './pruebas/formularioPruebas';
import FormularioInscripcion from './inscripcion/formularioInscripcion';
import Entrenadores from './pages/Entrenadores';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/pruebas" element={<FormularioPruebas />} />
        <Route path="/inscripcion" element={<FormularioInscripcion />} />
        <Route path="/entrenadores" element={<Entrenadores />} />
        <Route path="*" element={<FormularioPruebas />} /> {/* ruta por defecto */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
