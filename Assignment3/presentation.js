const prompt = require('prompt-sync')()
const business = require('./business')


/**
 * Displays the details of a photo.
 * 
 * @async
 * @param {Number} photoID - The ID of the photo to display.
 */
async function displayPhoto(photoID) {
    let photo = await business.findPhoto(photoID)

    if (photo === undefined) {
        // Printing an error message if the photo is not found.
        console.log("\nPhoto not found.")
    }
    else {
        let albumID = photo.albums
        let photoAlbums = await business.getPhotoAlbums(albumID)

        console.log(`\nFilename: ${photo.filename}`)
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
 * Prompts the user to modify the title and description of a photo.
 * 
 * @async
 * @param {Number} photoID - The ID of the photo to update.
 */
async function updatePhotoDetails(photoID) {
    let photo = await business.findPhoto(photoID)
    if (photo === undefined) {
        console.log("\nPhoto not found.")
    }
    else {
        console.log("Press Enter to reuse existing values.")
        let newTitle = prompt(`Enter value for title [${photo.title}]: `)
        let newDescription = prompt(`Enter value for description [${photo.description}]: `)
        // Updating the file with the modifications.
        await business.updatePhotos(photoID, newDescription, newTitle)
        console.log("\nPhoto updated!")
    }
}


/**
 * Displays all photos linked to a specified album.
 * 
 * @async
 * @param {String} albumName - The name of the album.
 */
async function albumPhotoList(albumName) {
    let photoList = await business.findAlbumPhotos(albumName)
    if (photoList === undefined) {
        console.log(`\nThere is no album with the name "${albumName}"`)
    }
    else {
        console.log("\nfilename      resolution      tags")
        console.log('-----------------------------------------')
        for (p of photoList) {
            let tags = p.tags
            console.log(`${p.filename}   -   ${p.resolution}   -   ${tags.join(':')}`)
        }
    }
}


/**
 * Prompts the user to add a tag to a photo's list of tags.
 * 
 * @async
 * @param {Number} photoID - The ID of the photo to add a tag to.
 */
async function addTag(photoID) {
    let photo = await business.findPhoto(photoID)
    if (photo === undefined) {
        console.log("\nPhoto not found.")
    }
    else {
        let newTag = prompt(`What tag would you like to add (${photo.tags})? `)
        let result = await business.addPhotoTag(photoID, newTag)
        // Make addPhotoTag return "exists" if the tag already exists, and "updated" if the tag is added successfully.
        if (result === "exists") {
            console.log(`Photo '${photoID}' already has the tag '${newTag}'`)
        }
        else {
            console.log("\nUpdated!")
        }
    }
}


/**
 * Main program loop that allows the user to login and perform different tasks.
 * 
 * @async
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
            await addTag(photoID)
        }
        else if (choice === 5) {
            process.exit()
        }
        else {
            console.log("Try Again!!")
        }
    }
}


main()
