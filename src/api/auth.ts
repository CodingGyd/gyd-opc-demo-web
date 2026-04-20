import request from './request'

export interface AuthResponse {
  accessToken: string
  refreshToken: string
}

export const authApi = {
  sendCode(account: string, type: string = 'login') {
    return request.post<{ success: boolean }>('/v1/auth/send-code', {
      account,
      type,
    })
  },

  login(account: string, code: string, loginType: 'sms' | 'email' = 'sms') {
    return request.post<AuthResponse>('/v1/auth/login', {
      loginType,
      account,
      credential: code,
    })
  },

  loginByUsername(username: string, password: string) {
    return request.post<AuthResponse>('/v1/auth/login', {
      loginType: 'username',
      account: username,
      credential: password,
    })
  },

  refresh(refreshToken: string) {
    return request.post<AuthResponse>('/v1/auth/refresh-token', { refreshToken })
  },

  logout() {
    return request.post('/v1/auth/logout')
  },

  getUserInfo() {
    return request.get<Record<string, any>>('/v1/user/info')
  },

  register(data: { registerType: string; username: string; password: string; phone?: string; email?: string; verifyCode?: string }) {
    return request.post<AuthResponse>('/v1/auth/register', data)
  },
}
