import { BrowserRouter, Routes, Route } from 'react-router-dom';
import FormularioPruebas from './formularioPruebas';
import ListaPruebas from './listaPruebas';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<FormularioPruebas />} />
        <Route path="/lista-pruebas" element={<ListaPruebas />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
