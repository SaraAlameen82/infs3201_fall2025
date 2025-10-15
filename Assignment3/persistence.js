const fs = require('fs/promises')


/**
 * Reads the "photos.json" file, and returns the data inside it as an array of photos.
 * 
 * @async
 * @returns An array of photos (an array of objects)
 */
async function getPhotos() {
    return JSON.parse(await fs.readFile("photos.json", "utf8"))
}


/**
 * Reads the "albums.json" file, and returns the data inside it as an array of albums.
 * 
 * @async
 * @returns An array of albums (an array of objects)
 */
async function getAlbums() {
    return JSON.parse(await fs.readFile("albums.json", "utf8"))
}


/**
 * Takes an array of photos and writes it in the photos.json file.
 * 
 * @async
 * @param {Array<Object>} photos - An array of photo objects. 
 */
async function updatePhotos(photos) {
    await fs.writeFile('photos.json', JSON.stringify(photos, null, 2))
}


module.exports = {
    getAlbums,
    updatePhotos,
    getPhotos
}
