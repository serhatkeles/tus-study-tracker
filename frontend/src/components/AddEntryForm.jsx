import React, { useState } from 'react';
import {
  Card,
  CardContent,
  TextField,
  Button,
  Box,
  Typography,
  Alert,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

const AddEntryForm = ({ onEntryAdded }) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0], // Bugünün tarihi
    subject: '',
    hours: '',
    file_link: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validasyon
    if (!formData.subject || !formData.hours) {
      setError('Konu ve saat bilgisi zorunludur!');
      return;
    }

    if (parseFloat(formData.hours) <= 0) {
      setError('Saat 0\'dan büyük olmalıdır!');
      return;
    }

    try {
      await onEntryAdded(formData);
      setSuccess(true);
      
      // Formu temizle
      setFormData({
        date: new Date().toISOString().split('T')[0],
        subject: '',
        hours: '',
        file_link: '',
      });

      // Success mesajını 2 saniye sonra kaldır
      setTimeout(() => setSuccess(false), 2000);
    } catch (err) {
      setError('Kayıt eklenirken bir hata oluştu!');
    }
  };

  return (
    <Card elevation={3}>
      <CardContent>
        <Typography variant="h6" gutterBottom color="primary">
          📚 Yeni Çalışma Kaydı Ekle
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Kayıt başarıyla eklendi! ✅
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            type="date"
            label="Tarih"
            name="date"
            value={formData.date}
            onChange={handleChange}
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            fullWidth
            label="Konu"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            margin="normal"
            placeholder="Örn: Matematik, İngilizce, Fizik..."
          />

          <TextField
            fullWidth
            type="number"
            label="Çalışma Saati"
            name="hours"
            value={formData.hours}
            onChange={handleChange}
            margin="normal"
            inputProps={{ min: 0, step: 0.5 }}
            placeholder="Örn: 2.5"
          />

          <TextField
            fullWidth
            label="Dosya Linki (Opsiyonel)"
            name="file_link"
            value={formData.file_link}
            onChange={handleChange}
            margin="normal"
            placeholder="PDF, Google Drive linki vs."
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            startIcon={<AddIcon />}
            sx={{ mt: 2, py: 1.5 }}
          >
            Kaydet
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default AddEntryForm;