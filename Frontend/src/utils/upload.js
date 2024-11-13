import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../config/firebaseStorage"; // Import the storage instance

const uploadFile = async (file) => {
    const storageRef = ref(storage, `uploads/${file.name}`); // Specify a path

    console.log("Current Storage Bucket:", storage.app.options.storageBucket);

    try {
        await uploadBytes(storageRef, file); // Upload the file
        const downloadURL = await getDownloadURL(storageRef); // Get the download URL
        return downloadURL; // Return the download URL
    } catch (error) {
        console.error("Error uploading file:", error);
        throw error; // Rethrow the error for handling in the calling function
    }
};

export default uploadFile;
