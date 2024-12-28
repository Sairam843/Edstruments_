import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import InvoiceForm from './components/InvoiceForm';
import { SnackbarProvider } from 'notistack';
import { Button } from '@mui/material';

function App() {
  return (
    <SnackbarProvider
    maxSnack={3} 
    anchorOrigin={{
      vertical: 'top',  
      horizontal: 'right',  
    }}
    >
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/invoice" element={<InvoiceForm />} />
    </Routes>
    </SnackbarProvider>
  );
}

export default App;