const express = require('express')
const business = require('./business')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const path = require('path')

const app = express()

app.engine('handlebars', handlebars.engine({ defaultLayout: undefined }))
app.set('views', path.join(__dirname, "views"))
app.set('view engine', 'handlebars')

app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.urlencoded({ extended: false }))

// Rendering the landing page
/**
 * Render the landing page with a list of albums.
 *
 * @name GET /
 * @function
 * @async
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>} Renders the 'index' view with an `albums` array.
 */
app.get('/', async (req, res) => {
    const albums = await business.getAlbums()
    res.render('index', { albums })
})


/**
 * Show details for a single album, including its photos.
 *
 * @name GET /albums/:name
 * @function
 * @async
 * @param {import('express').Request} req - Express request object. Expects `req.params.name`.
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>} Renders the 'albumDetails' view with album information.
 */
app.get('/albums/:name', async (req, res) => {
    const albumName = req.params.name
    const photos = await business.findAlbumPhotos(albumName)
    let plural = ''

    if (photos.length === 1) {
        plural = 'photo'
    }
    else {
        plural = 'photos'
    }

    res.render('albums', {
        albumName,
        photos,
        photoCount: photos.length,
        plural
    })
})


/**
 * Show details for a single photo.
 *
 * @name GET /photos/:id
 * @function
 * @async
 * @param {import('express').Request} req - Express request object. Expects `req.params.id`.
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>} Renders the 'photoDetails' view with the `photo` object.
 */
app.get('/photos/:id', async (req, res) => {
    const photoId = parseInt(req.params.id)
    const photo = await business.findPhoto(photoId)
    res.render('photoDetails', { photo })
})


/**
 * Render the edit form for a photo.
 *
 * @name GET /photos/:id/edit
 * @function
 * @async
 * @param {import('express').Request} req - Express request object. Expects `req.params.id`.
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>} Renders the 'editPhoto' view with the `photo` object.
 */
app.get('/photos/:id/edit', async (req, res) => {
    const photoId = parseInt(req.params.id)
    const photo = await business.findPhoto(photoId)
    res.render('editPhoto', { photo })
})


/**
 * Handle submission of the edit form and update the photo.
 *
 * @function
 * @async
 * @param {import('express').Request} req - Express request object. Expects `req.params.id` and `req.body.title`/`req.body.description`.
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>} Updates the photo then redirects to the photo details page.
 */
app.post('/photos/:id/edit', async (req, res) => {
    const photoId = parseInt(req.params.id)
    const { title, description } = req.body

    // business.updatePhotos expects: (photoID, newDescription, newTitle)
    await business.updatePhotos(photoId, description, title)

    res.redirect(`/photos/${photoId}`)
})


app.listen(8000, () => {
    console.log('Server is running at port ', 8000)
})
