import multer, { FileFilterCallback } from "multer";
import path from "path";
import fs from "fs";
import { Request, Response, NextFunction } from "express";

export function getDestinationFolder(entityType: string): string {
  switch (entityType) {
    case "contact":
      return "img/contact/";
    case "theater":
      return "img/theater/";
    case "ticket":
      return "img/ticket/";
    default:
      return "img/";
  }
}

// Konfigurasi multer untuk penyimpanan file
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

// Filter file untuk menerima hanya file gambar
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

// Buat instance multer dengan konfigurasi di atas
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
      // Kesalahan yang terjadi saat upload file oleh multer
      return res.status(400).json({ error: err.message });
    } else if (err) {
      // Kesalahan lainnya
      return res.status(400).json({ error: err.message });
    }
    // Jika tidak ada kesalahan, lanjutkan ke middleware berikutnya
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
    requestBody.photo = path.normalize(imagePath); // Tambahkan path gambar ke request
  }
}

export function deleteOldFile(filePath: string) {
  if (filePath && fs.existsSync(filePath)) {
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error("Error deleting old file: ", err);
      }
    });
  }
}
