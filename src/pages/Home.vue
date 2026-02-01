<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { BookOpen, Users, Award, PlayCircle } from 'lucide-vue-next'

const authStore = useAuthStore()

const features = [
  { icon: BookOpen, title: 'Rich Course Content', description: 'Video lessons, PDFs, quizzes, and interactive content' },
  { icon: Users, title: 'Expert Instructors', description: 'Learn from industry professionals and educators' },
  { icon: Award, title: 'Certificates', description: 'Earn certificates upon course completion' },
  { icon: PlayCircle, title: 'Learn Anywhere', description: 'Access courses on any device, anytime' },
]

const stats = [
  { value: '10K+', label: 'Students' },
  { value: '500+', label: 'Courses' },
  { value: '100+', label: 'Instructors' },
  { value: '95%', label: 'Satisfaction' },
]
</script>

<template>
  <div class="-m-4 lg:-m-8">
    <!-- Hero Section -->
    <section class="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20 px-4 lg:px-8">
      <div class="max-w-4xl mx-auto text-center">
        <h1 class="text-4xl lg:text-5xl font-bold mb-6">
          Unlock Your Potential with Online Learning
        </h1>
        <p class="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
          Access thousands of courses taught by expert instructors. Learn at your own pace and achieve your goals.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <RouterLink 
            v-if="!authStore.isAuthenticated"
            to="/register" 
            class="btn bg-white text-primary-700 hover:bg-gray-100 text-lg px-8 py-3"
          >
            Start Learning Free
          </RouterLink>
          <RouterLink 
            v-else
            to="/dashboard" 
            class="btn bg-white text-primary-700 hover:bg-gray-100 text-lg px-8 py-3"
          >
            Go to Dashboard
          </RouterLink>
          <RouterLink 
            to="/courses" 
            class="btn border-2 border-white text-white hover:bg-white/10 text-lg px-8 py-3"
          >
            Browse Courses
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="py-12 bg-white border-b">
      <div class="max-w-6xl mx-auto px-4 lg:px-8">
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-8">
          <div v-for="stat in stats" :key="stat.label" class="text-center">
            <div class="text-3xl lg:text-4xl font-bold text-primary-600">{{ stat.value }}</div>
            <div class="text-gray-600 mt-1">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-20 px-4 lg:px-8">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">Why Choose Our Platform?</h2>
          <p class="text-gray-600 max-w-2xl mx-auto">
            We provide everything you need to succeed in your learning journey.
          </p>
        </div>
        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div v-for="feature in features" :key="feature.title" class="card text-center">
            <div class="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <component :is="feature.icon" class="w-7 h-7 text-primary-600" />
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ feature.title }}</h3>
            <p class="text-gray-600 text-sm">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 px-4 lg:px-8 bg-gray-900 text-white">
      <div class="max-w-4xl mx-auto text-center">
        <h2 class="text-3xl font-bold mb-4">Ready to Start Learning?</h2>
        <p class="text-gray-400 mb-8">
          Join thousands of learners already on their path to success.
        </p>
        <RouterLink 
          v-if="!authStore.isAuthenticated"
          to="/register" 
          class="btn btn-primary text-lg px-8 py-3"
        >
          Create Free Account
        </RouterLink>
        <RouterLink 
          v-else
          to="/courses" 
          class="btn btn-primary text-lg px-8 py-3"
        >
          Explore Courses
        </RouterLink>
      </div>
    </section>
  </div>
</template>
