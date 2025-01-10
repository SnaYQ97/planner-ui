import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

const Styled = {
  SummaryRoot: styled(Box)(({ theme }) => ({
    padding: theme.spacing(3),
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.spacing(2),
    boxShadow: theme.shadows[1],
  })),

  ChartContainer: styled(Box)({
    display: 'flex',
    justifyContent: 'center',
    margin: '20px 0',
  }),

  CategoriesList: styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
  })),

  CategoryItem: styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(1),
    borderRadius: theme.spacing(1),
    backgroundColor: theme.palette.background.default,
  })),

  ColorDot: styled('span')(({ theme }) => ({
    width: theme.spacing(2),
    height: theme.spacing(2),
    borderRadius: '50%',
    marginRight: theme.spacing(1),
  })),
};

export default Styled; 