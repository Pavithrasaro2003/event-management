import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes/AppRoutes';
import Navbar from './components/Navbar';
import { ThemeProvider } from './context/ThemeContext';
import './styles/theme.css';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <div className="app-shell">
            <Navbar />
            <div style={{ padding: '0 0 3rem 0' }}>
              <AppRoutes />
            </div>
          </div>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
