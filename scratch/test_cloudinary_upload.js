require('dotenv').config();
const cloudinary = require('../src/config/cloudinary.js');

async function testUpload() {
  try {
    console.log('Testing Cloudinary upload from URL...');
    const testUrl = 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb';
    const result = await cloudinary.uploader.upload(testUrl, {
      folder: 'car-dealership/test'
    });
    console.log('Upload successful!');
    console.log('Cloudinary URL:', result.secure_url);
    console.log('Public ID:', result.public_id);
  } catch (error) {
    console.error('Error during Cloudinary upload test:', error);
  }
}

testUpload();
