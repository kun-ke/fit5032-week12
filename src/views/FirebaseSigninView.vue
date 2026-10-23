<script setup>
import { ref } from 'vue'
import {
  getAuth,
  signInWithEmailAndPassword
} from 'firebase/auth'

import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const role = ref('user')

const errorMessage = ref('')

const router = useRouter()
const auth = getAuth()

function signin() {
  errorMessage.value = ''

  signInWithEmailAndPassword(
    auth,
    email.value,
    password.value
  )
    .then(() => {
      const roles =
        JSON.parse(
          localStorage.getItem('firebaseUserRoles')
        ) || {}

      const savedRole =
        roles[email.value.toLowerCase()] || 'user'

      if (savedRole !== role.value) {
        errorMessage.value =
          'Incorrect role selected.'

        auth.signOut()
        return
      }

      console.log('Firebase Sign in Successful!')
      console.log('Current user:')
      console.log(
        'Email:',
        auth.currentUser.email
      )
      console.log(
        'UID:',
        auth.currentUser.uid
      )
      console.log(
        'Role:',
        savedRole
      )

      localStorage.setItem(
        'currentUserRole',
        savedRole
      )

      router.push('/')
    })
    .catch((error) => {
      console.log(error.code)

      errorMessage.value =
        error.message
    })
}
</script>

<template>
  <div class="container mt-5">
    <div class="col-md-6 mx-auto">
      <h1 class="mb-4">
        Firebase Login
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

      <button
        class="btn btn-primary"
        @click="signin"
      >
        Sign in with Firebase
      </button>
    </div>
  </div>
</template>
