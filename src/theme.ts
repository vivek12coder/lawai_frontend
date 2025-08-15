import { createTheme, alpha } from '@mui/material/styles';

// Centralized theme derived from Home page visuals
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#4a90e2',
      light: '#79c7ff',
      dark: '#2171cd',
    },
    secondary: {
      main: '#e6b34a',
      light: '#edc275',
      dark: '#c99632',
    },
    background: {
      default: '#0a192f', // Home background base
      paper: '#0d2440',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b3b3cc',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: 'linear-gradient(135deg, #0a192f 0%, #0d2440 100%)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'rgba(10, 25, 41, 0.6)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 24px',
          transition: 'transform 220ms ease, box-shadow 220ms ease, background-color 220ms ease',
        },
        containedPrimary: {
          backgroundColor: '#4a90e2',
          '&:hover': {
            backgroundColor: '#2171cd',
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 20px rgba(74,144,226,0.40)',
          },
        },
        outlinedPrimary: ({ theme }) => ({
          borderColor: alpha(theme.palette.primary.main, 0.5),
          color: theme.palette.primary.main,
          '&:hover': {
            borderColor: theme.palette.primary.main,
            backgroundColor: alpha(theme.palette.primary.main, 0.1),
          },
        }),
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, rgba(74,144,226,0.10) 0%, rgba(230,179,74,0.10) 100%)',
          border: '1px solid rgba(255,255,255,0.1)',
          transition: 'transform 220ms ease, box-shadow 220ms ease, background 220ms ease',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 8px 20px -12px rgba(74,144,226,0.5)'
          },
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        h2: {
          background: 'linear-gradient(45deg, #4a90e2, #79c7ff)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        },
      },
    },
  },
});

export default theme;
