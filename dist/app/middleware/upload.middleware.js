"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFileUrl = exports.deleteFile = exports.uploadReviewImages = exports.uploadMultipleImages = exports.uploadSingleImage = exports.upload = void 0;
const fs_1 = __importDefault(require("fs"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
// Ensure upload directory exists
const uploadDir = path_1.default.join(process.cwd(), 'uploads');
if (!fs_1.default.existsSync(uploadDir)) {
    fs_1.default.mkdirSync(uploadDir, { recursive: true });
}
// Configure storage
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Generate unique filename
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const ext = path_1.default.extname(file.originalname);
        cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    },
});
// File filter for images only
const imageFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path_1.default.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) {
        return cb(null, true);
    }
    else {
        cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'));
    }
};
// Configure multer
exports.upload = (0, multer_1.default)({
    storage: storage,
    limits: {
        fileSize: Number(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024, // 5MB default
    },
    fileFilter: imageFilter,
});
// Middleware for single image upload
exports.uploadSingleImage = exports.upload.single('image');
// Middleware for multiple images upload (max 5)
exports.uploadMultipleImages = exports.upload.array('images', 5);
// Middleware for review images (max 3)
exports.uploadReviewImages = exports.upload.array('images', 3);
// Helper to delete file
const deleteFile = (filePath) => {
    try {
        if (fs_1.default.existsSync(filePath)) {
            fs_1.default.unlinkSync(filePath);
            return true;
        }
        return false;
    }
    catch (error) {
        console.error('Error deleting file:', error);
        return false;
    }
};
exports.deleteFile = deleteFile;
// Helper to get file URL
const getFileUrl = (filename) => {
    return `/uploads/${filename}`;
};
exports.getFileUrl = getFileUrl;
