<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const jsondata = ref(null)
const errorMessage = ref('')

const functionUrl =
  'https://us-central1-yankun-library.cloudfunctions.net/countBooks'

async function getBookCountAPI() {
  errorMessage.value = ''

  try {
    const response = await axios.get(functionUrl)

    jsondata.value = response.data

    console.log('Book count API data:')
    console.log(jsondata.value)
  } catch (error) {
    console.log(error)
    errorMessage.value = 'Unable to get book count.'
  }
}

onMounted(function () {
  getBookCountAPI()
})
</script>

<template>
  <div class="container mt-5">
    <h1>Book Count API</h1>

    <p v-if="errorMessage" class="text-danger">
      {{ errorMessage }}
    </p>

    <pre v-if="jsondata">{{ jsondata }}</pre>
  </div>
</template>