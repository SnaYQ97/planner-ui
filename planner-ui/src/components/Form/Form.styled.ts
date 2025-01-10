import {styled} from "@mui/material/styles";

const FormRoot = styled('form', {
  name: 'MuiForm',
  slot: 'root',
})(({theme}) => ({
  background: 'transparent',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));

export default FormRoot;
