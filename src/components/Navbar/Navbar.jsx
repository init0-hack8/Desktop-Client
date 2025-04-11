import React from 'react';
import { AppBar, Toolbar, Typography, Avatar, Box, Button, Menu, MenuItem } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';

const Navbar = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate(); 

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (option) => {
    handleMenuClose();

    if (option === 'profile') {
      navigate('/profile');
    } else if (option === 'logout') {
      
      localStorage.removeItem('token'); 
      navigate('/login');
    }
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: '#333' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Hack 8
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button
            color="inherit"
            onClick={handleMenuClick}
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <Avatar alt="User Profile" src="/path-to-avatar.jpg" sx={{ mr: 1 }} />
            John Doe
          </Button>

          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={() => handleMenuItemClick('profile')}>Profile</MenuItem>
            <MenuItem onClick={() => handleMenuItemClick('logout')}>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
