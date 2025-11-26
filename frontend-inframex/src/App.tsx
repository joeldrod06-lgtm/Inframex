import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import PointOfSale from './components/PointOfSale';
import { AppProvider } from './context/AppContext';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppProvider>
        <Router>
          <Box sx={{ display: 'flex' }}>
            <Navbar />
            <Box component="main" sx={{ flexGrow: 1, p: 3, marginTop: '64px' }}>
              <Routes>
                <Route path="/" element={<PointOfSale />} />
                <Route path="/products" element={<div>Módulo de Productos - Próximamente</div>} />
                <Route path="/sales" element={<div>Módulo de Ventas - Próximamente</div>} />
                <Route path="/inventory" element={<div>Módulo de Inventario - Próximamente</div>} />
              </Routes>
            </Box>
          </Box>
        </Router>
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;