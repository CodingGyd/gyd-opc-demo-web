import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi } from '@/api/auth'
import router from '@/router'

export const useUserStore = defineStore('user', () => {
  const token = ref<string>(localStorage.getItem('token') || '')
  const refreshToken = ref<string>(localStorage.getItem('refreshToken') || '')
  const userInfo = ref<Record<string, any> | null>(null)

  const isLoggedIn = computed(() => !!token.value)

  async function login(account: string, code: string, loginType: 'sms' | 'email' = 'sms') {
    const res = await authApi.login(account, code, loginType)
    setTokens(res.data.accessToken, res.data.refreshToken)
    await fetchUserInfo()
    const redirect = (router.currentRoute.value.query.redirect as string) || '/'
    router.push(redirect)
  }

  async function loginByUsername(username: string, password: string) {
    const res = await authApi.loginByUsername(username, password)
    setTokens(res.data.accessToken, res.data.refreshToken)
    await fetchUserInfo()
    const redirect = (router.currentRoute.value.query.redirect as string) || '/'
    router.push(redirect)
  }

  async function refreshAccessToken(): Promise<string> {
    const res = await authApi.refresh(refreshToken.value)
    setTokens(res.data.accessToken, res.data.refreshToken)
    return res.data.accessToken
  }

  async function fetchUserInfo() {
    const res = await authApi.getUserInfo()
    userInfo.value = res.data
  }

  async function logout() {
    try {
      await authApi.logout()
    } catch {
      // Ignore
    }
    clearTokens()
    userInfo.value = null
    router.push('/login')
  }

  function setTokens(accessToken: string, refresh: string) {
    token.value = accessToken
    refreshToken.value = refresh
    localStorage.setItem('token', accessToken)
    localStorage.setItem('refreshToken', refresh)
  }

  function clearTokens() {
    token.value = ''
    refreshToken.value = ''
    userInfo.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
  }

  return {
    token, refreshToken, userInfo, isLoggedIn,
    login, loginByUsername, refreshAccessToken, fetchUserInfo, logout,
  }
})
