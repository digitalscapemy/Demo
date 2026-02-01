<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { Menu, X, Home, BookOpen, User, Settings, LogOut, Users, LayoutDashboard } from 'lucide-vue-next'

const authStore = useAuthStore()
const router = useRouter()
const sidebarOpen = ref(false)

const navigation = [
  { name: 'Home', to: '/', icon: Home },
  { name: 'Dashboard', to: '/dashboard', icon: LayoutDashboard, auth: true },
  { name: 'Courses', to: '/courses', icon: BookOpen },
]

const adminNav = [
  { name: 'Users', to: '/admin/users', icon: Users },
]

function logout() {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Mobile sidebar backdrop -->
    <div 
      v-if="sidebarOpen" 
      class="fixed inset-0 bg-black/50 z-40 lg:hidden"
      @click="sidebarOpen = false"
    />

    <!-- Sidebar -->
    <aside 
      :class="[
        'fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 lg:translate-x-0',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      ]"
    >
      <div class="flex items-center justify-between h-16 px-6 border-b border-gray-200">
        <RouterLink to="/" class="text-xl font-bold text-primary-600">
          LMS System
        </RouterLink>
        <button @click="sidebarOpen = false" class="lg:hidden text-gray-500 hover:text-gray-700">
          <X class="w-6 h-6" />
        </button>
      </div>

      <nav class="p-4 space-y-1">
        <template v-for="item in navigation" :key="item.name">
          <RouterLink
            v-if="!item.auth || authStore.isAuthenticated"
            :to="item.to"
            class="flex items-center gap-3 px-4 py-2.5 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            active-class="bg-primary-50 text-primary-700 font-medium"
          >
            <component :is="item.icon" class="w-5 h-5" />
            {{ item.name }}
          </RouterLink>
        </template>

        <!-- Admin section -->
        <template v-if="authStore.isAdmin">
          <div class="pt-4 mt-4 border-t border-gray-200">
            <p class="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Admin</p>
            <RouterLink
              v-for="item in adminNav"
              :key="item.name"
              :to="item.to"
              class="flex items-center gap-3 px-4 py-2.5 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              active-class="bg-primary-50 text-primary-700 font-medium"
            >
              <component :is="item.icon" class="w-5 h-5" />
              {{ item.name }}
            </RouterLink>
          </div>
        </template>
      </nav>

      <!-- User section at bottom -->
      <div v-if="authStore.isAuthenticated" class="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
            <span class="text-primary-700 font-medium">
              {{ authStore.user?.name?.charAt(0).toUpperCase() }}
            </span>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900 truncate">{{ authStore.user?.name }}</p>
            <p class="text-xs text-gray-500 capitalize">{{ authStore.user?.role }}</p>
          </div>
        </div>
        <div class="flex gap-2">
          <RouterLink to="/profile" class="flex-1 btn btn-secondary text-sm text-center">
            <User class="w-4 h-4 inline mr-1" /> Profile
          </RouterLink>
          <button @click="logout" class="btn btn-secondary text-sm">
            <LogOut class="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>

    <!-- Main content -->
    <div class="lg:pl-64">
      <!-- Top header -->
      <header class="sticky top-0 z-30 bg-white border-b border-gray-200">
        <div class="flex items-center justify-between h-16 px-4 lg:px-8">
          <button @click="sidebarOpen = true" class="lg:hidden text-gray-500 hover:text-gray-700">
            <Menu class="w-6 h-6" />
          </button>

          <div class="flex-1" />

          <div v-if="!authStore.isAuthenticated" class="flex items-center gap-3">
            <RouterLink to="/login" class="text-gray-600 hover:text-gray-900 font-medium">
              Login
            </RouterLink>
            <RouterLink to="/register" class="btn btn-primary">
              Get Started
            </RouterLink>
          </div>

          <div v-else class="flex items-center gap-3">
            <RouterLink to="/settings" class="text-gray-500 hover:text-gray-700">
              <Settings class="w-5 h-5" />
            </RouterLink>
          </div>
        </div>
      </header>

      <!-- Page content -->
      <main class="p-4 lg:p-8">
        <RouterView />
      </main>
    </div>
  </div>
</template>
