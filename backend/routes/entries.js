const express = require('express');
const router = express.Router();
const pool = require('../models/database');
const SUBJECTS = require('../models/subjects');

// Konu listesi
router.get('/subjects', (req, res) => {
  res.json(SUBJECTS);
});

// Tüm kayıtlar
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM entries ORDER BY date DESC, created_at DESC'
    );
    res.json({ entries: result.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Yeni kayıt
router.post('/', async (req, res) => {
  const { date, subject, hours, file_link } = req.body;
  
  if (!date || !subject || !hours) {
    return res.status(400).json({ error: 'Tarih, konu ve saat zorunlu' });
  }
  
  try {
    const result = await pool.query(
      'INSERT INTO entries (date, subject, hours, file_link) VALUES ($1, $2, $3, $4) RETURNING id',
      [date, subject, parseFloat(hours), file_link || null]
    );
    res.status(201).json({ message: 'Kayıt eklendi', id: result.rows[0].id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Haftalık özet
router.get('/weekly-summary', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        subject,
        SUM(hours) as total_hours,
        COUNT(*) as entry_count
      FROM entries
      WHERE date >= CURRENT_DATE - INTERVAL '7 days'
      GROUP BY subject
      ORDER BY total_hours DESC
    `);
    res.json({ summary: result.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Toplam saat
router.get('/total-hours', async (req, res) => {
  try {
    const result = await pool.query('SELECT SUM(hours) as total FROM entries');
    res.json({ totalHours: result.rows[0].total || 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Konulara göre stats
router.get('/stats-by-subject', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        subject,
        SUM(CASE WHEN date >= CURRENT_DATE - INTERVAL '7 days' THEN hours ELSE 0 END) as weekly_hours,
        SUM(hours) as total_hours
      FROM entries
      GROUP BY subject
    `);
    
    const stats = {};
    result.rows.forEach(row => {
      stats[row.subject] = {
        weekly: parseFloat(row.weekly_hours) || 0,
        total: parseFloat(row.total_hours) || 0
      };
    });
    
    res.json({ stats });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Kayıt sil
router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM entries WHERE id = $1',
      [req.params.id]
    );
    
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Kayıt bulunamadı' });
    }
    res.json({ message: 'Kayıt silindi' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;