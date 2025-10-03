require('dotenv').config();
const express = require('express');
const cors = require('cors');
const entriesRouter = require('./routes/entries');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://tus-study-tracker.vercel.app',
    process.env.FRONTEND_URL
  ],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/entries', entriesRouter);

app.get('/', (req, res) => {
  res.json({ 
    message: 'Study Tracker API',
    status: 'running',
    timestamp: new Date().toISOString()
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Bir şeyler yanlış gitti!' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server çalışıyor: http://localhost:${PORT}`);
});

module.exports = app;