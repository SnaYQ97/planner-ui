import { useState } from 'react';
import { Menu, MenuItem, IconButton } from '@mui/material';
import { AccountCircle, Settings, Logout } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from '@selectors/user.selector.ts';
import { setUser, User } from '@reducer/user.reducer.ts';
import AuthService from '@services/AuthService/Auth.service.ts';
import { Path } from '@main';

export const UserMenu = () => {
  const user = useSelector(getUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSettings = () => {
    navigate(Path.SETTINGS);
    handleClose();
  };

  const handleLogout = () => {
    AuthService().logout().then(() => {
      dispatch(setUser({} as User));
      navigate(Path.SIGNIN);
      handleClose();
    });
  };

  if (!user) return null;

  return (
    <>
      <IconButton
        size="large"
        aria-label="konto użytkownika"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleMenu}
        color="inherit"
      >
        <AccountCircle />
      </IconButton>
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleSettings}>
          <Settings sx={{ mr: 1 }} />
          Ustawienia
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <Logout sx={{ mr: 1 }} />
          Wyloguj
        </MenuItem>
      </Menu>
    </>
  );
};
