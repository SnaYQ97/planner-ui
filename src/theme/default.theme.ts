import {createTheme} from "@mui/material";

export const PRIMARY_COLOR = '#e5e5f5';
export const SECONDARY_COLOR = '#a6a6cc';
export const BACKGROUND_COLOR = '#4d4d4d';
export const DEFAULT_COLOR = '#e5e5e5';
export const TEXT_COLOR = '#f2f2f2';
export const ERROR_COLOR = '#cc3333';

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
          // backgroundColor: '#e5e5e5',
          "&:disabled": {
            // backgroundColor: '#fffffB2',
            // color: '000000b2',
          },
          "&:hover": {
            // backgroundColor: '#f9f9f9',
          }
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          paddingRight: 0,
        },
        notchedOutline: {
          padding: '0 15px',
          borderColor: 'white',
        },
        input: {
          padding: '16.5px 20px',
          '&:-webkit-autofill': {
            'WebkitBoxShadow': 'unset',
          },
        },
      },
    },
    MuiInputAdornment: {
      styleOverrides: {
        root: {
          position: 'absolute',
          right: 6,
        },
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
    },
  },
});

// #348a37
// Custom Variables https://mui.com/material-ui/customization/theming/#custom-variables
