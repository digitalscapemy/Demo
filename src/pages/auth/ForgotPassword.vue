<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { Mail, ArrowLeft } from 'lucide-vue-next'

const email = ref('')
const loading = ref(false)
const submitted = ref(false)

async function handleSubmit() {
  loading.value = true
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  submitted.value = true
  loading.value = false
}
</script>

<template>
  <div>
    <template v-if="!submitted">
      <h1 class="text-2xl font-bold text-gray-900 text-center mb-2">Forgot Password?</h1>
      <p class="text-gray-600 text-center mb-8">
        Enter your email and we'll send you a reset link
      </p>

      <form @submit.prevent="handleSubmit" class="space-y-5">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <div class="relative">
            <Mail class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              v-model="email" 
              type="email" 
              class="input pl-10"
              placeholder="you@example.com"
              required
            />
          </div>
        </div>

        <button 
          type="submit" 
          class="btn btn-primary w-full py-3"
          :disabled="loading"
        >
          {{ loading ? 'Sending...' : 'Send Reset Link' }}
        </button>
      </form>
    </template>

    <template v-else>
      <div class="text-center">
        <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail class="w-8 h-8 text-green-600" />
        </div>
        <h1 class="text-2xl font-bold text-gray-900 mb-2">Check Your Email</h1>
        <p class="text-gray-600 mb-6">
          We've sent a password reset link to<br />
          <span class="font-medium text-gray-900">{{ email }}</span>
        </p>
        <button @click="submitted = false" class="text-primary-600 hover:text-primary-700 font-medium">
          Didn't receive it? Try again
        </button>
      </div>
    </template>

    <RouterLink 
      to="/login" 
      class="flex items-center justify-center gap-2 text-gray-600 hover:text-gray-900 mt-6"
    >
      <ArrowLeft class="w-4 h-4" />
      Back to login
    </RouterLink>
  </div>
</template>
