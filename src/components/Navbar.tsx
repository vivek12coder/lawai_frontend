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
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05)',
              },
            }}
            onClick={() => navigate('/')}
          >
            <GavelIcon 
              sx={{ 
                fontSize: 32, 
                color: theme.palette.primary.main,
                filter: 'drop-shadow(0 0 8px rgba(74,144,226,0.3))',
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
                textShadow: '0 0 30px rgba(74,144,226,0.3)',
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
                    position: 'relative',
                    overflow: 'hidden',
                    backgroundColor: location.pathname === item.path || 
                      (location.pathname === '/' && item.path.includes(location.hash)) 
                        ? 'rgba(255,255,255,0.1)' 
                        : 'transparent',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      '&::after': {
                        transform: 'scaleX(1)',
                      },
                    },
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      width: '100%',
                      height: '2px',
                      backgroundColor: theme.palette.primary.main,
                      transform: 'scaleX(0)',
                      transformOrigin: 'right',
                      transition: 'transform 0.3s ease',
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
                sx={{
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.1)',
                  },
                }}
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
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        transform: 'translateX(5px)',
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