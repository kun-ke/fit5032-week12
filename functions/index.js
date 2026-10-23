const { setGlobalOptions } = require('firebase-functions/v2')
const { onRequest, onCall, HttpsError } = require('firebase-functions/v2/https')
const { onDocumentCreated } = require('firebase-functions/v2/firestore')
const { initializeApp } = require('firebase-admin/app')
const { getFirestore } = require('firebase-admin/firestore')
const cors = require('cors')({ origin: true })

initializeApp()
const db = getFirestore()

setGlobalOptions({
  region: 'us-central1',
  maxInstances: 2
})

// Week 9.1
// Count the number of books in Firestore.
exports.countBooks = onRequest(
  { invoker: 'public' },
  (request, response) => {

    return cors(request, response, async () => {

      if (request.method !== 'GET') {
        response.set('Allow', 'GET')
        response.status(405).json({
          error: 'Please use GET.'
        })
        return
      }

      try {
        const snapshot =
          await db.collection('books').get()

        response.status(200).json({
          count: snapshot.size
        })
      } catch (error) {

        console.error(
          'Could not count books:',
          error
        )

        response.status(500).json({
          error: 'Could not count books.'
        })
      }
    })
  }
)


// Keep the existing book count function working.
exports.getBookCount = onCall(
  async (request) => {

    if (!request.auth) {
      throw new HttpsError(
        'unauthenticated',
        'Please sign in first.'
      )
    }

    const result =
      await db.collection('books')
        .count()
        .get()

    return {
      count: result.data().count
    }
  }
)


// Week 9.2
// Automatically change new book text to uppercase.
exports.makeBookUppercase =
  onDocumentCreated(
    'books/{bookId}',
    async (event) => {

      const snapshot = event.data

      if (!snapshot) {
        return
      }

      const book = snapshot.data()
      const changes = {}

      for (const field in book) {

        if (typeof book[field] === 'string') {

          const uppercaseValue =
            book[field].toUpperCase()

          if (book[field] !== uppercaseValue) {
            changes[field] = uppercaseValue
          }
        }
      }

      if (Object.keys(changes).length > 0) {
        await snapshot.ref.update(changes)
      }
    }
  )


// Week 10.2
// Return all books as JSON.
exports.getAllBooks = onRequest(
  { invoker: 'public' },
  (request, response) => {

    return cors(request, response, async () => {

      if (request.method !== 'GET') {
        response.set('Allow', 'GET')

        response.status(405).json({
          error: 'Please use GET.'
        })

        return
      }

      try {

        const snapshot =
          await db.collection('books').get()

        const books = []

        snapshot.forEach((doc) => {

          books.push({
            id: doc.id,
            ...doc.data()
          })

        })

        response.status(200).json(books)

      } catch (error) {

        console.error(
          'Could not get books:',
          error
        )

        response.status(500).json({
          error: 'Could not get books.'
        })
      }
    })
  }
)
