import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || '/api';

const api = {
  // Authentification
  register: (userData) => axios.post(`${API_URL}/register`, userData),
  login: (credentials) => axios.post(`${API_URL}/login`, credentials),
  verifyEmail: (data) => axios.post(`${API_URL}/verify-email`, data),
  forgotPassword: (data) => axios.post(`${API_URL}/forgot-password`, data),
  resetPassword: (data) => axios.post(`${API_URL}/reset-password`, data),
  getUsers: () => axios.get(`${API_URL}/users`),

  // Cours
  getCourses: () => axios.get(`${API_URL}/courses`),
  getCourse: (courseId) => axios.get(`${API_URL}/courses/${courseId}`),
  getModuleLessons: (moduleId) => axios.get(`${API_URL}/courses/modules/${moduleId}/lessons`),

  // Inscription / Paiement
  enrollCourse: (userId, courseId, paymentMethod) =>
    axios.post(`${API_URL}/enroll`, { user_id: userId, course_id: courseId, payment_method: paymentMethod }),
  checkout: (data) => axios.post(`${API_URL}/checkout`, data),
  getTransactions: (userId) => axios.get(`${API_URL}/transactions/${userId}`),
  getUserEnrollments: (userId) => axios.get(`${API_URL}/mycourses?user_id=${userId}`),

  // Progression / Quiz
  getQuiz: (lessonId) => axios.get(`${API_URL}/quiz?lesson_id=${lessonId}`),
  submitQuiz: (userId, lessonId, answer) =>
    axios.post(`${API_URL}/quiz/submit`, { user_id: userId, lesson_id: lessonId, answer }),
  getProgress: (userId, courseId) =>
    axios.get(`${API_URL}/quiz/progress/${userId}/${courseId}`),

  // Utilitaire générique
  get: (url) => axios.get(url),
};

export default api;
