<template>
  <div class="login-page">
    <div class="overlay"></div>

    <form class="login-card" @submit.prevent="handleLogin">
      <h1>Welcome!</h1>
      <p>Maskan Fast-Track Admin</p>

      <input v-model="username" type="text" placeholder="Username" />

      <input v-model="password" type="password" placeholder="Password" />

      <label class="remember">
        <input v-model="rememberMe" type="checkbox" />
        Remember me
      </label>

      <p v-if="error" class="error">{{ error }}</p>

      <button type="submit" :disabled="loading">
        {{ loading ? 'Logging in...' : 'LOGIN' }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { loginAdmin } from '../services/authService'

const router = useRouter()

const username = ref('')
const password = ref('')
const rememberMe = ref(false)
const error = ref('')
const loading = ref(false)

onMounted(() => {
  const savedUsername = localStorage.getItem('rememberedUsername')
  if (savedUsername) {
    username.value = savedUsername
    rememberMe.value = true
  }
})

const handleLogin = async () => {
  error.value = ''
  loading.value = true

  try {
    const data = await loginAdmin(username.value, password.value)

    localStorage.setItem('adminToken', data.token)
    localStorage.setItem('adminUser', JSON.stringify(data.admin))

    if (rememberMe.value) {
      localStorage.setItem('rememberedUsername', username.value)
    } else {
      localStorage.removeItem('rememberedUsername')
    }

    router.push('/dashboard')
  } catch (err) {
    error.value = 'Invalid username or password'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background:
    linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.7)),
    url('https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1800&q=80');
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  padding-left: 13%;
}

.login-card {
  width: 380px;
  color: white;
}

.login-card h1 {
  font-size: 56px;
  font-weight: 300;
  margin-bottom: 6px;
}

.login-card p {
  font-size: 20px;
  margin-bottom: 35px;
  opacity: 0.85;
}

.login-card input[type='text'],
.login-card input[type='password'] {
  width: 100%;
  background: transparent;
  border: none;
  border-bottom: 2px solid white;
  padding: 14px 8px;
  margin-bottom: 22px;
  color: white;
  font-size: 16px;
  outline: none;
}

.login-card input::placeholder {
  color: rgba(255, 255, 255, 0.85);
}

.remember {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 22px;
  font-size: 15px;
}

.remember input {
  width: 18px;
  height: 18px;
}

button {
  width: 100%;
  padding: 15px;
  border: none;
  background: #2f80c9;
  color: white;
  font-size: 18px;
  border-radius: 6px;
  cursor: pointer;
  letter-spacing: 1px;
}

button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.error {
  color: #ffb3b3;
  font-size: 14px !important;
  margin-bottom: 14px !important;
}
</style>
