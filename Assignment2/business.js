const persistence = require('./persistence')

/**
 * Retrieves all albums from the "albums.json" file.
 * 
 * @returns {Promise<Array<Object>>} An array of album objects.
 */
async function getAlbums() {
    return await persistence.getAlbums()
}

/**
 * Retrieves all photos from the "photos.json" file.
 * 
 * @returns {Promise<Array<Object>>} An array of photo objects.
 */
async function getPhotos() {
    return await persistence.getPhotos()
}


/**
 * This function finds a photo by its ID, and checks if the logged in user has access to it.
 * 
 * @async
 * @param {Number} photoID - The ID of the photo to find
 * @param {Array<Object>} photos - An array of photos to get the photo from.
 * @returns {Promise<Object|undefined>} Returns a photo object if it is found and accessible, "accessDenied" if not accessible, or undefined if the photo is not found.
 */
async function findPhoto(userID, photoID) {
    let photos = await persistence.getPhotos()
    for (let p of photos) {
        if (p.id === photoID) {
            if (p.owner === userID) {
                return p
            }
            else {
                return 'accessDenied'
            }
        }
    }
    return undefined
}

/**
 * Retrieves the names of albums linked to a photo.
 * 
 * @async
 * @param {Array<Number>} albumID - An array of album IDs linked to the photo.
 * @returns {Promise<Array<String>>} An array of album names.
 */
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

/**
 * Updates the title and description of a photo.
 * 
 * @async
 * @param {Number} userID - The ID of the user requesting the update.
 * @param {Number} photoID - The ID of the photo to update.
 * @param {String} newDescription - The new description for the photo.
 * @param {String} newTitle - The new title for the photo.
 */
async function updatePhotos(userID, photoID, newDescription, newTitle) {
    let photos = await getPhotos()
    let photo = await findPhoto(userID, photoID)
    console.log('check---------')

    // Checking if the user gave an input or pressed enter.
    if (newTitle.length > 0) {
        console.log('check---------')
        photo.title = newTitle
    }
    if (newDescription.length > 0) {
        photo.description = newDescription
    }

    // Finding the photo index
    let index = photos.findIndex(p => p.id === photoID)

    // Updating the photos array 
    if (index !== -1) {
        photos[index] = photo
    }

    // Updating the 'photos.json' file
    await persistence.updatePhotos(photos)
}

/**
 * Finds all photos linked to a specified album and accessible by the user.
 * 
 * @async
 * @param {Number} userID - The ID of the user requesting the photos.
 * @param {String} albumName - The name of the album.
 * @returns {Promise<Array<Object>|undefined>} An array of photo objects or undefined if the album is not found.
 */
async function findAlbumPhotos(userID, albumName) {
    let albums = await getAlbums()
    let photos = await getPhotos()

    // Looping through the albums to find the album by its name.
    for (a of albums) {
        if (a.name.toLowerCase() === albumName.toLowerCase()) {
            let albumID = a.id
            let photoList = []

            // Looping through the photos to match them with the ones in the specified album.
            for (p of photos) {
                if (p.albums.includes(albumID) && p.owner === userID) {
                    photoList.push(p)
                }
            }
            return photoList
        }
    }
    return undefined
}

/**
 * Adds a tag to a photo's list of tags.
 * 
 * @async
 * @param {Number} userID - The ID of the user requesting the tag addition.
 * @param {Number} photoID - The ID of the photo to add a tag to.
 * @param {String} newTag - The tag to add to the photo.
 * @returns {Promise<String>} "exists" if the tag already exists, "updated" if the tag is added successfully.
 */
async function addPhotoTag(userID, photoID, newTag) {
    let photos = await getPhotos()
    let photo = await findPhoto(userID, photoID)
    let photoTags = photo.tags

    // Checking if the tag already exists.
    if (photoTags.includes(newTag)) {
        return "exists"
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

/**
 * Authenticates a user based on their username and password.
 * 
 * @async
 * @param {String} password - The user's password.
 * @param {String} username - The user's username.
 * @returns {Promise<Number|String>} The user's ID if authenticated, "denied" if authentication fails.
 */
async function login(password, username) {
    let users = await persistence.getUsers()
    for (let u of users) {
        if (u.password === password && u.username === username) {
            return u.id
        }
    }

    // Returning "denied" if user not found
    return "denied"
}


// This function was used to Assign random owners to each photo
// async function assignOwners() {
//     const photos = await getPhotos()

//     // Assigning a random owner for each photo 
//     photos.forEach(photo => {
//         photo.owner = Math.floor(Math.random() * 5) + 1
//     })

//     // Write the updated photos back to the file
//     await persistence.updatePhotos(photos)
// }

// assignOwners()


module.exports = {
    findPhoto,
    getAlbums,
    getPhotos,
    getPhotoAlbums,
    updatePhotos,
    findAlbumPhotos,
    addPhotoTag,
    login
}
