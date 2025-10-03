import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Chip,
  Box,
  Link,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Link as LinkIcon,
} from '@mui/icons-material';

const EntryList = ({ entries, onDelete }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  if (!entries || entries.length === 0) {
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
            📋 Son Çalışmalar
          </Typography>
          <Typography sx={{ mt: 2, textAlign: 'center', color: 'rgba(255, 255, 255, 0.7)' }}>
            Henüz kayıt eklenmemiş. İlk kaydını ekle! 🎯
          </Typography>
        </CardContent>
      </Card>
    );
  }

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
          📋 Son Çalışmalar ({entries.length} kayıt)
        </Typography>

        <List sx={{ maxHeight: 400, overflow: 'auto' }}>
          {entries.map((entry) => (
            <ListItem
              key={entry.id}
              sx={{
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: 2,
                mb: 1,
                bgcolor: 'rgba(255, 255, 255, 0.05)',
                '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' },
              }}
              secondaryAction={
                <IconButton
                  edge="end"
                  sx={{ color: '#f44336' }}
                  onClick={() => onDelete(entry.id)}
                  title="Sil"
                >
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="subtitle1" fontWeight="bold" sx={{ color: 'white' }}>
                      {entry.subject}
                    </Typography>
                    <Chip
                      label={`${entry.hours} saat`}
                      size="small"
                      sx={{
                        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                        color: 'white',
                        fontWeight: 'bold',
                      }}
                    />
                  </Box>
                }
                secondary={
                  <Box sx={{ mt: 0.5 }}>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      📅 {formatDate(entry.date)}
                    </Typography>
                    {entry.file_link && (
                      <Link
                        href={entry.file_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                          mt: 0.5,
                          color: '#90caf9',
                        }}
                      >
                        <LinkIcon fontSize="small" />
                        <Typography variant="body2">Dosyayı Aç</Typography>
                      </Link>
                    )}
                  </Box>
                }
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default EntryList;