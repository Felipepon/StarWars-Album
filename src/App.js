
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Menu from './Components/Menu/Menu';
import Album from './Components/Album/Album';
import ObtenerLaminas from './components/GetStickers/GetStickers';

const App = () => {
  return (
    <Router>
      <div className="App">
        <Menu />
        <Routes>
        <Route path="/get-stickers" element={<ObtenerLaminas />} />
        <Route path="/my-album" element={<Album />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;