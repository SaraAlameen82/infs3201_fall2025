const prompt = require('prompt-sync')()
const fs = require('fs/promises')


/**
 * This functions reads the "photos.json" file, and returns the data inside it as an array of photos.
 * 
 * @async
 * @returns An array of photos (an array of objects)
 */
async function getPhotos() {
    return JSON.parse(await fs.readFile("photos.json", "utf8"))
}


/**
 * This functions reads the "albums.json" file, and returns the data inside it as an array of albums.
 * 
 * @async
 * @returns An array of albums (an array of objects)
 */
async function getAlbums() {
    return JSON.parse(await fs.readFile("albums.json", "utf8"))
}


/**
 * This function takes an array of photos and writes it in the photos.json file.
 * 
 * @async
 * @param {Array<Object>} photos - An array of photo objects. 
 */
async function updatePhotos(photos) {
    await fs.writeFile('photos.json', JSON.stringify(photos, null, 2))
}


/**
 * This function finds a photo by its ID.
 * 
 * @async
 * @param {Number} photoID - The ID of the photo to find
 * @param {Array<Object>} photos - An array of photos to get the photo from.
 * @returns {Promise<Object|undefined>} Returns a photo object, or undefined if the photo is not found.
 */
async function findPhoto(photoID, photos) {
    for (let p of photos) {
        if (p.id === photoID) {
            return p
        }
    }
    return undefined
}


/**
 * The function displays a photo's details.
 * 
 * @async
 * @param {Number} photoID - The ID of the photo to be displayed.
 */
async function displayPhoto(photoID) {
    let photos = await getPhotos()
    let photo = await findPhoto(photoID, photos)
    if (photo === undefined) {
        console.log("Photo not found.")
        // Return to the main function if the photo is not found.
        return
    }
    else {
        let albums = await getAlbums()
        let albumID = photo.albums
        let photoAlbums = []
        // Looping through the albums to match their ID's to the ones linked to the photo.
        for (let a of albums) {
            if (albumID.includes(a.id)) {
                photoAlbums.push(a.name)
            }
        }
        console.log(`Filename: ${photo.filename}`)
        console.log(`Title: ${photo.title}`)
        // Converting the date's format. 
        console.log(`Date: ${new Date(photo.date).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
        })}`)
        console.log(`Albums: ${photoAlbums}`)
        console.log(`Tags: ${photo.tags}`)
    }
}


/**
 * This function prompts the user to modify the title and description of a photo.
 * 
 * @async
 * @param {Number} photoID - ID of the photo to modify its details.
 */
async function updatePhotoDetails(photoID) {
    let photos = await getPhotos()
    let photo = await findPhoto(photoID, photos)
    if (photo === undefined) {
        console.log("Photo not found.")
        return
    }
    else {
        console.log("Press Enter to reuse existing values.")
        let newTitle = prompt(`Enter value for title [${photo.title}]: `)
        let newDescription = prompt(`Enter value for description [${photo.description}]: `)
        // Checking if the user gave an input or pressed enter.
        if (newTitle.length > 0) {
            photo.title = newTitle
        }
        if (newDescription.length > 0) {
            photo.description = newDescription
        }
        // Updating the file with the modifications.
        await updatePhotos(photos)
        console.log("Photo updated!")
    }
}


/**
 * The function takes the album name and display's all photos linked to it.
 * 
 * @async
 * @param {String} albumName - The name of the album.
 */
async function albumPhotoList(albumName) {
    let albums = await getAlbums()
    console.log()
    let photos = await getPhotos()
    // Looping through the albums to find the album by its name.
    for (a of albums) {
        if (a.name.toLowerCase() === albumName.toLowerCase()) {
            let albumID = a.id
            // Looping through the photos to match them with the ones in the specified album.
            for (p of photos) {
                if (p.albums.includes(albumID)) {
                    let tags = p.tags
                    console.log("filename, resolution, tags")
                    console.log(`${p.filename}, ${p.resolution}, ${tags.join(':')}`)
                }
            }
            return
        }
    }
    console.log(`There is no album with the name "${albumName}"`)
}


/**
 * The function prompts the user to add a tag to a photo's list of tags.
 * 
 * @async
 * @param {Number} photoID - The ID of the photo to add a tag to.
 */
async function addPhotoTag(photoID) {
    let photos = await getPhotos()
    let photo = await findPhoto(photoID, photos)
    if (photo === undefined) {
        console.log("Photo not found.")
    }
    else {
        let photoTags = photo.tags
        let tag = prompt(`What tag would you like to add (${photo.tags})? `)
        // Checking if the tag already exists.
        if (photoTags.includes(tag)) {
            console.log(`Photo '${photoID}' already has the tag '${tag}'`)
            return
        }
        else {
            photo.tags.push(tag)
            await updatePhotos(photos)
            console.log("Updated!")
            return
        }
    }
}


/**
 * Main program loop that allows the user to:
 * 1. Find and display a photo
 * 2. Update photo details
 * 3. Display all photos in an album
 * 4. Add a tag to a photo
 * 5. Exit
 */
async function main() {
    while (true) {
        console.log("\n1. Find Photo \n2. Update Photo Details \n3. Album Photo List \n4. Tag Photo \n5. Exit\n")
        let choice = Number(prompt("Your Selection: "))

        if (choice === 1) {
            let photoID = Number(prompt("Photo ID? "))
            await displayPhoto(photoID)
        }
        else if (choice === 2) {
            let photoID = Number(prompt("Photo ID? "))
            await updatePhotoDetails(photoID)
        }
        else if (choice === 3) {
            let albumName = prompt("What is the name of the album? ")
            await albumPhotoList(albumName)
        }
        else if (choice === 4) {
            let photoID = Number(prompt("What photo ID to tag? "))
            await addPhotoTag(photoID)
        }
        else if (choice === 5) {
            break
        }
        else {
            console.log("Try Again!!")
        }
    }
}

main()
