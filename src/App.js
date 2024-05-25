import './App.css';
import { BrowserRouter as Router,  } from 'react-router-dom';
import Menu from './Components/Menu/Menu';

const App = () => {
  return (
    <Router>
      <div className="App">
        <Menu />
       
      </div>
    </Router>
  );
};

export default App;
