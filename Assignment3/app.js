const express = require('express')
const business = require('./business')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const path = require('path')

const app = express()

app.engine('handlebars', handlebars({ defaultLayout: undefined }))
app.set('views', path.join(__dirname, "views"))
app.set('view engine', 'handlebars')
app.use('/static', express.static(path.join(__dirname, "public")))
app.use(bodyParser.urlencoded({ extended: false }))

// Rendering the landing page
app.get('/', async (req, res) => {
    const albums = await business.getAlbums()
    res.render('index', { albums })
})


app.get('/albums/:name', async (req, res) => {
    const albumName = req.params.name
    const photos = await business.findAlbumPhotos(albumName)

    res.render('albumDetails', {
        albumName,
        photos,
        photoCount: photos.length,
        plural: photos.length === 1 ? 'photo' : 'photos'
    })
})


app.get('/photos/:id', async (req, res) => {
    const photoId = req.params.id
    const photo = await business.findPhoto(photoId)
    res.render('photoDetails', { photo })
})


app.get('/photos/:id/edit', async (req, res) => {
    const photoId = req.params.id
    const photo = await business.findPhoto(photoId)
    res.render('editPhoto', { photo })
})


app.post('/photos/:id/edit', async (req, res) => {
    const photoId = req.params.id
    const { title, description } = req.body

    await business.updatePhotos(photoID, description, title)

    res.redirect(`/photos/${photoId}`)
})


app.listen(8000, () => {
    console.log('Server is running at port ', 8000)
})
