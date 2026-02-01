<script setup lang="ts">
import { ref, computed } from 'vue'
import { Search, Plus, Edit2, Trash2, X } from 'lucide-vue-next'
import type { User } from '@/types'

// Mock users data
const users = ref<User[]>([
  { id: '1', name: 'Admin User', email: 'admin@lms.com', role: 'admin', createdAt: '2024-01-01' },
  { id: '2', name: 'John Instructor', email: 'john@lms.com', role: 'instructor', createdAt: '2024-01-05' },
  { id: '3', name: 'Jane Student', email: 'jane@lms.com', role: 'student', createdAt: '2024-01-10' },
  { id: '4', name: 'Bob Teacher', email: 'bob@lms.com', role: 'instructor', createdAt: '2024-01-15' },
  { id: '5', name: 'Alice Learner', email: 'alice@lms.com', role: 'student', createdAt: '2024-01-20' },
])

const searchQuery = ref('')
const roleFilter = ref('')
const showModal = ref(false)
const editingUser = ref<User | null>(null)

const form = ref({
  name: '',
  email: '',
  role: 'student' as 'admin' | 'instructor' | 'student',
  password: '',
})

const filteredUsers = computed(() => {
  return users.value.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesRole = !roleFilter.value || user.role === roleFilter.value
    return matchesSearch && matchesRole
  })
})

function openCreateModal() {
  editingUser.value = null
  form.value = { name: '', email: '', role: 'student', password: '' }
  showModal.value = true
}

function openEditModal(user: User) {
  editingUser.value = user
  form.value = { name: user.name, email: user.email, role: user.role, password: '' }
  showModal.value = true
}

function handleSubmit() {
  if (editingUser.value) {
    // Update existing user
    const index = users.value.findIndex(u => u.id === editingUser.value!.id)
    if (index !== -1) {
      users.value[index] = { ...users.value[index], ...form.value }
    }
  } else {
    // Create new user
    users.value.push({
      id: String(Date.now()),
      name: form.value.name,
      email: form.value.email,
      role: form.value.role,
      createdAt: new Date().toISOString().split('T')[0],
    })
  }
  showModal.value = false
}

function deleteUser(id: string) {
  if (confirm('Are you sure you want to delete this user?')) {
    users.value = users.value.filter(u => u.id !== id)
  }
}

function getRoleBadgeClass(role: string) {
  switch (role) {
    case 'admin': return 'bg-purple-100 text-purple-700'
    case 'instructor': return 'bg-blue-100 text-blue-700'
    default: return 'bg-green-100 text-green-700'
  }
}
</script>

<template>
  <div>
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">User Management</h1>
        <p class="text-gray-600">Manage all users in the system</p>
      </div>
      <button @click="openCreateModal" class="btn btn-primary">
        <Plus class="w-4 h-4 mr-2" />
        Add User
      </button>
    </div>

    <!-- Filters -->
    <div class="card mb-6">
      <div class="flex flex-col sm:flex-row gap-4">
        <div class="flex-1 relative">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            v-model="searchQuery"
            type="text" 
            class="input pl-10"
            placeholder="Search users..."
          />
        </div>
        <select v-model="roleFilter" class="input w-full sm:w-40">
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="instructor">Instructor</option>
          <option value="student">Student</option>
        </select>
      </div>
    </div>

    <!-- Users Table -->
    <div class="card overflow-hidden p-0">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="text-left px-6 py-4 text-sm font-semibold text-gray-900">User</th>
              <th class="text-left px-6 py-4 text-sm font-semibold text-gray-900">Role</th>
              <th class="text-left px-6 py-4 text-sm font-semibold text-gray-900">Joined</th>
              <th class="text-right px-6 py-4 text-sm font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="user in filteredUsers" :key="user.id" class="hover:bg-gray-50">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                    <span class="text-primary-700 font-medium">
                      {{ user.name.charAt(0).toUpperCase() }}
                    </span>
                  </div>
                  <div>
                    <p class="font-medium text-gray-900">{{ user.name }}</p>
                    <p class="text-sm text-gray-500">{{ user.email }}</p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <span :class="['px-3 py-1 rounded-full text-xs font-medium capitalize', getRoleBadgeClass(user.role)]">
                  {{ user.role }}
                </span>
              </td>
              <td class="px-6 py-4 text-gray-600">
                {{ user.createdAt }}
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center justify-end gap-2">
                  <button 
                    @click="openEditModal(user)"
                    class="p-2 text-gray-500 hover:text-primary-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Edit2 class="w-4 h-4" />
                  </button>
                  <button 
                    @click="deleteUser(user.id)"
                    class="p-2 text-gray-500 hover:text-red-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="filteredUsers.length === 0" class="p-12 text-center">
        <p class="text-gray-500">No users found</p>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/50" @click="showModal = false" />
      <div class="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-gray-900">
            {{ editingUser ? 'Edit User' : 'Add New User' }}
          </h2>
          <button @click="showModal = false" class="text-gray-500 hover:text-gray-700">
            <X class="w-5 h-5" />
          </button>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input v-model="form.name" type="text" class="input" required />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input v-model="form.email" type="email" class="input" required />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Role</label>
            <select v-model="form.role" class="input">
              <option value="student">Student</option>
              <option value="instructor">Instructor</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div v-if="!editingUser">
            <label class="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input v-model="form.password" type="password" class="input" required />
          </div>

          <div class="flex gap-3 pt-4">
            <button type="button" @click="showModal = false" class="btn btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" class="btn btn-primary flex-1">
              {{ editingUser ? 'Save Changes' : 'Create User' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
