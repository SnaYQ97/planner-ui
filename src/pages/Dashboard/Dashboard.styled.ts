import { styled } from '@mui/material/styles';
import { Box, Button } from '@mui/material';

const Styled = {
  DashboardRoot: styled(Box)(({ theme }) => ({
    minHeight: '100vh',
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(3),
    position: 'relative',
  })),

  MainContent: styled(Box)(({ theme }) => ({
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: theme.spacing(3),
    marginTop: theme.spacing(3),
    [theme.breakpoints.down('md')]: {
      gridTemplateColumns: '1fr',
    },
  })),

  LeftColumn: styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
  })),

  RightColumn: styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
  })),

  LogoutButton: styled(Button)(({ theme }) => ({
    position: 'fixed',
    bottom: theme.spacing(3),
    right: theme.spacing(3),
    backgroundColor: theme.palette.error.main,
    color: theme.palette.error.contrastText,
    '&:hover': {
      backgroundColor: theme.palette.error.dark,
    },
  })),
};

export default Styled; 