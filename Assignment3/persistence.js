// const fs = require('fs/promises')
const { MongoClient } = require('mongodb')
const uri = 'mongodb+srv://60101453:sara0802@60101453.0eycr.mongodb.net/'


/**
 * Connects to mongodb and gets the database needed
 * 
 * @returns A database containing the albums and photos collections.
 */
async function connectMongodb() {
    const client = new MongoClient(uri)
    await client.connect()
    const db = client.db('infs3201_fall2025')
    return db
}


/**
 * Gets the 'photos' collection from the database, and returns the data inside it as an array of photos.
 * 
 * @async
 * @returns An array of photos (an array of objects)
 */
async function getPhotos() {
    let db = await connectMongodb()
    let photosCollection = db.collection('photos')
    return await photosCollection.find({}).toArray()
}


/**
 * Gets the 'albums' collection from the database, and returns the data inside it as an array of albums.
 * 
 * @async
 * @returns An array of albums (an array of objects)
 */
async function getAlbums() {
    let db = await connectMongodb()
    let albumsCollection = db.collection('albums')
    return await albumsCollection.find({}).toArray()
}


/**
 * Takes an array of photos and updates the photos collection based on it.
 * 
 * @async
 * @param {Array<Object>} photos - An array of photo objects. 
 */
async function updatePhotos(photos) {
    const db = await connectMongodb()
    const photosCollection = db.collection('photos')

    for (const photo of photos) {
        await photosCollection.updateOne(
            { _id: photo._id },
            { $set: photo },
            { upsert: true }
        )
    }
}


module.exports = {
    getAlbums,
    getPhotos,
    updatePhotos
}
