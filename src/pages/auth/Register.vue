<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: 'student' as 'student' | 'instructor',
})

const showPassword = ref(false)
const loading = ref(false)
const error = ref('')

async function handleSubmit() {
  if (form.value.password !== form.value.confirmPassword) {
    error.value = 'Passwords do not match'
    return
  }

  loading.value = true
  error.value = ''

  try {
    await authStore.register({
      name: form.value.name,
      email: form.value.email,
      password: form.value.password,
      role: form.value.role,
    })
    router.push('/dashboard')
  } catch (e: any) {
    error.value = e.response?.data?.message || 'Registration failed'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold text-gray-900 text-center mb-2">Create Account</h1>
    <p class="text-gray-600 text-center mb-8">Start your learning journey today</p>

    <form @submit.prevent="handleSubmit" class="space-y-5">
      <div v-if="error" class="p-4 bg-red-50 text-red-700 rounded-lg text-sm">
        {{ error }}
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
        <div class="relative">
          <User class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            v-model="form.name" 
            type="text" 
            class="input pl-10"
            placeholder="John Doe"
            required
          />
        </div>
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
            minlength="6"
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

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
        <div class="relative">
          <Lock class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            v-model="form.confirmPassword" 
            :type="showPassword ? 'text' : 'password'" 
            class="input pl-10"
            placeholder="••••••••"
            required
          />
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">I want to</label>
        <div class="grid grid-cols-2 gap-3">
          <label 
            :class="[
              'flex items-center justify-center p-3 border-2 rounded-lg cursor-pointer transition-colors',
              form.role === 'student' ? 'border-primary-600 bg-primary-50' : 'border-gray-200 hover:border-gray-300'
            ]"
          >
            <input type="radio" v-model="form.role" value="student" class="sr-only" />
            <span :class="form.role === 'student' ? 'text-primary-700 font-medium' : 'text-gray-700'">
              Learn
            </span>
          </label>
          <label 
            :class="[
              'flex items-center justify-center p-3 border-2 rounded-lg cursor-pointer transition-colors',
              form.role === 'instructor' ? 'border-primary-600 bg-primary-50' : 'border-gray-200 hover:border-gray-300'
            ]"
          >
            <input type="radio" v-model="form.role" value="instructor" class="sr-only" />
            <span :class="form.role === 'instructor' ? 'text-primary-700 font-medium' : 'text-gray-700'">
              Teach
            </span>
          </label>
        </div>
      </div>

      <button 
        type="submit" 
        class="btn btn-primary w-full py-3"
        :disabled="loading"
      >
        {{ loading ? 'Creating account...' : 'Create Account' }}
      </button>
    </form>

    <p class="text-center text-gray-600 mt-6">
      Already have an account?
      <RouterLink to="/login" class="text-primary-600 hover:text-primary-700 font-medium">
        Sign in
      </RouterLink>
    </p>
  </div>
</template>
