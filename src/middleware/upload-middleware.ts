import multer, { FileFilterCallback } from "multer";
import path from "path";
import fs from "fs";
import { Request, Response, NextFunction } from "express";

const projectRoot = path.join(__dirname, '..', '..'); // Adjust to your project structure

export function getDestinationFolder(entityType: string): string {
  const baseDir = path.join(projectRoot, 'src', 'img');
  let folder = '';

  switch (entityType) {
    case 'contact':
      folder = 'contact';
      break;
    case 'theater':
      folder = 'theater';
      break;
    case 'ticket':
      folder = 'ticket';
      break;
    default:
      folder = 'default';
      break;
  }

  const destination = path.join(baseDir, folder);

  // Ensure the directory exists
  if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination, { recursive: true });
  }

  return destination;
}


const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    const entityType = req.body.entityType || 'default';
    cb(null, getDestinationFolder(entityType));
  },
  filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

export const uploadMiddleware = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 5, // Maximum 5MB
  },
}).single('photo');


export function deleteOldFile(filePath: string) {
  const absolutePath = path.join(projectRoot, filePath);
  console.log(`Attempting to delete file at path: ${absolutePath}`);

  if (!fs.existsSync(absolutePath)) {
    console.warn(`File not found or cannot be accessed: ${absolutePath}`);
    return;
  }

  try {
    const stat = fs.lstatSync(absolutePath);

    if (stat.isDirectory()) {
      console.error(`Attempted to delete a directory instead of a file: ${absolutePath}`);
      return;
    }

    fs.unlink(absolutePath, (err) => {
      if (err) {
        console.error(`Error deleting file: ${absolutePath}`, err);
      } else {
        console.log(`Successfully deleted file: ${absolutePath}`);
      }
    });
  } catch (err) {
    console.error(`Error accessing file: ${absolutePath}`, err);
  }
}

export function handleFileUpload(req: Request, requestBody: any) {
  if (req.file) {
    const entityType = req.body.entityType || 'default';
    const imagePath = path.join(getDestinationFolder(entityType), req.file.filename);
    const relativePath = path.relative(projectRoot, imagePath);
    requestBody.photo = path.normalize(relativePath).replace(/\\/g, '/'); // Replace backslashes with forward slashes for consistency
  }
}