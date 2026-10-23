<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const jsondata = ref(null)
const errorMessage = ref('')

const functionUrl =
  'https://us-central1-yankun-library.cloudfunctions.net/getAllBooks'

async function getAllBookAPI() {
  errorMessage.value = ''

  try {
    const response = await axios.get(functionUrl)

    jsondata.value = response.data

    console.log('All books API data:')
    console.log(jsondata.value)
  } catch (error) {
    console.log(error)
    errorMessage.value = 'Unable to get books.'
  }
}

onMounted(function () {
  getAllBookAPI()
})
</script>

<template>
  <div class="container mt-5">
    <h1>Get All Book API</h1>

    <p v-if="errorMessage" class="text-danger">
      {{ errorMessage }}
    </p>

    <pre v-if="jsondata">{{ JSON.stringify(jsondata, null, 2) }}</pre>
  </div>
</template>