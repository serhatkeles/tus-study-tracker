import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
  Tabs,
  Tab,
  useMediaQuery,
  useTheme,
  Chip,
  Stack,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Save as SaveIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';

const TUSEntryForm = ({ subjects, stats, onSubmit }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [selectedCategory, setSelectedCategory] = useState('temel');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [hours, setHours] = useState({});
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleHourChange = (subject, value) => {
    setHours({
      ...hours,
      [subject]: value,
    });
  };

  const handleSubmit = async () => {
    // Girilen saatleri filtrele (boş olmayanlar)
    const entries = Object.entries(hours)
      .filter(([_, hour]) => hour && parseFloat(hour) > 0)
      .map(([subject, hour]) => ({
        date,
        subject,
        hours: parseFloat(hour),
      }));

    if (entries.length === 0) {
      setError('En az bir konuya saat girmelisin!');
      return;
    }

    try {
      // Her konu için ayrı ayrı kayıt gönder
      for (const entry of entries) {
        await onSubmit(entry);
      }
      
      setSuccess(true);
      setHours({}); // Formu temizle
      setError('');
      
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Kayıt eklenirken hata oluştu!');
    }
  };

  const renderSubjectInputs = (category) => {
    const categoryData = subjects[category];
    
    return (
      <Box>
        {categoryData.subjects.map((subject) => {
          const subjectStats = stats[subject] || { weekly: 0, total: 0 };
          
          return (
            <Accordion
              key={subject}
              sx={{
                mb: 1,
                bgcolor: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                '&:before': { display: 'none' },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}
                sx={{ color: 'white' }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', pr: 2 }}>
                  <Typography fontWeight="500">{subject}</Typography>
                  {subjectStats.total > 0 && (
                    <Chip
                      icon={<TrendingUpIcon />}
                      label={`${(subjectStats.weekly || 0).toFixed(1)}h`}
                      size="small"
                      sx={{
                        background: 'linear-gradient(45deg, #4caf50 30%, #81c784 90%)',
                        color: 'white',
                        fontWeight: 'bold',
                      }}
                    />
                  )}
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                {/* İstatistikler */}
                <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                  <Chip
                    label={`Bu Hafta: ${(subjectStats.weekly || 0).toFixed(1)} saat`}
                    size="small"
                    sx={{
                      bgcolor: 'rgba(76, 175, 80, 0.2)',
                      color: '#81c784',
                      border: '1px solid #81c784',
                      fontWeight: 'bold',
                    }}
                  />
                  <Chip
                    label={`Toplam: ${(subjectStats.total || 0).toFixed(1)} saat`}
                    size="small"
                    sx={{
                      bgcolor: 'rgba(33, 150, 243, 0.2)',
                      color: '#64b5f6',
                      border: '1px solid #64b5f6',
                      fontWeight: 'bold',
                    }}
                  />
                </Stack>

                {/* Saat Girişi */}
                <TextField
                  fullWidth
                  type="number"
                  label="Bugün Çalışma Saati"
                  value={hours[subject] || ''}
                  onChange={(e) => handleHourChange(subject, e.target.value)}
                  inputProps={{ min: 0, step: 0.5 }}
                  placeholder="Örn: 2.5"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                      '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                      '&.Mui-focused fieldset': { borderColor: '#2196F3' },
                    },
                    '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                  }}
                />
              </AccordionDetails>
            </Accordion>
          );
        })}
      </Box>
    );
  };

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
      <CardContent sx={{ p: { xs: 2, md: 3 } }}>
        <Typography variant="h6" gutterBottom fontWeight="bold">
          📚 Günlük Çalışma Kaydı
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Kayıtlar başarıyla eklendi! ✅
          </Alert>
        )}

        <TextField
          fullWidth
          type="date"
          label="Tarih"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          margin="normal"
          InputLabelProps={{ shrink: true }}
          sx={{
            mb: 3,
            '& .MuiOutlinedInput-root': {
              color: 'white',
              '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
              '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
            },
            '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
          }}
        />

        {/* Mobilde Tab, Desktop'ta Yan Yana */}
        {isMobile ? (
          <>
            <Tabs
              value={selectedCategory}
              onChange={(e, val) => setSelectedCategory(val)}
              variant="fullWidth"
              sx={{
                mb: 2,
                '& .MuiTab-root': { color: 'rgba(255, 255, 255, 0.7)' },
                '& .Mui-selected': { color: 'white !important' },
              }}
            >
              <Tab label="🔬 Temel" value="temel" />
              <Tab label="🩺 Klinik" value="klinik" />
            </Tabs>
            {renderSubjectInputs(selectedCategory)}
          </>
        ) : (
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                🔬 Temel Tıp Bilimleri
              </Typography>
              {renderSubjectInputs('temel')}
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                🩺 Klinik Tıp Bilimleri
              </Typography>
              {renderSubjectInputs('klinik')}
            </Box>
          </Box>
        )}

        <Button
          fullWidth
          variant="contained"
          size="large"
          startIcon={<SaveIcon />}
          onClick={handleSubmit}
          sx={{
            mt: 3,
            py: 1.5,
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            fontWeight: 'bold',
          }}
        >
          Kaydet
        </Button>
      </CardContent>
    </Card>
  );
};

export default TUSEntryForm;