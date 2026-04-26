import api from './axios'

export const login          = (credentials) => api.post('/login', credentials)
export const logout         = ()            => api.post('/logout')
export const getUser        = ()            => api.get('/user')
export const updateProfile  = (data)        => api.put('/user/profile', data)
export const updatePassword = (data)        => api.put('/user/password', data)
