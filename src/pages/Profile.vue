<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { Camera, Save } from 'lucide-vue-next'

const authStore = useAuthStore()

const form = ref({
  name: authStore.user?.name || '',
  email: authStore.user?.email || '',
  bio: '',
})

const loading = ref(false)
const message = ref('')

async function handleSubmit() {
  loading.value = true
  message.value = ''
  
  try {
    await authStore.updateProfile({ name: form.value.name })
    message.value = 'Profile updated successfully!'
  } catch (error) {
    message.value = 'Failed to update profile'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="max-w-2xl">
    <h1 class="text-2xl font-bold text-gray-900 mb-6">My Profile</h1>

    <div class="card">
      <!-- Avatar Section -->
      <div class="flex items-center gap-6 mb-8 pb-8 border-b border-gray-200">
        <div class="relative">
          <div class="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center">
            <span class="text-3xl font-bold text-primary-700">
              {{ authStore.user?.name?.charAt(0).toUpperCase() }}
            </span>
          </div>
          <button class="absolute bottom-0 right-0 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white hover:bg-primary-700 transition-colors">
            <Camera class="w-4 h-4" />
          </button>
        </div>
        <div>
          <h2 class="text-xl font-semibold text-gray-900">{{ authStore.user?.name }}</h2>
          <p class="text-gray-600">{{ authStore.user?.email }}</p>
          <span class="inline-block mt-2 px-3 py-1 bg-primary-100 text-primary-700 text-sm font-medium rounded-full capitalize">
            {{ authStore.user?.role }}
          </span>
        </div>
      </div>

      <!-- Profile Form -->
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div v-if="message" :class="[
          'p-4 rounded-lg text-sm',
          message.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        ]">
          {{ message }}
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
          <input 
            v-model="form.name" 
            type="text" 
            class="input"
            placeholder="Enter your name"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
          <input 
            v-model="form.email" 
            type="email" 
            class="input bg-gray-50"
            disabled
          />
          <p class="text-xs text-gray-500 mt-1">Email cannot be changed</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Bio</label>
          <textarea 
            v-model="form.bio" 
            rows="4" 
            class="input"
            placeholder="Tell us about yourself..."
          />
        </div>

        <div class="flex justify-end">
          <button type="submit" class="btn btn-primary" :disabled="loading">
            <Save class="w-4 h-4 mr-2" />
            {{ loading ? 'Saving...' : 'Save Changes' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
