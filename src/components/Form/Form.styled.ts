import {styled} from "@mui/material/styles";

const FormRoot = styled('form', {
  name: 'MuiForm',
  slot: 'root',
})(({theme}) => ({
  background: theme.palette.background.paper,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));

export default FormRoot;
