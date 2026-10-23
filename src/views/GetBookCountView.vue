<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useEmulators } from '../firebase'

const count = ref(null)
const loading = ref(false)
const errorMessage = ref('')

const functionUrl = useEmulators
  ? 'http://127.0.0.1:5001/demo-yankun-library/us-central1/countBooks'
  : 'https://us-central1-yankun-library.cloudfunctions.net/countBooks'

async function getBookCount() {
  loading.value = true
  count.value = null
  errorMessage.value = ''

  try {
    const response = await axios.get(functionUrl)
    if (!Number.isInteger(response.data.count) || response.data.count < 0) {
      throw new Error('Invalid book count.')
    }
    count.value = response.data.count
  } catch (error) {
    errorMessage.value = `Error: ${error.message}`
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="container my-4">
    <h1>Book Counter</h1>
    <p v-if="useEmulators" class="alert alert-warning">
      Local emulator — not deployed evidence
    </p>
    <button class="btn btn-primary" :disabled="loading" @click="getBookCount">
      {{ loading ? 'Getting count...' : 'Get Book Count' }}
    </button>
    <p v-if="count !== null" class="mt-3" role="status">
      Total number of books: {{ count }}
    </p>
    <p v-else-if="errorMessage" class="text-danger mt-3" role="alert">
      {{ errorMessage }}
    </p>
  </main>
</template>
