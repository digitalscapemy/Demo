<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { Mail, Lock, Eye, EyeOff } from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const form = ref({
  email: '',
  password: '',
})

const showPassword = ref(false)
const loading = ref(false)
const error = ref('')

async function handleSubmit() {
  loading.value = true
  error.value = ''

  try {
    await authStore.login(form.value)
    const redirect = route.query.redirect as string || '/dashboard'
    router.push(redirect)
  } catch (e: any) {
    error.value = e.response?.data?.message || 'Invalid email or password'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold text-gray-900 text-center mb-2">Welcome Back</h1>
    <p class="text-gray-600 text-center mb-8">Sign in to continue learning</p>

    <form @submit.prevent="handleSubmit" class="space-y-5">
      <div v-if="error" class="p-4 bg-red-50 text-red-700 rounded-lg text-sm">
        {{ error }}
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
        <div class="relative">
          <Mail class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            v-model="form.email" 
            type="email" 
            class="input pl-10"
            placeholder="you@example.com"
            required
          />
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Password</label>
        <div class="relative">
          <Lock class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            v-model="form.password" 
            :type="showPassword ? 'text' : 'password'" 
            class="input pl-10 pr-10"
            placeholder="••••••••"
            required
          />
          <button 
            type="button"
            @click="showPassword = !showPassword"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <EyeOff v-if="showPassword" class="w-5 h-5" />
            <Eye v-else class="w-5 h-5" />
          </button>
        </div>
      </div>

      <div class="flex items-center justify-between">
        <label class="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" class="w-4 h-4 text-primary-600 rounded focus:ring-primary-500" />
          <span class="text-sm text-gray-600">Remember me</span>
        </label>
        <RouterLink to="/forgot-password" class="text-sm text-primary-600 hover:text-primary-700">
          Forgot password?
        </RouterLink>
      </div>

      <button 
        type="submit" 
        class="btn btn-primary w-full py-3"
        :disabled="loading"
      >
        {{ loading ? 'Signing in...' : 'Sign In' }}
      </button>
    </form>

    <p class="text-center text-gray-600 mt-6">
      Don't have an account?
      <RouterLink to="/register" class="text-primary-600 hover:text-primary-700 font-medium">
        Sign up
      </RouterLink>
    </p>
  </div>
</template>
