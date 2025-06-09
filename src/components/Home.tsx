import React, { useEffect, useRef } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Paper,
  Grid,
  useTheme,
  alpha,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import GavelIcon from '@mui/icons-material/Gavel';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import ChatIcon from '@mui/icons-material/Chat';
import BalanceIcon from '@mui/icons-material/Balance';
import Navbar from './Navbar';

const Home: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const features = [
    {
      icon: <SmartToyIcon sx={{ fontSize: 40 }} />,
      title: 'AI-Powered Legal Assistant',
      description: 'Get instant, accurate answers to your legal questions using advanced artificial intelligence.'
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 40 }} />,
      title: 'Reliable Information',
      description: 'Access verified legal information based on Indian law and regulations.'
    },
    {
      icon: <SpeedIcon sx={{ fontSize: 40 }} />,
      title: 'Quick Responses',
      description: 'Receive immediate responses to your queries with detailed explanations and references.'
    },
    {
      icon: <ChatIcon sx={{ fontSize: 40 }} />,
      title: 'Interactive Chat',
      description: 'Engage in natural conversations about legal matters in a user-friendly interface.'
    }
  ];

  // Particle animation effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Array<{
      x: number;
      y: number;
      dx: number;
      dy: number;
      size: number;
    }> = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      createParticles(); // Recreate particles when canvas is resized
    };

    const createParticles = () => {
      particles = [];
      const numberOfParticles = Math.min(
        Math.floor((canvas.width * canvas.height) / 15000),
        100 // Cap maximum particles
      );
      
      for (let i = 0; i < numberOfParticles; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          dx: (Math.random() - 0.5) * 0.5,
          dy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 2,
        });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        particle.x += particle.dx;
        particle.y += particle.dy;

        // Wrap particles around screen edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(74, 144, 226, 0.3)';
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    // Initial setup
    resizeCanvas();
    animate();

    // Add event listener for window resize
    window.addEventListener('resize', resizeCanvas);

    // Cleanup function
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []); // Empty dependency array since we don't need to re-run this effect

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <Navbar />
      
      {/* Background Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          background: 'linear-gradient(135deg, #0a192f 0%, #0d2440 100%)',
        }}
      />

      {/* Main Content */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Hero Section */}
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Container maxWidth="lg">
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                alignItems: 'center',
                gap: { xs: 4, md: 8 },
                py: 4,
              }}
            >
              {/* Left Content */}
              <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' } }}>
                <Box sx={{ mb: 4 }}>
                  <Typography
                    variant="h2"
                    sx={{
                      fontWeight: 700,
                      mb: 2,
                      background: 'linear-gradient(45deg, #4a90e2, #79c7ff)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      textShadow: '0 0 30px rgba(74,144,226,0.3)',
                    }}
                  >
                    Legal AI Assistant
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{
                      color: 'rgba(255,255,255,0.9)',
                      fontWeight: 400,
                      lineHeight: 1.4,
                      mb: 4,
                    }}
                  >
                    Your Intelligent Legal Companion for Indian Law
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: alpha('#fff', 0.7),
                      fontSize: '1.1rem',
                      maxWidth: '600px',
                      mx: { xs: 'auto', md: 0 },
                    }}
                  >
                    Get instant, accurate answers to your legal questions using advanced AI technology.
                    Navigate Indian law with confidence and clarity.
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 2, justifyContent: { xs: 'center', md: 'flex-start' } }}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate('/chat')}
                    sx={{
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem',
                      backgroundColor: theme.palette.primary.main,
                      borderRadius: 2,
                      textTransform: 'none',
                      '&:hover': {
                        backgroundColor: theme.palette.primary.dark,
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 20px rgba(74,144,226,0.4)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    Start Chat Now
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => {
                      const element = document.getElementById('features');
                      element?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    sx={{
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem',
                      borderColor: alpha(theme.palette.primary.main, 0.5),
                      color: theme.palette.primary.main,
                      borderRadius: 2,
                      textTransform: 'none',
                      '&:hover': {
                        borderColor: theme.palette.primary.main,
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      },
                    }}
                  >
                    Learn More
                  </Button>
                </Box>
              </Box>

              {/* Right Content - Decorative Elements */}
              <Box
                sx={{
                  flex: 1,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  position: 'relative',
                }}
              >
                <Box
                  sx={{
                    width: '400px',
                    height: '400px',
                    position: 'relative',
                    animation: 'float 6s ease-in-out infinite',
                    '@keyframes float': {
                      '0%, 100%': {
                        transform: 'translateY(0px)',
                      },
                      '50%': {
                        transform: 'translateY(-20px)',
                      },
                    },
                  }}
                >
                  {/* Circular Background */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '300px',
                      height: '300px',
                      borderRadius: '50%',
                      background: 'radial-gradient(circle, rgba(74,144,226,0.1) 0%, rgba(74,144,226,0) 70%)',
                      animation: 'pulse 4s ease-in-out infinite',
                      '@keyframes pulse': {
                        '0%, 100%': {
                          transform: 'translate(-50%, -50%) scale(1)',
                          opacity: 0.5,
                        },
                        '50%': {
                          transform: 'translate(-50%, -50%) scale(1.2)',
                          opacity: 0.8,
                        },
                      },
                    }}
                  />

                  {/* Icons */}
                  <GavelIcon
                    sx={{
                      position: 'absolute',
                      top: '30%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      fontSize: '80px',
                      color: theme.palette.primary.main,
                      filter: 'drop-shadow(0 0 20px rgba(74,144,226,0.5))',
                    }}
                  />
                  <BalanceIcon
                    sx={{
                      position: 'absolute',
                      bottom: '30%',
                      left: '50%',
                      transform: 'translate(-50%, 50%)',
                      fontSize: '80px',
                      color: alpha(theme.palette.primary.main, 0.7),
                      filter: 'drop-shadow(0 0 20px rgba(74,144,226,0.3))',
                    }}
                  />
                </Box>
              </Box>
            </Box>
          </Container>
        </Box>

        {/* Features Section */}
        <Box id="features" sx={{ py: 8, backgroundColor: 'rgba(10, 25, 41, 0.3)' }}>
          <Container maxWidth="lg">
            <Typography
              variant="h4"
              align="center"
              sx={{
                mb: 8,
                fontWeight: 'bold',
                color: theme.palette.primary.main
              }}
            >
              Key Features
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(4, 1fr)' }, gap: 4, px: { xs: 2, md: 0 } }}>
              {features.map((feature, index) => (
                <Paper
                  key={index}
                  elevation={0}
                  sx={{
                    p: 4,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    background: 'linear-gradient(135deg, rgba(74,144,226,0.1) 0%, rgba(230,179,74,0.1) 100%)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 2,
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 8px 20px -12px rgba(74,144,226,0.5)',
                      background: 'linear-gradient(135deg, rgba(74,144,226,0.15) 0%, rgba(230,179,74,0.15) 100%)',
                    }
                  }}
                >
                  <Box 
                    sx={{ 
                      color: theme.palette.primary.main, 
                      mb: 3,
                      p: 2,
                      borderRadius: '50%',
                      background: 'rgba(74,144,226,0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 80,
                      height: 80,
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      mb: 2,
                      fontWeight: 'bold',
                      background: 'linear-gradient(45deg, #4a90e2, #e6b34a)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography 
                    variant="body1" 
                    color="text.secondary"
                    sx={{ 
                      lineHeight: 1.7,
                      opacity: 0.9
                    }}
                  >
                    {feature.description}
                  </Typography>
                </Paper>
              ))}
            </Box>
          </Container>
        </Box>

        {/* About Section */}
        <Box 
          id="about" 
          sx={{ 
            py: 8,
            background: 'linear-gradient(135deg, rgba(74,144,226,0.05) 0%, rgba(230,179,74,0.05) 100%)',
          }}
        >
          <Container maxWidth="md">
            <Typography
              variant="h4"
              align="center"
              sx={{
                mb: 4,
                fontWeight: 'bold',
                color: theme.palette.primary.main
              }}
            >
              About Legal AI Assistant
            </Typography>
            <Typography 
              variant="body1" 
              align="center" 
              color="text.secondary"
              sx={{ mb: 3 }}
            >
              Legal AI Assistant is your intelligent companion for navigating Indian law. 
              Our advanced AI system provides accurate, reliable answers to your legal questions, 
              making legal information more accessible to everyone.
            </Typography>
            <Typography 
              variant="body1" 
              align="center" 
              color="text.secondary"
            >
              Whether you're a legal professional, student, or someone seeking legal information, 
              our AI assistant is here to help you understand Indian law better with instant, 
              well-researched responses.
            </Typography>
          </Container>
        </Box>

        {/* Footer */}
        <Box
          sx={{
            mt: 'auto',
            py: 4,
            borderTop: '1px solid rgba(255,255,255,0.1)',
            textAlign: 'center',
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} Legal AI Assistant. All rights reserved.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Home; 