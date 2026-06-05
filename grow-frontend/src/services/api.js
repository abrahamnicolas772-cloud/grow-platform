import axios from 'axios';

// URL de l'API - changer ici pour la production
const API_URL = 'https://grow-platform.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token si besoin
api.interceptors.request.use(
  (config) => {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const userData = JSON.parse(user);
        if (userData.token) {
          config.headers.Authorization = `Bearer ${userData.token}`;
        }
      } catch (e) {}
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth
export const register = (userData) => api.post('/register', userData);
export const login = (credentials) => api.post('/login', credentials);
export const getCurrentUser = () => api.get('/me');

// Courses
export const getCourses = () => api.get('/courses');
export const getCourse = (id) => api.get(`/courses/${id}`);
export const getCourseModules = (courseId) => api.get(`/courses/${courseId}/modules`);
export const getModuleLessons = (moduleId) => api.get(`/modules/${moduleId}/lessons`);

// Enrollments
export const enrollCourse = (userId, courseId, paymentMethod) => 
  api.post('/enroll', { userId, courseId, paymentMethod });
export const getUserEnrollments = (userId) => api.get(`/users/${userId}/enrollments`);

// Quiz
export const getQuiz = (lessonId) => api.get(`/quiz/${lessonId}`);
export const submitQuiz = (userId, lessonId, answer) => 
  api.post('/quiz/submit', { userId, lessonId, answer });
export const submitCodeQuiz = (userId, lessonId, code, isCorrect) => 
  api.post('/quiz/code-submit', { userId, lessonId, code, isCorrect });

// Assignments
export const submitAssignment = (formData) => 
  api.post('/assignments/submit', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
export const getUserAssignments = (userId, courseId) => 
  api.get(`/assignments/user/${userId}/course/${courseId}`);

// Certificate
export const getCertificate = (userId, courseId) => 
  api.get(`/certificate/${userId}/${courseId}`);

export default api;
