<script setup>
import { computed, onUnmounted, ref } from 'vue'
import { onAuthStateChanged } from 'firebase/auth'
import { addDoc, collection, onSnapshot, serverTimestamp } from 'firebase/firestore'
import { httpsCallable } from 'firebase/functions'
import { auth, db, functions, useEmulators } from '../firebase'

const fields = ['isbn', 'name', 'author', 'genre']
const labels = { isbn: 'ISBN', name: 'Name', author: 'Author', genre: 'Genre' }
const maxLengths = { isbn: 40, name: 200, author: 200, genre: 100 }
const book = ref({ isbn: '', name: '', author: '', genre: '' })
const user = ref(null)
const authReady = ref(false)
const books = ref([])
const bookCount = ref(null)
const counting = ref(false)
const saving = ref(false)
const errorMessage = ref('')
const countError = ref('')
const latestId = ref('')
const submittedBook = ref(null)
const latestBook = computed(() => books.value.find((item) => item.id === latestId.value))

// This comparison only checks the result. The Cloud Function changes the saved data.
const functionFinished = computed(() => submittedBook.value && latestBook.value &&
  fields.every((field) => latestBook.value[field] === submittedBook.value[field].toUpperCase()))

let unsubscribeBooks = null
const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
  if (unsubscribeBooks) unsubscribeBooks()
  user.value = currentUser
  authReady.value = true
  books.value = []
  bookCount.value = null
  latestId.value = ''
  submittedBook.value = null
  errorMessage.value = ''
  countError.value = ''

  if (currentUser) {
    unsubscribeBooks = onSnapshot(collection(db, 'books'), (snapshot) => {
      books.value = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
    }, (error) => {
      books.value = []
      errorMessage.value = `Could not read books: ${error.message}`
    })
  }
})

onUnmounted(() => {
  unsubscribeAuth()
  if (unsubscribeBooks) unsubscribeBooks()
})

async function getBookCount() {
  counting.value = true
  countError.value = ''
  bookCount.value = null
  try {
    const getCount = httpsCallable(functions, 'getBookCount')
    const result = await getCount()
    if (!Number.isInteger(result.data.count) || result.data.count < 0) {
      throw new Error('The Function returned an invalid count.')
    }
    bookCount.value = result.data.count
  } catch (error) {
    countError.value = `Could not get the book count: ${error.message}`
  } finally {
    counting.value = false
  }
}

async function addBook() {
  errorMessage.value = ''
  const values = {}
  for (const field of fields) values[field] = book.value[field].trim()
  if (fields.some((field) => !values[field])) {
    errorMessage.value = 'Please complete all four fields.'
    return
  }

  saving.value = true
  try {
    // Keep the original case here so the Firestore trigger can convert it.
    const document = await addDoc(collection(db, 'books'), {
      ...values,
      createdAt: serverTimestamp(),
    })
    latestId.value = document.id
    submittedBook.value = values
    book.value = { isbn: '', name: '', author: '', genre: '' }
    await getBookCount()
  } catch (error) {
    errorMessage.value = `Could not add the book: ${error.message}`
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <main class="container my-4">
    <h1>Library Books</h1>
    <p class="text-muted">FIT5032 Week 9 — Firebase Functions</p>
    <p v-if="useEmulators" class="alert alert-warning">
      Local emulator — not deployed evidence
    </p>
    <p v-if="!authReady">Checking sign-in...</p>
    <p v-else-if="!user" class="alert alert-info">
      Please <RouterLink to="/FireLogin">sign in</RouterLink> or
      <RouterLink to="/FireRegister">register</RouterLink> to view and add books.
    </p>

    <template v-else>
      <p>Signed in as {{ user.email }}</p>
      <section class="border rounded p-3 mb-4">
        <h2 class="h4">Task 9.1: Book count</h2>
        <p>The getBookCount Function reads the number of books from Firestore.</p>
        <button class="btn btn-primary" :disabled="counting || saving" @click="getBookCount">
          {{ counting ? 'Getting count...' : 'Get book count' }}
        </button>
        <p v-if="bookCount !== null" class="fs-5 mt-3 mb-0" role="status">
          Number of books: {{ bookCount }}
        </p>
        <p v-if="countError" class="text-danger mt-3 mb-0" role="alert">{{ countError }}</p>
      </section>

      <section class="border rounded p-3 mb-4">
        <h2 class="h4">Task 9.2: Add a book</h2>
        <p>Enter lowercase or mixed-case text. A Function will convert the saved fields to uppercase.</p>
        <form class="row g-3" @submit.prevent="addBook">
          <div v-for="field in fields" :key="field" class="col-md-6">
            <label :for="field" class="form-label">{{ labels[field] }}</label>
            <input :id="field" v-model="book[field]" class="form-control" type="text" required :maxlength="maxLengths[field]" :disabled="saving" />
          </div>
          <div class="col-12">
            <button class="btn btn-success" type="submit" :disabled="saving">
              {{ saving ? 'Adding book...' : 'Add book' }}
            </button>
          </div>
        </form>
        <p v-if="errorMessage" class="text-danger mt-3 mb-0" role="alert">{{ errorMessage }}</p>
      </section>

      <section v-if="submittedBook" class="border rounded p-3 mb-4">
        <h2 class="h4">Latest book: before and after</h2>
        <p class="text-break mb-2">Document ID: {{ latestId }}</p>
        <p :class="functionFinished ? 'text-success' : 'text-muted'" role="status">
          {{ functionFinished ? 'Uppercase values received from Firestore.' : 'Waiting for Function to uppercase the saved book...' }}
        </p>
        <div class="table-responsive">
          <table class="table table-bordered mb-0">
            <thead><tr><th>Field</th><th>Submitted value</th><th>Current Firestore value</th></tr></thead>
            <tbody>
              <tr v-for="field in fields" :key="field">
                <th scope="row">{{ field }}</th>
                <td>{{ submittedBook[field] }}</td>
                <td>{{ latestBook ? latestBook[field] : 'Waiting for Firestore...' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 class="h4">Books in Firestore</h2>
        <p v-if="!books.length">No books to display yet.</p>
        <div v-else class="table-responsive">
          <table class="table table-striped table-bordered">
            <thead><tr><th>ISBN</th><th>Name</th><th>Author</th><th>Genre</th></tr></thead>
            <tbody>
              <tr v-for="item in books" :key="item.id">
                <td>{{ item.isbn }}</td><td>{{ item.name }}</td><td>{{ item.author }}</td><td>{{ item.genre }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </template>
  </main>
</template>
