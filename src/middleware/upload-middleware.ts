import multer, { FileFilterCallback } from "multer";
import path from "path";
import fs from "fs";
import { Request, Response, NextFunction } from "express";

export function getDestinationFolder(entityType: string): string {
  const baseDir = path.join(__dirname, '..', 'img');
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
  destination: (
      req: Request,
      file: Express.Multer.File,
      cb: (error: Error | null, destination: string) => void
  ) => {
    const entityType = req.body.entityType || "default";
    cb(null, getDestinationFolder(entityType));
  },
  filename: (
      req: Request,
      file: Express.Multer.File,
      cb: (error: Error | null, filename: string) => void
  ) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 5, // Maksimal 5MB
  },
});

export function uploadMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
  upload.single("photo")(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ error: err.message });
    } else if (err) {
      return res.status(400).json({ error: err.message });
    }
    next();
  });
}

export function handleFileUpload(req: Request, requestBody: any) {
  if (req.file) {
    const entityType = req.body.entityType || "default";
    const imagePath = path.join(
        getDestinationFolder(entityType),
        req.file.filename
    );
    requestBody.photo = path.normalize(imagePath);
  }
}

export function deleteOldFile(filePath: string) {
  console.log(`Attempting to delete file at path: ${filePath}`);

  if (!filePath || !fs.existsSync(filePath)) {
    console.warn(`File not found or cannot be accessed: ${filePath}`);
    return;
  }

  try {
    const stat = fs.lstatSync(filePath);

    if (stat.isDirectory()) {
      console.error(`Attempted to delete a directory instead of a file: ${filePath}`);
      return;
    }

    fs.unlink(filePath, (err) => {
      if (err) {
        console.error(`Error deleting file: ${filePath}`, err);
      } else {
        console.log(`Successfully deleted file: ${filePath}`);
      }
    });
  } catch (err) {
    console.error(`Error accessing file: ${filePath}`, err);
  }
}
