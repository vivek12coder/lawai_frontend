import React from 'react';
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  Container,
  useTheme,
  IconButton,
  useMediaQuery,
  Menu,
  MenuItem,
  useScrollTrigger,
  Typography,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import GavelIcon from '@mui/icons-material/Gavel';
import MenuIcon from '@mui/icons-material/Menu';

const Navbar: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  // Add scroll trigger for navbar background opacity
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100,
  });

  const menuItems = [
    { label: 'Home', path: '/' },
    { label: 'Features', path: '/#features' },
    { label: 'About', path: '/#about' },
    { label: 'Chat', path: '/chat' },
    { label: 'Document Analyzer', path: '/document-analyzer' },
  ];

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNavigation = (path: string) => {
    handleMenuClose();
    if (location.pathname === '/' && path.includes('#')) {
      const element = document.getElementById(path.split('#')[1]);
      element?.scrollIntoView({ behavior: 'smooth' });
    } else if (path === '/' || !path.includes('#')) {
      navigate(path);
    } else {
      navigate(path.split('#')[0]);
      setTimeout(() => {
        const element = document.getElementById(path.split('#')[1]);
        element?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <AppBar 
      position="fixed" 
      elevation={0}
      sx={{ 
        background: trigger 
          ? 'rgba(10, 25, 41, 0.95)'
          : 'rgba(10, 25, 41, 0.5)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        transition: 'all 0.3s ease-in-out',
      }}
    >
      <Container maxWidth="lg">
        <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 1, sm: 2 }, minHeight: '64px' }}>
          {/* Logo */}
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              cursor: 'pointer',
              gap: 1,
            }}
            onClick={() => navigate('/')}
          >
            <GavelIcon 
              sx={{ 
                fontSize: 32, 
                color: theme.palette.primary.main,
              }} 
            />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 'bold',
                background: 'linear-gradient(45deg, #4a90e2, #79c7ff)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Legal AI
            </Typography>
          </Box>

          {/* Desktop Menu */}
          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              {menuItems.map((item) => (
                <Button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  sx={{
                    color: 'white',
                    px: 3,
                    py: 1,
                    borderRadius: 2,
                    boxSizing: 'border-box',
                    border: '1px solid transparent', // reserve space to avoid shift
                    lineHeight: 1.25,
                    position: 'relative',
                    overflow: 'visible',
                    boxShadow: 'none',
                    textShadow: 'none',
                    filter: 'none',
                    transition: 'none',
                    backgroundColor: location.pathname === item.path || 
                      (location.pathname === '/' && item.path.includes(location.hash)) 
                        ? 'rgba(255,255,255,0.1)' 
                        : 'transparent',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      boxShadow: 'none',
                      filter: 'none',
                      transform: 'none',
                      borderColor: 'transparent',
                      padding: undefined, // ensure no change
                      margin: undefined,
                    },
                    '&:focus,&.Mui-focusVisible': {
                      outline: 'none',
                      boxShadow: 'none',
                    },
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          )}

          {/* Mobile Menu */}
          {isMobile && (
            <>
              <IconButton
                color="inherit"
                edge="end"
                onClick={handleMenuClick}
                sx={{}}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                  sx: {
                    background: 'rgba(10, 25, 41, 0.95)',
                    backdropFilter: 'blur(10px)',
                    mt: 1,
                    border: '1px solid rgba(255,255,255,0.1)',
                  }
                }}
              >
                {menuItems.map((item) => (
                  <MenuItem 
                    key={item.path} 
                    onClick={() => handleNavigation(item.path)}
                    sx={{
                      color: 'white',
                      minWidth: 150,
                      boxSizing: 'border-box',
                      border: '1px solid transparent',
                      lineHeight: 1.25,
                      transition: 'none',
                      '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        transform: 'none',
                        borderColor: 'transparent',
                      },
                    }}
                  >
                    {item.label}
                  </MenuItem>
                ))}
              </Menu>
            </>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;