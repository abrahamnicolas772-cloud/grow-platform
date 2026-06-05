import axios from 'axios';

// URL de l'API Render en production, ou localhost en développement
const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://grow-platform.onrender.com/api'
  : 'http://localhost:5000/api';

const api = {
  // ========== AUTH ==========
  register: (userData) => axios.post(`${API_URL}/register`, userData),
  login: (credentials) => axios.post(`${API_URL}/login`, credentials),
  getCurrentUser: () => axios.get(`${API_URL}/me`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  }),

  // ========== COURSES ==========
  getCourses: () => axios.get(`${API_URL}/courses`),
  getCourse: (id) => axios.get(`${API_URL}/courses/${id}`),
  getCourseModules: (courseId) => axios.get(`${API_URL}/courses/${courseId}/modules`),
  getModuleLessons: (moduleId) => axios.get(`${API_URL}/modules/${moduleId}/lessons`),
  enrollCourse: (userId, courseId, paymentMethod) => 
    axios.post(`${API_URL}/enroll`, { userId, courseId, paymentMethod }),

  // ========== USER ENROLLMENTS ==========
  getUserEnrollments: (userId) => axios.get(`${API_URL}/users/${userId}/enrollments`),

  // ========== QUIZ (classique QCM) ==========
  getQuiz: (lessonId) => axios.get(`${API_URL}/quiz/${lessonId}`),
  submitQuiz: (userId, lessonId, answer) => 
    axios.post(`${API_URL}/quiz/submit`, { userId, lessonId, answer }),

  // ========== QUIZ CODE (nouveau) ==========
  submitCodeQuiz: (userId, lessonId, code, isCorrect) => 
    axios.post(`${API_URL}/quiz/code-submit`, { userId, lessonId, code, isCorrect }),

  // ========== ASSIGNMENTS (devoirs) ==========
  submitAssignment: (formData) => 
    axios.post(`${API_URL}/assignments/submit`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  getUserAssignments: (userId, courseId) => 
    axios.get(`${API_URL}/assignments/user/${userId}/course/${courseId}`),

  // ========== CERTIFICATE ==========
  getCertificate: (userId, courseId) => 
    axios.get(`${API_URL}/certificate/${userId}/${courseId}`),
};

export default api;