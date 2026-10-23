<script setup>
import { ref } from 'vue'

const formData = ref({
  username: '',
  password: '',
  confirmPassword: '',
  isAustralian: false,
  reason: '',
  gender: '',
})

const errors = ref({
  username: null,
  password: null,
  confirmPassword: null,
  reason: null,
  gender: null,
})

const submittedUsers = ref([])

function validateUsername() {
  if (formData.value.username.trim() === '') {
    errors.value.username = 'Username is required.'
    return false
  }

  errors.value.username = null
  return true
}

function validatePassword() {
  if (
    formData.value.password.length < 4 ||
    formData.value.password.length > 10
  ) {
    errors.value.password = 'Password must be between 4 and 10 characters.'
    return false
  }

  errors.value.password = null
  return true
}

function validateConfirmPassword() {
  if (formData.value.password !== formData.value.confirmPassword) {
    errors.value.confirmPassword = 'Passwords do not match.'
    return false
  }

  errors.value.confirmPassword = null
  return true
}

function validateReason() {
  if (formData.value.reason.trim().length < 10) {
    errors.value.reason = 'Reason must be at least 10 characters.'
    return false
  }

  errors.value.reason = null
  return true
}

function validateGender() {
  if (formData.value.gender === '') {
    errors.value.gender = 'Please select a gender.'
    return false
  }

  errors.value.gender = null
  return true
}

function submitForm() {
  const usernameValid = validateUsername()
  const passwordValid = validatePassword()
  const confirmPasswordValid = validateConfirmPassword()
  const reasonValid = validateReason()
  const genderValid = validateGender()

  if (
    usernameValid &&
    passwordValid &&
    confirmPasswordValid &&
    reasonValid &&
    genderValid
  ) {
    submittedUsers.value.push({
      ...formData.value,
    })
  }
}

function clearForm() {
  formData.value = {
    username: '',
    password: '',
    confirmPassword: '',
    isAustralian: false,
    reason: '',
    gender: '',
  }

  errors.value = {
    username: null,
    password: null,
    confirmPassword: null,
    reason: null,
    gender: null,
  }
}
</script>

<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-md-8 offset-md-2">
        <h1 class="text-center mb-4">
          W5. Library Registration Form
        </h1>

        <form @submit.prevent="submitForm">
          <div class="row">
            <div class="col-md-6 mb-3">
              <label for="username" class="form-label">
                Username
              </label>

              <input
                id="username"
                v-model="formData.username"
                type="text"
                class="form-control"
                required
                @blur="validateUsername"
              />

              <div v-if="errors.username" class="text-danger">
                {{ errors.username }}
              </div>
            </div>

            <div class="col-md-6 mb-3">
              <label for="gender" class="form-label">
                Gender
              </label>

              <select
                id="gender"
                v-model="formData.gender"
                class="form-select"
                @blur="validateGender"
              >
                <option value="">Select gender</option>
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
              </select>

              <div v-if="errors.gender" class="text-danger">
                {{ errors.gender }}
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-md-6 mb-3">
              <label for="password" class="form-label">
                Password
              </label>

              <input
                id="password"
                v-model="formData.password"
                type="password"
                class="form-control"
                minlength="4"
                maxlength="10"
                @blur="validatePassword"
              />

              <div v-if="errors.password" class="text-danger">
                {{ errors.password }}
              </div>
            </div>

            <div class="col-md-6 mb-3">
              <label for="confirmPassword" class="form-label">
                Confirm password
              </label>

              <input
                id="confirmPassword"
                v-model="formData.confirmPassword"
                type="password"
                class="form-control"
                @blur="validateConfirmPassword"
              />

              <div v-if="errors.confirmPassword" class="text-danger">
                {{ errors.confirmPassword }}
              </div>
            </div>
          </div>

          <div class="mb-3">
            <div class="form-check">
              <input
                id="isAustralian"
                v-model="formData.isAustralian"
                type="checkbox"
                class="form-check-input"
              />

              <label
                for="isAustralian"
                class="form-check-label"
              >
                Australian Resident?
              </label>
            </div>
          </div>

          <div class="mb-3">
            <label for="reason" class="form-label">
              Reason for joining
            </label>

            <textarea
              id="reason"
              v-model="formData.reason"
              class="form-control"
              rows="3"
              @blur="validateReason"
            ></textarea>

            <div v-if="errors.reason" class="text-danger">
              {{ errors.reason }}
            </div>
          </div>

          <div class="text-center">
            <button type="submit" class="btn btn-primary me-2">
              Submit
            </button>

            <button
              type="button"
              class="btn btn-secondary"
              @click="clearForm"
            >
              Clear
            </button>
          </div>
        </form>

        <div v-if="submittedUsers.length" class="mt-5">
          <h3>Submitted Users</h3>

          <table class="table table-bordered">
            <thead>
              <tr>
                <th>Username</th>
                <th>Australian Resident</th>
                <th>Gender</th>
                <th>Reason</th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="(user, index) in submittedUsers"
                :key="index"
              >
                <td>{{ user.username }}</td>
                <td>{{ user.isAustralian ? 'Yes' : 'No' }}</td>
                <td>{{ user.gender }}</td>
                <td>{{ user.reason }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>