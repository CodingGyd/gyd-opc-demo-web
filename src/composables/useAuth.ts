import { computed } from 'vue'
import { useUserStore } from '@/stores/user'

/**
 * Composable for accessing auth state reactively.
 * Provides shortcuts for common auth checks.
 */
export function useAuth() {
  const userStore = useUserStore()

  const isLoggedIn = computed(() => userStore.isLoggedIn)
  const userInfo = computed(() => userStore.userInfo)
  const token = computed(() => userStore.token)

  async function login(phone: string, code: string) {
    return userStore.login(phone, code)
  }

  async function loginByUsername(username: string, password: string) {
    return userStore.loginByUsername(username, password)
  }

  async function logout() {
    return userStore.logout()
  }

  return {
    isLoggedIn,
    userInfo,
    token,
    login,
    loginByUsername,
    logout,
  }
}
