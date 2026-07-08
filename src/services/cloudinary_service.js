const streamifier = require('streamifier');
const cloudinary = require('../config/cloudinary.js');

const uploadBufferToCloudinary = async (buffer, folder = 'car-dealership') => {
  if (!buffer || !Buffer.isBuffer(buffer)) {
    throw new Error('Se requiere un buffer válido para subir la imagen');
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'auto'
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(result?.secure_url || result?.url);
      }
    );

    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

module.exports = {
  uploadBufferToCloudinary
};
