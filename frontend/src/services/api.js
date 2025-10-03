import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';

// Axios instance oluştur
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API fonksiyonları
export const entriesAPI = {
  // Tüm kayıtları getir
  getAll: async () => {
    const response = await api.get('/entries');
    return response.data;
  },

  // Yeni kayıt ekle
  create: async (entryData) => {
    const response = await api.post('/entries', entryData);
    return response.data;
  },

  // Kayıt sil
  delete: async (id) => {
    const response = await api.delete(`/entries/${id}`);
    return response.data;
  },

  // Haftalık özet
  getWeeklySummary: async () => {
    const response = await api.get('/entries/weekly-summary');
    return response.data;
  },

  // Toplam saat
  getTotalHours: async () => {
    const response = await api.get('/entries/total-hours');
    return response.data;
  },

  // Konu listesini getir
  getSubjects: async () => {
    const response = await api.get('/entries/subjects');
    return response.data;
  },

  // Konulara göre istatistikler
  getStatsBySubject: async () => {
    const response = await api.get('/entries/stats-by-subject');
    return response.data;
  },
};

export default api;