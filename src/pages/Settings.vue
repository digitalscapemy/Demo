<script setup lang="ts">
import { ref } from 'vue'
import { Bell, Lock, Globe, Moon } from 'lucide-vue-next'

const settings = ref({
  emailNotifications: true,
  pushNotifications: false,
  darkMode: false,
  language: 'en',
})

const languages = [
  { value: 'en', label: 'English' },
  { value: 'id', label: 'Bahasa Indonesia' },
  { value: 'es', label: 'Español' },
]

const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const message = ref('')

function saveSettings() {
  message.value = 'Settings saved successfully!'
  setTimeout(() => message.value = '', 3000)
}

function changePassword() {
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    message.value = 'Passwords do not match'
    return
  }
  message.value = 'Password changed successfully!'
  passwordForm.value = { currentPassword: '', newPassword: '', confirmPassword: '' }
  setTimeout(() => message.value = '', 3000)
}
</script>

<template>
  <div class="max-w-2xl">
    <h1 class="text-2xl font-bold text-gray-900 mb-6">Settings</h1>

    <div v-if="message" :class="[
      'mb-6 p-4 rounded-lg text-sm',
      message.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
    ]">
      {{ message }}
    </div>

    <!-- Notifications -->
    <div class="card mb-6">
      <div class="flex items-center gap-3 mb-6">
        <Bell class="w-5 h-5 text-primary-600" />
        <h2 class="text-lg font-semibold text-gray-900">Notifications</h2>
      </div>

      <div class="space-y-4">
        <label class="flex items-center justify-between cursor-pointer">
          <div>
            <p class="font-medium text-gray-900">Email Notifications</p>
            <p class="text-sm text-gray-500">Receive updates via email</p>
          </div>
          <input 
            type="checkbox" 
            v-model="settings.emailNotifications"
            class="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
          />
        </label>

        <label class="flex items-center justify-between cursor-pointer">
          <div>
            <p class="font-medium text-gray-900">Push Notifications</p>
            <p class="text-sm text-gray-500">Receive browser notifications</p>
          </div>
          <input 
            type="checkbox" 
            v-model="settings.pushNotifications"
            class="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
          />
        </label>
      </div>
    </div>

    <!-- Appearance -->
    <div class="card mb-6">
      <div class="flex items-center gap-3 mb-6">
        <Moon class="w-5 h-5 text-primary-600" />
        <h2 class="text-lg font-semibold text-gray-900">Appearance</h2>
      </div>

      <label class="flex items-center justify-between cursor-pointer">
        <div>
          <p class="font-medium text-gray-900">Dark Mode</p>
          <p class="text-sm text-gray-500">Use dark theme</p>
        </div>
        <input 
          type="checkbox" 
          v-model="settings.darkMode"
          class="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
        />
      </label>
    </div>

    <!-- Language -->
    <div class="card mb-6">
      <div class="flex items-center gap-3 mb-6">
        <Globe class="w-5 h-5 text-primary-600" />
        <h2 class="text-lg font-semibold text-gray-900">Language</h2>
      </div>

      <select v-model="settings.language" class="input">
        <option v-for="lang in languages" :key="lang.value" :value="lang.value">
          {{ lang.label }}
        </option>
      </select>
    </div>

    <!-- Change Password -->
    <div class="card mb-6">
      <div class="flex items-center gap-3 mb-6">
        <Lock class="w-5 h-5 text-primary-600" />
        <h2 class="text-lg font-semibold text-gray-900">Change Password</h2>
      </div>

      <form @submit.prevent="changePassword" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
          <input 
            v-model="passwordForm.currentPassword" 
            type="password" 
            class="input"
            placeholder="Enter current password"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">New Password</label>
          <input 
            v-model="passwordForm.newPassword" 
            type="password" 
            class="input"
            placeholder="Enter new password"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
          <input 
            v-model="passwordForm.confirmPassword" 
            type="password" 
            class="input"
            placeholder="Confirm new password"
          />
        </div>
        <button type="submit" class="btn btn-primary">
          Update Password
        </button>
      </form>
    </div>

    <div class="flex justify-end">
      <button @click="saveSettings" class="btn btn-primary">
        Save All Settings
      </button>
    </div>
  </div>
</template>
