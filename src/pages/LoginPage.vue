<template>
  <div class="login-page">
    <div class="login-page__card">
      <h1 class="login-page__title">{{ isRegister ? '注册' : '登录' }}</h1>

      <div class="login-page__tabs">
        <button :class="['login-page__tab', { 'login-page__tab--active': mode === 'phone' }]" @click="mode = 'phone'">手机</button>
        <button :class="['login-page__tab', { 'login-page__tab--active': mode === 'email' }]" @click="mode = 'email'">邮箱</button>
        <button :class="['login-page__tab', { 'login-page__tab--active': mode === 'username' }]" @click="mode = 'username'">用户名</button>
      </div>

      <!-- Phone -->
      <form v-if="mode === 'phone'" @submit.prevent="isRegister ? handleRegister() : handleSmsLogin()" class="login-page__form">
        <div v-if="isRegister" class="login-page__field">
          <label>用户名</label>
          <input v-model="regUsername" type="text" placeholder="设置用户名" required />
        </div>
        <div class="login-page__field">
          <label>手机号</label>
          <input v-model="smsAccount" type="tel" placeholder="输入手机号" required />
        </div>
        <div class="login-page__field">
          <label>验证码</label>
          <div class="login-page__code-row">
            <input v-model="smsCode" type="text" placeholder="输入验证码" required />
            <button type="button" class="login-page__send-code" :disabled="smsCooldown > 0" @click="sendSmsCode(smsAccount)">
              {{ smsCooldown > 0 ? `${smsCooldown}s` : '获取验证码' }}
            </button>
          </div>
        </div>
        <div v-if="isRegister" class="login-page__field">
          <label>密码</label>
          <input v-model="regPassword" type="password" placeholder="设置密码（6-32位）" required minlength="6" />
        </div>
        <button type="submit" class="login-page__submit" :disabled="loading">
          {{ loading ? '请稍候...' : (isRegister ? '注册' : '登录') }}
        </button>
      </form>

      <!-- Email -->
      <form v-else-if="mode === 'email'" @submit.prevent="isRegister ? handleRegister() : handleSmsLogin()" class="login-page__form">
        <div v-if="isRegister" class="login-page__field">
          <label>用户名</label>
          <input v-model="regUsername" type="text" placeholder="设置用户名" required />
        </div>
        <div class="login-page__field">
          <label>邮箱</label>
          <input v-model="smsAccount" type="email" placeholder="输入邮箱地址" required />
        </div>
        <div class="login-page__field">
          <label>验证码</label>
          <div class="login-page__code-row">
            <input v-model="smsCode" type="text" placeholder="输入验证码" required />
            <button type="button" class="login-page__send-code" :disabled="emailCooldown > 0" @click="sendEmailCode(smsAccount)">
              {{ emailCooldown > 0 ? `${emailCooldown}s` : '获取验证码' }}
            </button>
          </div>
        </div>
        <div v-if="isRegister" class="login-page__field">
          <label>密码</label>
          <input v-model="regPassword" type="password" placeholder="设置密码（6-32位）" required minlength="6" />
        </div>
        <button type="submit" class="login-page__submit" :disabled="loading">
          {{ loading ? '请稍候...' : (isRegister ? '注册' : '登录') }}
        </button>
      </form>

      <!-- Username -->
      <form v-else @submit.prevent="isRegister ? handleRegister() : handleUsernameLogin()" class="login-page__form">
        <div class="login-page__field">
          <label>用户名</label>
          <input v-model="username" type="text" placeholder="输入用户名" required />
        </div>
        <div class="login-page__field">
          <label>密码</label>
          <input v-model="password" type="password" :placeholder="isRegister ? '设置密码（6-32位）' : '输入密码'" required :minlength="isRegister ? 6 : 0" />
        </div>
        <button type="submit" class="login-page__submit" :disabled="loading">
          {{ loading ? '请稍候...' : (isRegister ? '注册' : '登录') }}
        </button>
      </form>

      <p v-if="errorMsg" class="login-page__error">{{ errorMsg }}</p>
      <p class="login-page__switch">
        <span @click="isRegister = !isRegister; errorMsg = ''">
          {{ isRegister ? '已有账号？去登录' : '没有账号？去注册' }}
        </span>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, type Ref } from 'vue'
import { useUserStore } from '@/stores/user'
import { authApi } from '@/api/auth'

type Mode = 'phone' | 'email' | 'username'

const userStore = useUserStore()
const mode = ref<Mode>('phone')
const loading = ref(false)
const errorMsg = ref('')
const isRegister = ref(false)

// Login forms
const smsAccount = ref('')
const smsCode = ref('')
const username = ref('')
const password = ref('')

// Register form
const regUsername = ref('')
const regPassword = ref('')

// Cooldowns
const smsCooldown = ref(0)
const emailCooldown = ref(0)

function startCooldown(cooldown: Ref<number>) {
  cooldown.value = 60
  const timer = setInterval(() => {
    cooldown.value--
    if (cooldown.value <= 0) clearInterval(timer)
  }, 1000)
}

async function sendSmsCode(account: string) {
  if (!account.trim()) { errorMsg.value = '请输入手机号'; return }
  try {
    await authApi.sendCode(account, isRegister.value ? 'register' : 'login')
    startCooldown(smsCooldown)
    errorMsg.value = ''
  } catch (err: any) {
    errorMsg.value = err?.message || '发送验证码失败'
  }
}

async function sendEmailCode(account: string) {
  if (!account.trim()) { errorMsg.value = '请输入邮箱地址'; return }
  try {
    await authApi.sendCode(account, isRegister.value ? 'register' : 'login')
    startCooldown(emailCooldown)
    errorMsg.value = ''
  } catch (err: any) {
    errorMsg.value = err?.message || '发送验证码失败'
  }
}

async function handleSmsLogin() {
  loading.value = true; errorMsg.value = ''
  try {
    await userStore.login(smsAccount.value, smsCode.value, mode.value === 'email' ? 'email' : 'sms')
  } catch (err: any) {
    errorMsg.value = err?.message || '登录失败'
  } finally { loading.value = false }
}

async function handleUsernameLogin() {
  loading.value = true; errorMsg.value = ''
  try {
    await userStore.loginByUsername(username.value, password.value)
  } catch (err: any) {
    errorMsg.value = err?.message || '登录失败'
  } finally { loading.value = false }
}

async function handleRegister() {
  loading.value = true; errorMsg.value = ''
  try {
    if (mode.value === 'username') {
      await authApi.register({
        registerType: 'username', username: username.value, password: password.value,
      })
    } else if (mode.value === 'phone') {
      await authApi.register({
        registerType: 'sms', username: regUsername.value, password: regPassword.value,
        phone: smsAccount.value, verifyCode: smsCode.value,
      })
    } else {
      await authApi.register({
        registerType: 'email', username: regUsername.value, password: regPassword.value,
        email: smsAccount.value, verifyCode: smsCode.value,
      })
    }
    isRegister.value = false; errorMsg.value = ''
  } catch (err: any) {
    errorMsg.value = err?.message || '注册失败'
  } finally { loading.value = false }
}
</script>

<style scoped>
.login-page {
  display: flex; align-items: center; justify-content: center;
  min-height: 100vh; background: var(--color-bg); padding: var(--spacing-md);
}
.login-page__card {
  width: 100%; max-width: 400px; background: var(--color-surface);
  border-radius: var(--radius-lg); box-shadow: var(--shadow-lg); padding: var(--spacing-xl);
}
.login-page__title { font-size: var(--font-size-2xl); font-weight: 700; text-align: center; margin-bottom: var(--spacing-lg); }
.login-page__tabs { display: flex; border: 1px solid var(--color-border); border-radius: var(--radius-md); overflow: hidden; margin-bottom: var(--spacing-lg); }
.login-page__tab { flex: 1; padding: var(--spacing-sm); background: none; border: none; font-size: var(--font-size-sm); color: var(--color-text-secondary); transition: all 0.2s; cursor: pointer; }
.login-page__tab--active { background: var(--color-primary); color: white; }
.login-page__form { display: flex; flex-direction: column; gap: var(--spacing-md); }
.login-page__field { display: flex; flex-direction: column; gap: var(--spacing-xs); }
.login-page__field label { font-size: var(--font-size-sm); font-weight: 500; color: var(--color-text-secondary); }
.login-page__field input { padding: var(--spacing-sm) var(--spacing-md); border: 1px solid var(--color-border); border-radius: var(--radius-md); font-size: var(--font-size-sm); outline: none; }
.login-page__field input:focus { border-color: var(--color-primary); }
.login-page__code-row { display: flex; gap: var(--spacing-sm); }
.login-page__code-row input { flex: 1; }
.login-page__send-code { white-space: nowrap; padding: var(--spacing-sm) var(--spacing-md); background: var(--color-bg); border: 1px solid var(--color-border); border-radius: var(--radius-md); font-size: var(--font-size-xs); color: var(--color-primary); cursor: pointer; }
.login-page__send-code:disabled { color: var(--color-text-placeholder); cursor: not-allowed; }
.login-page__submit { padding: var(--spacing-sm) var(--spacing-md); background: var(--color-primary); color: white; border: none; border-radius: var(--radius-md); font-size: var(--font-size-base); font-weight: 600; margin-top: var(--spacing-sm); cursor: pointer; }
.login-page__submit:hover:not(:disabled) { opacity: 0.9; }
.login-page__submit:disabled { opacity: 0.6; cursor: not-allowed; }
.login-page__error { margin-top: var(--spacing-md); font-size: var(--font-size-sm); color: var(--color-error); text-align: center; }
.login-page__switch { margin-top: var(--spacing-md); text-align: center; font-size: var(--font-size-sm); color: var(--color-text-secondary); }
.login-page__switch span { color: var(--color-primary); cursor: pointer; }
.login-page__switch span:hover { text-decoration: underline; }
</style>
