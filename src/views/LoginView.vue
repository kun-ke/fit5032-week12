<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const username = ref('')
const password = ref('')
const errorMessage = ref('')

const router = useRouter()

function login() {
  if (username.value === 'admin' && password.value === '1234') {
    localStorage.setItem('isAuthenticated', 'true')
    errorMessage.value = ''
    router.push('/about')
  } else {
    errorMessage.value = 'Invalid username or password.'
  }
}
</script>

<template>
  <div class="container mt-5">
    <div class="col-md-6 mx-auto">
      <h1 class="mb-4">Login</h1>

      <form @submit.prevent="login">
        <div class="mb-3">
          <label for="username" class="form-label">
            Username
          </label>

          <input
            id="username"
            v-model="username"
            type="text"
            class="form-control"
          />
        </div>

        <div class="mb-3">
          <label for="password" class="form-label">
            Password
          </label>

          <input
            id="password"
            v-model="password"
            type="password"
            class="form-control"
          />
        </div>

        <div v-if="errorMessage" class="text-danger mb-3">
          {{ errorMessage }}
        </div>

        <button type="submit" class="btn btn-primary">
          Login
        </button>
      </form>

      <p class="mt-3">
        Test account: admin / 1234
      </p>
    </div>
  </div>
</template>