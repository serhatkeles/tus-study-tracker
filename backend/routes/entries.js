const express = require('express');
const router = express.Router();
const db = require('../models/database');
const SUBJECTS = require('../models/subjects');

// Konu listesini döndür
router.get('/subjects', (req, res) => {
  res.json(SUBJECTS);
});

// Tüm kayıtları getir
router.get('/', (req, res) => {
  const sql = 'SELECT * FROM entries ORDER BY date DESC, created_at DESC';
  
  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ entries: rows });
  });
});

// Yeni kayıt ekle
router.post('/', (req, res) => {
  const { date, subject, hours, file_link } = req.body;
  
  // Validation
  if (!date || !subject || !hours) {
    return res.status(400).json({ error: 'Tarih, konu ve saat bilgisi zorunludur' });
  }
  
  const sql = 'INSERT INTO entries (date, subject, hours, file_link) VALUES (?, ?, ?, ?)';
  const params = [date, subject, parseFloat(hours), file_link || null];
  
  db.run(sql, params, function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({
      message: 'Kayıt eklendi',
      id: this.lastID
    });
  });
});

// Haftalık özet (son 7 gün)
router.get('/weekly-summary', (req, res) => {
  const sql = `
    SELECT 
      subject,
      SUM(hours) as total_hours,
      COUNT(*) as entry_count
    FROM entries
    WHERE date >= date('now', '-7 days')
    GROUP BY subject
    ORDER BY total_hours DESC
  `;
  
  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ summary: rows });
  });
});

// Genel toplam saat
router.get('/total-hours', (req, res) => {
  const sql = 'SELECT SUM(hours) as total FROM entries';
  
  db.get(sql, [], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ totalHours: row.total || 0 });
  });
});

// Kayıt sil
router.delete('/:id', (req, res) => {
  const sql = 'DELETE FROM entries WHERE id = ?';
  
  db.run(sql, [req.params.id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Kayıt bulunamadı' });
    }
    res.json({ message: 'Kayıt silindi' });
  });
});

// Konulara göre istatistik (haftalık ve toplam)
router.get('/stats-by-subject', (req, res) => {
  const sql = `
    SELECT 
      subject,
      SUM(CASE WHEN date >= date('now', '-7 days') THEN hours ELSE 0 END) as weekly_hours,
      SUM(hours) as total_hours
    FROM entries
    GROUP BY subject
  `;
  
  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    // Object formatına çevir (kolay erişim için)
    const stats = {};
    rows.forEach(row => {
      stats[row.subject] = {
        weekly: row.weekly_hours || 0,
        total: row.total_hours || 0
      };
    });
    
    res.json({ stats });
  });
});

module.exports = router;