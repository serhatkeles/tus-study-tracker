import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { entriesAPI } from '../services/api';

const Analytics = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [loading, setLoading] = useState(true);
  const [dailyData, setDailyData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [topSubjects, setTopSubjects] = useState([]);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const { entries } = await entriesAPI.getAll();

      // 1. Son 7 günlük günlük çalışma
      const last7Days = getLast7Days();
      const dailyMap = {};
      
      last7Days.forEach(date => {
        dailyMap[date] = 0;
      });

      entries.forEach(entry => {
        const entryDate = entry.date.split('T')[0]; // ISO date'i normalize et
        if (dailyMap.hasOwnProperty(entryDate)) {
          dailyMap[entryDate] += parseFloat(entry.hours) || 0;
        }
      });

      const dailyChartData = last7Days.map(date => ({
        date: new Date(date).toLocaleDateString('tr-TR', { day: '2-digit', month: 'short' }),
        saat: Math.round(dailyMap[date] * 10) / 10,
      }));

      // 2. Temel vs Klinik
      const temelSubjects = ['Anatomi', 'Histoloji-Embriyoloji', 'Fizyoloji', 'Biyokimya', 'Mikrobiyoloji', 'Patoloji', 'Tıbbi Genetik'];
      let temelTotal = 0;
      let klinikTotal = 0;

      entries.forEach(entry => {
        const hours = parseFloat(entry.hours) || 0;
        if (temelSubjects.includes(entry.subject)) {
          temelTotal += hours;
        } else {
          klinikTotal += hours;
        }
      });

      const categoryChartData = [
        { name: '🔬 Temel Tıp', value: Math.round(temelTotal * 10) / 10, displayValue: `${Math.round(temelTotal * 10) / 10}h` },
        { name: '🩺 Klinik Tıp', value: Math.round(klinikTotal * 10) / 10, displayValue: `${Math.round(klinikTotal * 10) / 10}h` },
      ];

      // 3. En çok çalışılan 5 konu
      const subjectMap = {};
      entries.forEach(entry => {
        const hours = parseFloat(entry.hours) || 0;
        subjectMap[entry.subject] = (subjectMap[entry.subject] || 0) + hours;
      });

      const topSubjectsData = Object.entries(subjectMap)
        .map(([subject, hours]) => ({
          konu: subject.length > 15 ? subject.substring(0, 15) + '...' : subject,
          fullKonu: subject,
          saat: Math.round(hours * 10) / 10,
        }))
        .sort((a, b) => b.saat - a.saat)
        .slice(0, 5);

      setDailyData(dailyChartData);
      setCategoryData(categoryChartData);
      setTopSubjects(topSubjectsData);
    } catch (error) {
      console.error('Analytics fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getLast7Days = () => {
    const dates = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  const COLORS = ['#2196F3', '#9c27b0'];
  const BAR_COLORS = ['#4caf50', '#2196F3', '#ff9800', '#e91e63', '#9c27b0'];

  // Custom label for pie chart
  const renderPieLabel = (entry) => {
    return `${entry.name}: ${entry.displayValue}`;
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            bgcolor: 'rgba(0, 0, 0, 0.9)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: 2,
            p: 1.5,
            color: 'white',
          }}
        >
          <Typography variant="body2" fontWeight="bold">
            {payload[0].payload.fullKonu || payload[0].name || payload[0].payload.konu}
          </Typography>
          <Typography variant="body2" color="#4caf50">
            {payload[0].value} saat
          </Typography>
        </Box>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 'calc(100vh - 64px)',
        }}
      >
        <CircularProgress size={60} sx={{ color: 'white' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: 'calc(100vh - 64px)', pb: { xs: 8, md: 6 }, px: { xs: 2, sm: 3, md: 4 } }}>
      <Container maxWidth="xl" disableGutters sx={{ py: { xs: 2, md: 4 } }}>
        <Typography
          variant={isMobile ? 'h5' : 'h4'}
          fontWeight="bold"
          gutterBottom
          sx={{
            color: 'white',
            mb: 3,
            textAlign: 'center',
          }}
        >
          📊 Çalışma İstatistikleri
        </Typography>

        <Grid container spacing={{ xs: 2, md: 3 }}>
          {/* Son 7 Günde Günlük Çalışma */}
          <Grid item xs={12} sx={{ width: { xs: '100%', md: 'auto' } }}>
            <Card
              sx={{
                width: '100%',
                bgcolor: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                <Typography 
                  variant="h6" 
                  fontWeight="bold" 
                  color="white" 
                  gutterBottom
                  sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}
                >
                  📈 Son 7 Günde Günlük Çalışma
                </Typography>
                <Box sx={{ width: '100%', height: { xs: 250, md: 300 } }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart 
                      data={dailyData}
                      margin={{ top: 5, right: 5, left: -20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis 
                        dataKey="date" 
                        stroke="white" 
                        tick={{ fontSize: isMobile ? 10 : 12 }}
                        angle={isMobile ? -45 : 0}
                        textAnchor={isMobile ? 'end' : 'middle'}
                        height={isMobile ? 60 : 30}
                      />
                      <YAxis 
                        stroke="white"
                        tick={{ fontSize: isMobile ? 10 : 12 }}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      {!isMobile && <Legend />}
                      <Line
                        type="monotone"
                        dataKey="saat"
                        stroke="#2196F3"
                        strokeWidth={3}
                        dot={{ fill: '#2196F3', r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Temel vs Klinik */}
          <Grid item xs={12} md={6} sx={{ width: { xs: '100%', md: 'auto' } }}>
            <Card
              sx={{
                width: '100%',
                bgcolor: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                height: '100%',
              }}
            >
              <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                <Typography 
                  variant="h6" 
                  fontWeight="bold" 
                  color="white" 
                  gutterBottom
                  sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}
                >
                  🍩 Temel vs Klinik Dağılımı
                </Typography>
                <Box sx={{ width: '100%', height: { xs: 280, md: 300 } }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="45%"
                        labelLine={false}
                        label={isMobile ? false : renderPieLabel}
                        outerRadius={isMobile ? 70 : 90}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index]} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend 
                        verticalAlign="bottom"
                        align="center"
                        layout="horizontal"
                        iconType="circle"
                        wrapperStyle={{ fontSize: isMobile ? '11px' : '14px' }}
                        formatter={(value, entry) => (
                          <span style={{ color: 'white' }}>
                            {value} ({entry.payload.displayValue})
                          </span>
                        )}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Top 5 Konular */}
          <Grid item xs={12} md={6} sx={{ width: { xs: '100%', md: 'auto' } }}>
            <Card
              sx={{
                width: '100%',
                bgcolor: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                height: '100%',
              }}
            >
              <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                <Typography 
                  variant="h6" 
                  fontWeight="bold" 
                  color="white" 
                  gutterBottom
                  sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}
                >
                  🏆 En Çok Çalışılan 5 Konu
                </Typography>
                <Box sx={{ width: '100%', height: { xs: 280, md: 300 } }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={topSubjects} 
                      layout="vertical"
                      margin={{ top: 5, right: 20, left: isMobile ? 5 : 10, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis 
                        type="number" 
                        stroke="white"
                        tick={{ fontSize: isMobile ? 9 : 11 }}
                      />
                      <YAxis 
                        dataKey="konu" 
                        type="category" 
                        stroke="white" 
                        width={isMobile ? 70 : 110}
                        tick={{ fontSize: isMobile ? 9 : 11 }}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="saat" radius={[0, 8, 8, 0]}>
                        {topSubjects.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={BAR_COLORS[index]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Analytics;