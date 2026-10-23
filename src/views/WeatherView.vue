<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const apiKey = '61dd6364665f0a8082a570b6898a5fb8'

const city = ref('')
const weatherData = ref(null)
const errorMessage = ref('')
const loading = ref(false)

async function getWeatherByLocation(latitude, longitude) {
  loading.value = true
  errorMessage.value = ''

  try {
    const response = await axios.get(
      'https://api.openweathermap.org/data/2.5/weather',
      {
        params: {
          lat: latitude,
          lon: longitude,
          appid: apiKey,
          units: 'metric'
        }
      }
    )

    weatherData.value = response.data
    console.log(weatherData.value)
  } catch (error) {
    console.log(error)
    errorMessage.value = 'Unable to get weather information.'
  }

  loading.value = false
}

function getCurrentLocation() {
  errorMessage.value = ''

  if (!navigator.geolocation) {
    errorMessage.value = 'Geolocation is not supported by this browser.'
    return
  }

  navigator.geolocation.getCurrentPosition(
    function (position) {
      const latitude = position.coords.latitude
      const longitude = position.coords.longitude

      getWeatherByLocation(latitude, longitude)
    },

    function (error) {
      console.log(error)
      errorMessage.value =
        'Unable to get your location. Please allow location access.'
    }
  )
}

async function searchByCity() {
  errorMessage.value = ''

  if (city.value.trim() === '') {
    errorMessage.value = 'Please enter a city name.'
    return
  }

  loading.value = true

  try {
    const response = await axios.get(
      'https://api.openweathermap.org/data/2.5/weather',
      {
        params: {
          q: city.value,
          appid: apiKey,
          units: 'metric'
        }
      }
    )

    weatherData.value = response.data
    console.log(weatherData.value)
  } catch (error) {
    console.log(error)
    weatherData.value = null
    errorMessage.value = 'City not found.'
  }

  loading.value = false
}

onMounted(function () {
  getCurrentLocation()
})
</script>

<template>
  <div class="container mt-5">
    <div class="col-md-6 mx-auto">

      <h1 class="mb-4">Weather App</h1>

      <div class="input-group mb-3">
        <input
          v-model="city"
          type="text"
          class="form-control"
          placeholder="Enter city name, e.g. Clayton, AU"
        />

        <button
          class="btn btn-primary"
          @click="searchByCity"
        >
          Search
        </button>
      </div>

      <button
        class="btn btn-secondary mb-4"
        @click="getCurrentLocation"
      >
        Current Location
      </button>

      <p v-if="loading">
        Loading weather information...
      </p>

      <p
        v-if="errorMessage"
        class="text-danger"
      >
        {{ errorMessage }}
      </p>

      <div
        v-if="weatherData"
        class="card"
      >
        <div class="card-body text-center">

          <h2>
            {{ weatherData.name }},
            {{ weatherData.sys.country }}
          </h2>

          <img
            :src="
              'https://openweathermap.org/img/wn/' +
              weatherData.weather[0].icon +
              '@2x.png'
            "
            alt="Weather Icon"
          />

          <h3>
            {{ Math.round(weatherData.main.temp) }} °C
          </h3>

          <p>
            {{ weatherData.weather[0].description }}
          </p>

          <p>
            Feels like:
            {{ Math.round(weatherData.main.feels_like) }} °C
          </p>

          <p>
            Humidity:
            {{ weatherData.main.humidity }}%
          </p>

        </div>
      </div>

    </div>
  </div>
</template>