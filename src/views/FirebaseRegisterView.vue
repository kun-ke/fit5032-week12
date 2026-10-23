<script setup>
import { ref } from 'vue'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const role = ref('user')

const errorMessage = ref('')
const successMessage = ref('')

const router = useRouter()
const auth = getAuth()

function register() {
  errorMessage.value = ''
  successMessage.value = ''

  createUserWithEmailAndPassword(
    auth,
    email.value,
    password.value
  )
    .then(() => {
      console.log('Firebase Register Successful!')

      const roles =
        JSON.parse(localStorage.getItem('firebaseUserRoles')) || {}

      roles[email.value.toLowerCase()] = role.value

      localStorage.setItem(
        'firebaseUserRoles',
        JSON.stringify(roles)
      )

      console.log('Registered role:', role.value)

      successMessage.value =
        'Registration successful as ' + role.value

      setTimeout(() => {
        router.push('/FireLogin')
      }, 1000)
    })
    .catch((error) => {
      console.log(error.code)
      errorMessage.value = error.message
    })
}
</script>

<template>
  <div class="container mt-5">
    <div class="col-md-6 mx-auto">
      <h1 class="mb-4">
        Firebase Registration
      </h1>

      <div class="mb-3">
        <label class="form-label">
          Email
        </label>

        <input
          v-model="email"
          type="email"
          class="form-control"
          placeholder="Enter your email"
        />
      </div>

      <div class="mb-3">
        <label class="form-label">
          Password
        </label>

        <input
          v-model="password"
          type="password"
          class="form-control"
          placeholder="Enter your password"
        />
      </div>

      <div class="mb-3">
        <label class="form-label">
          Role
        </label>

        <select
          v-model="role"
          class="form-select"
        >
          <option value="user">
            User
          </option>

          <option value="admin">
            Admin
          </option>
        </select>
      </div>

      <p
        v-if="errorMessage"
        class="text-danger"
      >
        {{ errorMessage }}
      </p>

      <p
        v-if="successMessage"
        class="text-success"
      >
        {{ successMessage }}
      </p>

      <button
        class="btn btn-primary"
        @click="register"
      >
        Register with Firebase
      </button>
    </div>
  </div>
</template>