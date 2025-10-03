import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import TUSEntryForm from '../components/TUSEntryForm';
import EntryList from '../components/EntryList';
import WeeklySummary from '../components/WeeklySummary';
import StatCard from '../components/StatCard';
import { entriesAPI } from '../services/api';

const Dashboard = () => {
  const [entries, setEntries] = useState([]);
  const [subjects, setSubjects] = useState(null);
  const [stats, setStats] = useState({});
  const [weeklySummary, setWeeklySummary] = useState([]);
  const [totalHours, setTotalHours] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [entriesData, summaryData, totalData, subjectsData, statsData] = await Promise.all([
        entriesAPI.getAll(),
        entriesAPI.getWeeklySummary(),
        entriesAPI.getTotalHours(),
        entriesAPI.getSubjects(),
        entriesAPI.getStatsBySubject(),
      ]);

      setEntries(entriesData.entries || []);
      setWeeklySummary(summaryData.summary || []);
      setTotalHours(totalData.totalHours || 0);
      setSubjects(subjectsData);
      setStats(statsData.stats || {});
      setError('');
    } catch (err) {
      setError('Veriler yüklenirken bir hata oluştu. Backend çalışıyor mu?');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEntryAdded = async (formData) => {
    await entriesAPI.create(formData);
    fetchData();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bu kaydı silmek istediğinden emin misin?')) {
      try {
        await entriesAPI.delete(id);
        fetchData();
      } catch (err) {
        alert('Silme işlemi başarısız oldu!');
      }
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 64px)' }}>
        <CircularProgress size={60} sx={{ color: 'white' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: 'calc(100vh - 64px)', pb: { xs: 4, md: 6 }, px: { xs: 2, sm: 3, md: 4 } }}>
      <Container maxWidth="xl" disableGutters sx={{ py: { xs: 2, md: 4 } }}>
        {/* Header */}
        <Box sx={{ mb: { xs: 2, md: 4 }, textAlign: 'center' }}>
          <Typography
            variant="h3"
            fontWeight="bold"
            gutterBottom
            sx={{
              fontSize: { xs: '1.75rem', md: '3rem' },
              background: 'linear-gradient(45deg, #ffffff 30%, #90caf9 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            🏥 TUS Study Tracker
          </Typography>
          <Typography 
            variant="subtitle1" 
            sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: { xs: '0.875rem', md: '1rem' } }}
          >
            Çalışma saatlerini takip et, TUS'ta başarıya ulaş! 🎯
          </Typography>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        {/* İstatistikler */}
        <Box sx={{ mb: { xs: 2, md: 4 } }}>
          <Grid container spacing={{ xs: 2, md: 3 }}>
            <Grid item xs={12} sm={6} sx={{ width: { xs: '100%', sm: 'auto' } }}>
              <StatCard title="Toplam Çalışma Saati" value={`${totalHours.toFixed(1)} saat`} icon="⏱️" color="primary" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <StatCard title="Toplam Kayıt" value={entries.length} icon="📝" color="secondary" />
            </Grid>
          </Grid>
        </Box>

        {/* Ana İçerik */}
        <Grid container spacing={{ xs: 2, md: 3 }}>
          <Grid item xs={12} lg={6} sx={{ width: { xs: '100%', lg: 'auto' } }}>
            {subjects && <TUSEntryForm subjects={subjects} stats={stats} onSubmit={handleEntryAdded} />}
          </Grid>
          <Grid item xs={12} lg={6} sx={{ width: { xs: '100%', lg: 'auto' } }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2, md: 3 } }}>
              <WeeklySummary summary={weeklySummary} />
              <EntryList entries={entries} onDelete={handleDelete} />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Dashboard;