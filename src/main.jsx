import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { FormProvider } from './contexts/FormContext';
import vi from 'date-fns/locale/vi';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
        <FormProvider>
          <App />
        </FormProvider>
      </LocalizationProvider>
    </BrowserRouter>
  </StrictMode>,
)
