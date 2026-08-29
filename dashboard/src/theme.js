import { createTheme } from '@mui/material/styles'

export default createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#075eb6', dark: '#00478d', light: '#d6e7ff' },
    secondary: { main: '#16853b' },
    background: { default: '#f4f7fc', paper: '#ffffff' },
    text: { primary: '#10233b', secondary: '#5f6c7c' },
  },
  shape: { borderRadius: 18 },
  typography: {
    fontFamily: 'Inter, system-ui, sans-serif',
    h3: { fontWeight: 800, letterSpacing: '-0.035em' },
    h4: { fontWeight: 800, letterSpacing: '-0.025em' },
    h5: { fontWeight: 750 },
    h6: { fontWeight: 750 },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          border: '1px solid #e2e8f0',
          boxShadow: '0 10px 35px rgba(0, 71, 141, .06)',
        },
      },
    },
    MuiTableCell: { styleOverrides: { root: { borderColor: '#e8edf4' } } },
  },
})
