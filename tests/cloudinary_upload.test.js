const { PassThrough } = require('stream');

jest.mock('../src/config/cloudinary.js', () => ({
  uploader: {
    upload_stream: jest.fn()
  }
}));

jest.mock('streamifier', () => ({
  createReadStream: jest.fn()
}));

const cloudinary = require('../src/config/cloudinary.js');
const streamifier = require('streamifier');
const { uploadBufferToCloudinary } = require('../src/services/cloudinary_service.js');

describe('Cloudinary upload service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('debe subir un buffer y devolver la URL segura', async () => {
    const buffer = Buffer.from('imagen-prueba');
    const uploadStream = new PassThrough();

    streamifier.createReadStream.mockReturnValue({ pipe: jest.fn().mockReturnValue(uploadStream) });
    cloudinary.uploader.upload_stream.mockImplementation((options, callback) => {
      callback(null, { secure_url: 'https://res.cloudinary.com/demo/image.jpg' });
      return uploadStream;
    });

    const url = await uploadBufferToCloudinary(buffer, 'car-dealership/vehicles');

    expect(url).toBe('https://res.cloudinary.com/demo/image.jpg');
    expect(cloudinary.uploader.upload_stream).toHaveBeenCalledWith(
      expect.objectContaining({ folder: 'car-dealership/vehicles', resource_type: 'auto' }),
      expect.any(Function)
    );
  });
});
