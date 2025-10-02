const prompt = require('prompt-sync')()
const business = require('./business')


/**
 * Displays the details of a photo.
 * 
 * @async
 * @param {Number} userID - The ID of the user requesting the photo.
 * @param {Number} photoID - The ID of the photo to display.
 */
async function displayPhoto(userID, photoID) {
    let photo = await business.findPhoto(userID, photoID)

    if (photo === undefined) {
        // Printing an error message if the photo is not found.
        console.log("\nPhoto not found.")
    }
    else if (photo === 'accessDenied') {
        console.log('\nAccess Denied! You do not have access to this photo.')
        return
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
 * @param {Number} userID - The ID of the user requesting the update.
 * @param {Number} photoID - The ID of the photo to update.
 */
async function updatePhotoDetails(userID, photoID) {
    let photo = await business.findPhoto(userID, photoID)
    if (photo === undefined) {
        console.log("\nPhoto not found.")
    }
    else if (photo === 'accessDenied') {
        console.log('\nAccess Denied! You do not have access to this photo.')
        return
    }
    else {
        console.log('check---------')
        console.log("Press Enter to reuse existing values.")
        let newTitle = prompt(`Enter value for title [${photo.title}]: `)
        let newDescription = prompt(`Enter value for description [${photo.description}]: `)
        // Updating the file with the modifications.
        await business.updatePhotos(userID, photoID, newDescription, newTitle)
        console.log("\nPhoto updated!")
    }
}


/**
 * Displays all photos linked to a specified album.
 * 
 * @async
 * @param {Number} userID - The ID of the user requesting the album photos.
 * @param {String} albumName - The name of the album.
 */
async function albumPhotoList(userID, albumName) {
    let photoList = await business.findAlbumPhotos(userID, albumName)
    if (photoList === undefined) {
        console.log(`\nThere is no album with the name "${albumName}"`)
    }
    else if (photoList.length === 0) {
        console.log("\nYou do not have access to any of this album's photos")
        return
    }
    else {
        console.log("\nfilename      resolution      tags")
        console.log('-----------------------------------------')
        for (p of photoList) {
            let tags = p.tags
            console.log(`${p.filename}   -   ${p.resolution}   -   ${tags.join(':')}`)
        }
        console.log('\n--- Note: only the photos you have access to are displayed ---')
    }
}


/**
 * Prompts the user to add a tag to a photo's list of tags.
 * 
 * @async
 * @param {Number} userID - The ID of the user requesting the tag addition.
 * @param {Number} photoID - The ID of the photo to add a tag to.
 */
async function addTag(userID, photoID) {
    let photo = await business.findPhoto(userID, photoID)
    if (photo === undefined) {
        console.log("\nPhoto not found.")
    }
    else if (photo === 'accessDenied') {
        console.log('\nAccess Denied! You do not have access to this photo.')
        return
    }
    else {
        let newTag = prompt(`What tag would you like to add (${photo.tags})? `)
        let result = await business.addPhotoTag(userID, photoID, newTag)
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
    // Login
    while (true) {
        console.log('1. Login \n2. Exit')
        let choice = Number(prompt('Selection: '))
        if (choice === 1) {
            let username = prompt("Username: ")
            let password = prompt("Password: ")
            let userID = await business.login(password, username)
            if (userID === "denied") {
                console.log("Access Denied!")
            }
            else {
                while (true) {
                    console.log("\n1. Find Photo \n2. Update Photo Details \n3. Album Photo List \n4. Tag Photo \n5. Exit\n")
                    let choice = Number(prompt("Your Selection: "))

                    if (choice === 1) {
                        let photoID = Number(prompt("Photo ID? "))
                        await displayPhoto(userID, photoID)
                    }
                    else if (choice === 2) {
                        let photoID = Number(prompt("Photo ID? "))
                        await updatePhotoDetails(userID, photoID)
                    }
                    else if (choice === 3) {
                        let albumName = prompt("What is the name of the album? ")
                        await albumPhotoList(userID, albumName)
                    }
                    else if (choice === 4) {
                        let photoID = Number(prompt("What photo ID to tag? "))
                        await addTag(userID, photoID)
                    }
                    else if (choice === 5) {
                        process.exit()
                    }
                    else {
                        console.log("Try Again!!")
                    }
                }
            }
        }
        else if (choice === 2) {
            process.exit()
        }
        else {
            console.log("Try Again!!")
        }
    }
}


main()
