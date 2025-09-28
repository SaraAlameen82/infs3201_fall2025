const persistence = require('./Persistence')


/**
 * This function finds a photo by its ID.
 * 
 * @async
 * @param {Number} photoID - The ID of the photo to find
 * @param {Array<Object>} photos - An array of photos to get the photo from.
 * @returns {Promise<Object|undefined>} Returns a photo object, or undefined if the photo is not found.
 */
async function findPhoto(photoID) {
    let photos = await business.getPhotos()
    for (let p of photos) {
        if (p.id === photoID) {
            return p
        }
    }
    return undefined
}


async function getAlbums() {
    return persistence.getAlbums()
}


async function getPhotos() {
    return persistence.getPhotos()
}


async function getPhotoAlbums(albumID) {
    let albums = await persistence.getAlbums()
    let photoAlbums = []
    // Looping through the albums to match their ID's to the ones linked to the photo.
    for (let a of albums) {
        if (albumID.includes(a.id)) {
            photoAlbums.push(a.name)
        }
    }
    return photoAlbums
}


async function updatePhotos(newDescription, newTitle) {
    // Checking if the user gave an input or pressed enter.
    if (newTitle.length > 0) {
        photo.title = newTitle
    }
    if (newDescription.length > 0) {
        photo.description = newDescription
    }
    // Updating the file with the modifications.
    await persistence.updatePhotos(photos)
}


async function findAlbumPhotos() {
    let albums = await getAlbums()
    let photos = await getPhotos()
    // Looping through the albums to find the album by its name.
    for (a of albums) {
        if (a.name.toLowerCase() === albumName.toLowerCase()) {
            let albumID = a.id
            let photoList = []
            // Looping through the photos to match them with the ones in the specified album.
            for (p of photos) {
                if (p.albums.includes(albumID)) {
                    photoList.push(p)
                }
            }
            return photoList
        }
    }
    return undefined
}


async function addPhotoTag(photoID, newTag) {
    let photos = await getPhotos()
    let photo = await findPhoto(photoID)
    let photoTags = photo.tags
    // Checking if the tag already exists.
    if (photoTags.includes(newTag)) {
        return "exists"
    }
    else {
        photo.tags.push(tag)
        await updatePhotos(photos)
        return "updated"
    }
}


module.exports = {
    findPhoto,
    getAlbums,
    getPhotos,
    getPhotoAlbums,
    updatePhotos,
    findAlbumPhotos,
    addPhotoTag
}