import axios from 'axios';

const API_URL = 'https://grow-platform.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth
export const register = (userData) => api.post('/register', userData);
export const login = (credentials) => api.post('/login', credentials);

// Courses
export const getCourses = () => api.get('/courses');
export const getCourse = (id) => api.get(`/courses/${id}`);
export const getCourseModules = (courseId) => api.get(`/courses/${courseId}/modules`);
export const getModuleLessons = (moduleId) => api.get(`/modules/${moduleId}/lessons`);

// Enrollments
export const getUserEnrollments = (userId) => api.get(`/users/${userId}/enrollments`);
export const enrollCourse = (userId, courseId) => api.post('/enroll', { userId, courseId });

// Quiz
export const getQuiz = (lessonId) => api.get(`/quiz/${lessonId}`);
export const submitQuiz = (userId, lessonId, answer) => api.post('/quiz/submit', { userId, lessonId, answer });

// Certificate
export const getCertificate = (userId, courseId) => api.get(`/certificate/${userId}/${courseId}`);

export default api;
