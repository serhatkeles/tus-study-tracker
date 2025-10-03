import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

const StatCard = ({ title, value, icon, color = 'primary' }) => {
  const gradients = {
    primary: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
    secondary: 'linear-gradient(135deg, #9c27b0 0%, #ba68c8 100%)',
  };

  return (
    <Card
      elevation={0}
      sx={{
        width: '100%',
        background: gradients[color],
        color: 'white',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        backdropFilter: 'blur(20px)',
      }}
    >
      <CardContent sx={{ p: { xs: 2, md: 3 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, md: 2 } }}>
          <Typography variant="h2" component="div" sx={{ fontSize: { xs: '2.5rem', md: '3.75rem' } }}>
            {icon}
          </Typography>
          <Box>
            <Typography variant="h4" fontWeight="bold" sx={{ fontSize: { xs: '1.5rem', md: '2.125rem' } }}>
              {value}
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9, fontSize: { xs: '0.875rem', md: '1rem' } }}>
              {title}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default StatCard;