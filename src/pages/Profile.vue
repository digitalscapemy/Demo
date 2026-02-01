<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { Camera, Save, User, Mail, Calendar, Shield, Edit3, Check, X } from 'lucide-vue-next'

const authStore = useAuthStore()

const form = ref({
  name: authStore.user?.name || '',
  email: authStore.user?.email || '',
  bio: authStore.user?.bio || '',
})

const loading = ref(false)
const message = ref('')
const isEditing = ref(false)
const avatarUrl = ref(authStore.user?.avatar || '')
const showAvatarModal = ref(false)

const initials = computed(() => {
  return form.value.name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2)
})

const joinDate = computed(() => {
  if (authStore.user?.createdAt) {
    return new Date(authStore.user.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
  return 'Unknown'
})

const roleColor = computed(() => {
  const role = authStore.user?.role
  switch (role) {
    case 'admin':
      return 'bg-purple-100 text-purple-700'
    case 'instructor':
      return 'bg-blue-100 text-blue-700'
    default:
      return 'bg-green-100 text-green-700'
  }
})

async function handleSubmit() {
  loading.value = true
  message.value = ''
  
  try {
    await authStore.updateProfile({ 
      name: form.value.name,
      bio: form.value.bio,
      avatar: avatarUrl.value
    })
    message.value = 'Profile updated successfully!'
    isEditing.value = false
  } catch (error: any) {
    message.value = error.response?.data?.message || 'Failed to update profile'
  } finally {
    loading.value = false
  }
}

function cancelEdit() {
  form.value.name = authStore.user?.name || ''
  form.value.bio = authStore.user?.bio || ''
  avatarUrl.value = authStore.user?.avatar || ''
  isEditing.value = false
  message.value = ''
}

function startEdit() {
  isEditing.value = true
  message.value = ''
}

function handleAvatarUpload(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      avatarUrl.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

onMounted(() => {
  form.value.bio = authStore.user?.bio || ''
  avatarUrl.value = authStore.user?.avatar || ''
})
</script>

<template>
  <div class="max-w-4xl">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-3xl font-bold text-gray-900">My Profile</h1>
      <button 
        v-if="!isEditing"
        @click="startEdit"
        class="btn btn-secondary flex items-center gap-2"
      >
        <Edit3 class="w-4 h-4" />
        Edit Profile
      </button>
    </div>

    <!-- Success/Error Message -->
    <div v-if="message" :class="[
      'mb-6 p-4 rounded-lg text-sm flex items-center gap-2',
      message.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
    ]">
      {{ message.includes('success') ? '<Check class="w-5 h-5" />' : '<X class="w-5 h-5" />' }}
      {{ message }}
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Profile Card -->
      <div class="lg:col-span-1">
        <div class="card bg-gradient-to-br from-primary-50 to-primary-100">
          <!-- Avatar Section -->
          <div class="flex flex-col items-center">
            <div class="relative group">
              <div v-if="avatarUrl" class="w-32 h-32 rounded-full overflow-hidden ring-4 ring-white shadow-lg">
                <img :src="avatarUrl" :alt="form.name" class="w-full h-full object-cover" />
              </div>
              <div v-else class="w-32 h-32 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center ring-4 ring-white shadow-lg">
                <span class="text-4xl font-bold text-white">
                  {{ initials }}
                </span>
              </div>
              
              <label v-if="isEditing" class="absolute bottom-0 right-0 w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white hover:bg-primary-700 transition-all cursor-pointer shadow-lg group-hover:scale-110">
                <Camera class="w-5 h-5" />
                <input type="file" class="hidden" accept="image/*" @change="handleAvatarUpload" />
              </label>
            </div>

            <div class="mt-6 text-center">
              <h2 class="text-2xl font-bold text-gray-900">{{ form.name }}</h2>
              <p class="text-gray-600 mt-1 flex items-center justify-center gap-2">
                <Mail class="w-4 h-4" />
                {{ form.email }}
              </p>
              <span :class="['inline-block mt-3 px-4 py-2 text-sm font-semibold rounded-full capitalize', roleColor]">
                <Shield class="w-4 h-4 inline mr-1" />
                {{ authStore.user?.role }}
              </span>
            </div>

            <!-- Stats -->
            <div class="mt-8 w-full space-y-3">
              <div class="bg-white/50 rounded-lg p-3 text-center">
                <p class="text-xs text-gray-600">Member Since</p>
                <p class="text-sm font-semibold text-gray-900 flex items-center justify-center gap-1 mt-1">
                  <Calendar class="w-4 h-4" />
                  {{ joinDate }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Form Section -->
      <div class="lg:col-span-2">
        <div class="card">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-semibold text-gray-900">Profile Information</h3>
            <div v-if="isEditing" class="flex gap-2">
              <button 
                @click="cancelEdit"
                class="btn btn-secondary text-sm"
                :disabled="loading"
              >
                <X class="w-4 h-4 mr-1" />
                Cancel
              </button>
              <button 
                @click="handleSubmit"
                class="btn btn-primary text-sm"
                :disabled="loading"
              >
                <Save class="w-4 h-4 mr-1" />
                {{ loading ? 'Saving...' : 'Save Changes' }}
              </button>
            </div>
          </div>

          <form @submit.prevent="handleSubmit" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <User class="w-4 h-4" />
                  Full Name
                </label>
                <input 
                  v-model="form.name" 
                  type="text" 
                  class="input"
                  placeholder="Enter your name"
                  :disabled="!isEditing"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Mail class="w-4 h-4" />
                  Email Address
                </label>
                <input 
                  v-model="form.email" 
                  type="email" 
                  class="input bg-gray-50"
                  disabled
                />
                <p class="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Bio</label>
              <textarea 
                v-model="form.bio" 
                rows="4" 
                class="input resize-none"
                placeholder="Tell us about yourself..."
                :disabled="!isEditing"
              />
              <p class="text-xs text-gray-500 mt-1">
                {{ form.bio?.length || 0 }}/200 characters
              </p>
            </div>

            <!-- Additional Information -->
            <div class="border-t pt-6">
              <h4 class="text-lg font-medium text-gray-900 mb-4">Additional Information</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="bg-gray-50 rounded-lg p-4">
                  <p class="text-sm text-gray-600">Account Type</p>
                  <p class="font-semibold text-gray-900 capitalize">{{ authStore.user?.role }}</p>
                </div>
                <div class="bg-gray-50 rounded-lg p-4">
                  <p class="text-sm text-gray-600">Account Status</p>
                  <p class="font-semibold text-green-600">Active</p>
                </div>
              </div>
            </div>
          </form>
        </div>

        <!-- Security Settings Card -->
        <div class="card mt-6">
          <h3 class="text-xl font-semibold text-gray-900 mb-4">Security Settings</h3>
          <div class="space-y-4">
            <div class="flex items-center justify-between py-3 border-b">
              <div>
                <p class="font-medium text-gray-900">Password</p>
                <p class="text-sm text-gray-600">Last changed 3 months ago</p>
              </div>
              <button class="btn btn-secondary text-sm">Change Password</button>
            </div>
            <div class="flex items-center justify-between py-3">
              <div>
                <p class="font-medium text-gray-900">Two-Factor Authentication</p>
                <p class="text-sm text-gray-600">Add an extra layer of security</p>
              </div>
              <button class="btn btn-secondary text-sm">Enable</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
