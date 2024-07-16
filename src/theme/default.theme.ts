import {createTheme} from "@mui/material";

export const PRIMARY_COLOR = '#348a37';
export const SECONDARY_COLOR = '#a2d4cd';
export const BACKGROUND_COLOR = '#282828';
export const DEFAULT_COLOR = '#121212';
export const TEXT_COLOR = '#e5e5e5';
export const ERROR_COLOR = '#c70404';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';


export const defaultTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: PRIMARY_COLOR,
    },
    secondary: {
      main: SECONDARY_COLOR,
    },
    background: {
      paper: BACKGROUND_COLOR,
      default: DEFAULT_COLOR,
    },
    text: {
      primary: TEXT_COLOR,
    },
    error: {
      main: ERROR_COLOR,
    },
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'capitalize',
          fontSize: '1rem',
          padding: '7px 5px',
        },
        contained: {
          backgroundColor: 'red',
          "&:disabled": {

          }
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          // color: 'pink',
        },
        notchedOutline: {
          padding: '0 15px',
          borderColor: 'rgba(155,155,155,0.63)',
        },
        input: {
          padding: '16.5px 20px',
        }
      },

    },
    MuiInputLabel: {
      styleOverrides: {
        root: {

        },
        shrink: {
          fontWeight: 600,
          transform: 'translate(20px, -9px) scale(0.75)', //14 +6 / +3
        },
      },
    }
  },
});


// Custom Variables https://mui.com/material-ui/customization/theming/#custom-variables
