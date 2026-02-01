<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { BookOpen, Clock, Award, TrendingUp } from 'lucide-vue-next'

const authStore = useAuthStore()

const studentStats = [
  { icon: BookOpen, label: 'Enrolled Courses', value: '5' },
  { icon: Clock, label: 'Hours Learned', value: '24' },
  { icon: Award, label: 'Certificates', value: '2' },
  { icon: TrendingUp, label: 'Completion Rate', value: '78%' },
]

const instructorStats = [
  { icon: BookOpen, label: 'My Courses', value: '8' },
  { icon: Clock, label: 'Total Students', value: '156' },
  { icon: Award, label: 'Avg Rating', value: '4.8' },
  { icon: TrendingUp, label: 'Revenue', value: '$2,450' },
]

const adminStats = [
  { icon: BookOpen, label: 'Total Courses', value: '124' },
  { icon: Clock, label: 'Total Users', value: '1,250' },
  { icon: Award, label: 'Active Instructors', value: '45' },
  { icon: TrendingUp, label: 'Monthly Revenue', value: '$12,500' },
]

const stats = authStore.isAdmin ? adminStats : authStore.isInstructor ? instructorStats : studentStats
</script>

<template>
  <div>
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900">
        Welcome back, {{ authStore.user?.name }}!
      </h1>
      <p class="text-gray-600 mt-1">
        <template v-if="authStore.isAdmin">Here's your platform overview.</template>
        <template v-else-if="authStore.isInstructor">Here's how your courses are performing.</template>
        <template v-else>Continue your learning journey.</template>
      </p>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div v-for="stat in stats" :key="stat.label" class="card">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
            <component :is="stat.icon" class="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <p class="text-2xl font-bold text-gray-900">{{ stat.value }}</p>
            <p class="text-sm text-gray-600">{{ stat.label }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Role-specific content -->
    <div class="grid lg:grid-cols-2 gap-6">
      <!-- Recent Activity -->
      <div class="card">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div class="space-y-4">
          <div v-for="i in 4" :key="i" class="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
            <div class="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <BookOpen class="w-5 h-5 text-primary-600" />
            </div>
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-900">Course Activity {{ i }}</p>
              <p class="text-xs text-gray-500">{{ i }} hours ago</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="card">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div class="grid grid-cols-2 gap-3">
          <button class="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left">
            <BookOpen class="w-6 h-6 text-primary-600 mb-2" />
            <p class="font-medium text-gray-900">Browse Courses</p>
            <p class="text-xs text-gray-500">Find new courses</p>
          </button>
          <button class="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left">
            <Clock class="w-6 h-6 text-primary-600 mb-2" />
            <p class="font-medium text-gray-900">Continue Learning</p>
            <p class="text-xs text-gray-500">Resume last course</p>
          </button>
          <button class="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left">
            <Award class="w-6 h-6 text-primary-600 mb-2" />
            <p class="font-medium text-gray-900">Certificates</p>
            <p class="text-xs text-gray-500">View achievements</p>
          </button>
          <button class="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left">
            <TrendingUp class="w-6 h-6 text-primary-600 mb-2" />
            <p class="font-medium text-gray-900">Progress</p>
            <p class="text-xs text-gray-500">Track your stats</p>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
