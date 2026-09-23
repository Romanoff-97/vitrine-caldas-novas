import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

dotenv.config();

// Força o SDK a ler/recarregar a CLOUDINARY_URL do process.env
cloudinary.config(true);

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (_req, _file) => {
    return {
      folder: 'vitrine-caldas-novas',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'avif']
    };
  },
});

export const upload = multer({ storage: storage });