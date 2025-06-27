import { BrowserRouter, Routes, Route } from 'react-router-dom';
import FormularioPruebas from './formularioPruebas';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<FormularioPruebas />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
