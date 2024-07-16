import {styled} from "@mui/material/styles";
import Box from "@mui/material/Box";

const Styled = {
  LoginRoot: styled(Box, {
    name: 'MuiLoginRoot',
    slot: 'root',
  })(({theme}) => ({
    background: theme.palette.background.paper,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center' as const,
    width: '100%',
    minHeight: '100%',
  })),
  LoginBox: styled(Box, {
    name: 'MuiLoginBox',
    slot: 'root',
  })(({theme}) => ({
    background: theme.palette.background.paper,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    gap: theme.spacing(5),
    padding: theme.spacing(5),
    flex: 1,
  })),
  Background: styled("img", {
    name: 'MuiBackground',
    slot: 'root',
  })(({theme}) => ({
    background: theme.palette.background.paper,
    width: '70%',
  })),
}

export default Styled;
