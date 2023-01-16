import './App.css';
import Login from './pages/Login';
import Registeration from './pages/Registeration';
import Main from './pages/Main';
import { BrowserRouter, Routes, Route} from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Main/>}/>
        <Route path="/registeration" element={<Registeration />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
