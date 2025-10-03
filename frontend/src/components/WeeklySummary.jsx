import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Box,
} from '@mui/material';

const WeeklySummary = ({ summary }) => {
  if (!summary || summary.length === 0) {
    return (
      <Card
        sx={{
          width: '100%',
          bgcolor: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          color: 'white',
        }}
      >
        <CardContent>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            📊 Haftalık Özet (Son 7 Gün)
          </Typography>
          <Typography sx={{ mt: 2, textAlign: 'center', color: 'rgba(255, 255, 255, 0.7)' }}>
            Son 7 günde kayıt bulunamadı
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const totalWeeklyHours = summary.reduce((sum, item) => sum + (parseFloat(item.total_hours) || 0), 0);

  return (
    <Card
      sx={{
        width: '100%',
        bgcolor: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        color: 'white',
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" fontWeight="bold">
            📊 Haftalık Özet
          </Typography>
          <Chip
            label={`${(totalWeeklyHours || 0).toFixed(1)} saat`}
            sx={{
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, #4caf50 30%, #81c784 90%)',
              color: 'white',
            }}
          />
        </Box>

        <TableContainer
          component={Paper}
          sx={{
            bgcolor: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Konu</TableCell>
                <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>
                  Oturum
                </TableCell>
                <TableCell align="right" sx={{ color: 'white', fontWeight: 'bold' }}>
                  Toplam
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {summary.map((item, index) => (
                <TableRow
                  key={index}
                  sx={{
                    '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' },
                  }}
                >
                  <TableCell sx={{ color: 'white' }}>{item.subject}</TableCell>
                  <TableCell align="center">
                    <Chip
                      label={item.entry_count}
                      size="small"
                      sx={{
                        bgcolor: 'rgba(255, 255, 255, 0.2)',
                        color: 'white',
                      }}
                    />
                  </TableCell>
                  <TableCell align="right" sx={{ color: 'white', fontWeight: 'bold' }}>
                    {(parseFloat(item.total_hours) || 0).toFixed(1)}h
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default WeeklySummary;