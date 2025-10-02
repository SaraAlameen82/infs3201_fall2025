const persistence = require('./persistence')


/**
 * This function finds a photo by its ID.
 * 
 * @async
 * @param {Number} photoID - The ID of the photo to find
 * @param {Array<Object>} photos - An array of photos to get the photo from.
 * @returns {Promise<Object|undefined>} Returns a photo object, or undefined if the photo is not found.
 */
async function findPhoto(photoID) {
    let photos = await persistence.getPhotos()
    for (let p of photos) {
        if (p.id === photoID) {
            return p
        }
    }
    return undefined
}


async function getAlbums() {
    return await persistence.getAlbums()
}


async function getPhotos() {
    return await persistence.getPhotos()
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


async function updatePhotos(photoID, newDescription, newTitle) {
    // Checking if the user gave an input or pressed enter.
    let photos = await getPhotos()
    let photo = await findPhoto(photoID)
    if (newTitle.length > 0 && newDescription.length > 0) {
        photo.title = newTitle
        photo.description = newDescription
    }
    // if (newDescription.length > 0) {
    //     photo.description = newDescription
    // }
    // Updating the file with the modifications.
    await persistence.updatePhotos(photos)
}


async function findAlbumPhotos(albumName) {
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

    // Check if the photo exists
    if (!photo) {
        return "Photo not found"
    }

    let photoTags = photo.tags

    // Checking if the tag already exists.
    if (photoTags.includes(newTag)) {
        return "Tag already exists."
    }
    else {
        // Add the new tag
        photo.tags.push(newTag)

        // Find the index of the photo in the array
        let index = photos.findIndex(p => p.id === photoID)

        // Update the photo in the array
        if (index !== -1) {
            photos[index] = photo
        }

        // Write the updated photos array to the file
        await persistence.updatePhotos(photos)
        return "updated"

        // photo.tags.push(newTag)
        // await persistence.updatePhotos(photos)
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
