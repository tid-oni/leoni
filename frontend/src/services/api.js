import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

// Créer une instance axios
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer le refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
            refresh: refreshToken,
          });

          const { access } = response.data;
          localStorage.setItem('access_token', access);

          return api(originalRequest);
        }
      } catch (refreshError) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

// Services API
export const authService = {
  login: (email, password) => api.post('/auth/login/', { email, password }),
  getProfile: () => api.get('/auth/profile/'),
};

export const agentService = {
  getAgents: () => api.get('/auth/agents/'),
  createAgent: (data) => api.post('/auth/agents/', data),
  updateAgent: (id, data) => api.put(`/auth/agents/${id}/`, data),
  deleteAgent: (id) => api.delete(`/auth/agents/${id}/`),
};

export const machineService = {
  getMachines: () => api.get('/machines/'),
  createMachine: (data) => api.post('/machines/', data),
  updateMachine: (id, data) => api.put(`/machines/${id}/`, data),
  deleteMachine: (id) => api.delete(`/machines/${id}/`),
};

export const interventionService = {
  getInterventions: () => api.get('/interventions/'),
  createIntervention: (data) => api.post('/interventions/', data),
  resolveIntervention: (id) => api.post(`/interventions/${id}/resolve/`),
};

export const faceRecognitionService = {
  verifyFaceId: (data) => api.post('/face-recognition/verify/', data),
  uploadFaceEncoding: (data) => api.post('/face-recognition/upload-encoding/', data),
};