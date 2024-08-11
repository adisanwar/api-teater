import { Request } from 'express';
import path from 'path';
import multer from 'multer';
import fs from 'fs';
import { ResponseError } from '../error/response-error';

const projectRoot = path.join(__dirname, '..', '..'); // Adjust to your project structure

export function getDestinationFolder(entityType: string): string {
  const baseDir = path.join(projectRoot, 'src', 'img');
  let folder = '';

  // console.log('get destination 2' + entityType);

  switch (entityType) {
    case 'show':
      folder = 'show';
      break;
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
    const entityType = req.body.entityType;
    cb(null, getDestinationFolder(entityType));
  },
  filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    // Replace spaces in the filename with %20 for URL encoding
    const encodedFilename = `${Date.now()}-${file.originalname}`;
    cb(null, encodedFilename);
  },
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
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

export function deleteOldFile(filePath: string | undefined | null) {
  // Check if filePath is empty, null, or undefined
  if (!filePath) {
    console.warn('No file path provided, nothing to delete.');
    return;
  }

  const absolutePath = path.resolve(projectRoot, filePath);
  console.log(`Attempting to delete file at path: ${absolutePath}`);

  if (!fs.existsSync(absolutePath)) {
    console.warn(`File not found or cannot be accessed: ${absolutePath}`);
    return;
  }

  try {
    const stat = fs.lstatSync(absolutePath);

    if (stat.isFile()) {
      fs.unlinkSync(absolutePath);
      console.log(`Successfully deleted file: ${absolutePath}`);
    } else {
      console.error(`Path is not a file: ${absolutePath}`);
    }
  } catch (err) {
    console.error(`Error accessing file at path: ${absolutePath}`, err);
    throw new ResponseError(500, `Failed to delete file at path: ${absolutePath}`);
  }
}



export function handleFileUpload(req: Request, requestBody: any) {
  if (req.file) {
    const entityType = req.body.entityType;
    const imagePath = path.join(getDestinationFolder(entityType), req.file.filename);
    const relativePath = path.relative(projectRoot, imagePath);
    requestBody.photo = path.normalize(relativePath).replace(/\\/g, '/'); // Replace backslashes with forward slashes for consistency
  }
}
