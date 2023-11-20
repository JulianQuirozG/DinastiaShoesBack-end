const { ref, getDownloadURL, uploadBytesResumable } = require('firebase/storage');
const { storage } = require('../config/firebaseConfig.js');
const sharp = require('sharp');

const uploadFile = async (file) => {
    try {
        let filebuffer = await sharp(file.buffer)
            .resize({ width: 400, height: 400, fit: 'cover' })
            .toBuffer();

        const fileRef = ref(storage, `files/${file.originalname} ${Date.now()}`)

        const fileMetadata = {
            contentType: file.mimetype
        }

        const fileUploadPromise = uploadBytesResumable(
            fileRef,
            filebuffer,
            fileMetadata
        )

        await fileUploadPromise;

        const fileDownloadURL = await getDownloadURL(fileRef);

        return { ref: fileRef, downloadURL: fileDownloadURL };
    }
    catch (error) {
        console.error('Error al subir la imagen:');
    }

}

module.exports = {
    uploadFile
};

