const { randomUUID } = require('node:crypto');
const { mkdir, writeFile } = require('node:fs/promises');
const path = require('node:path');
const { Router } = require('express');
const multer = require('multer');
const { createAuthenticateAdmin } = require('../middleware/authenticateAdmin');
const { ApiError } = require('../utils/apiError');

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const mimeExtensions = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/svg+xml': '.svg',
};

function hasValidImageSignature(file) {
  const { buffer, mimetype } = file;
  if (mimetype === 'image/jpeg') {
    return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  }
  if (mimetype === 'image/png') {
    return buffer
      .subarray(0, 8)
      .equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  }
  if (mimetype === 'image/webp') {
    return (
      buffer.toString('ascii', 0, 4) === 'RIFF' &&
      buffer.toString('ascii', 8, 12) === 'WEBP'
    );
  }
  if (mimetype === 'image/svg+xml') {
    const source = buffer
      .toString('utf8')
      .replace(/^\uFEFF/, '')
      .trimStart();
    return (
      !source.includes('\u0000') &&
      !/<!DOCTYPE|<!ENTITY/i.test(source) &&
      /<svg(?:\s|>)/i.test(source.slice(0, 4096))
    );
  }
  return false;
}

function createUploadParser() {
  const parser = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: MAX_IMAGE_SIZE, files: 1, fields: 0 },
    fileFilter(_req, file, callback) {
      if (!Object.hasOwn(mimeExtensions, file.mimetype)) {
        callback(
          new ApiError(
            400,
            'Only JPG, JPEG, PNG, WEBP, and SVG images are supported.',
            'Bad Request',
          ),
        );
        return;
      }
      callback(null, true);
    },
  }).single('file');

  return (req, res, next) => {
    parser(req, res, (error) => {
      if (!error) {
        next();
        return;
      }
      if (error instanceof multer.MulterError) {
        const statusCode = error.code === 'LIMIT_FILE_SIZE' ? 413 : 400;
        next(
          new ApiError(
            statusCode,
            statusCode === 413
              ? 'Image files must be 5 MB or smaller.'
              : 'Upload one image using the "file" field.',
            statusCode === 413 ? 'Payload Too Large' : 'Bad Request',
          ),
        );
        return;
      }
      next(error);
    });
  };
}

function createUploadsRouter(prisma, jwtSecret, uploadsDirectory) {
  const router = Router();
  const authenticate = createAuthenticateAdmin(prisma, jwtSecret);
  const parseUpload = createUploadParser();

  router.post('/', authenticate, parseUpload, async (req, res) => {
    if (!req.file) {
      throw new ApiError(400, 'An image file is required.', 'Bad Request');
    }
    if (!hasValidImageSignature(req.file)) {
      throw new ApiError(
        400,
        'The uploaded file content does not match a supported image type.',
        'Bad Request',
      );
    }

    const filename = `${randomUUID()}${mimeExtensions[req.file.mimetype]}`;
    await mkdir(uploadsDirectory, { recursive: true });
    await writeFile(path.join(uploadsDirectory, filename), req.file.buffer, {
      flag: 'wx',
      mode: 0o644,
    });

    res.status(201).json({ url: `/api/uploads/${filename}` });
  });

  return router;
}

module.exports = { createUploadsRouter, hasValidImageSignature };
