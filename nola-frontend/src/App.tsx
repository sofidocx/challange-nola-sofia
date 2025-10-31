import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Explorar from './pages/Explorar';
import CompararLojas from './pages/CompararLojas'
import './App.css';

function App() {
    return (
        <>
            <nav className="navbar">
                <Link to="/"> Dashboard Visual</Link>
                <Link to="/explorar"> Explorar Dados </Link>
                <Link to="/comparar"> Comparar Lojas </Link>
            </nav>
            <div className="dashboard-container">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/explorar" element={<Explorar />} />
                    <Route path="/comparar" element={<CompararLojas />} />
                </Routes>
            </div>
        </>
    )
}

export default App; 
