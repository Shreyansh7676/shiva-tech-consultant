import {
  deleteObject,
  getBlob,
  getDownloadURL,
  getMetadata,
  list,
  listAll,
  ref,
  uploadBytesResumable
} from 'firebase/storage';
import { storage } from '../firebase';

// Objects live at the bucket root (home/, gallery/, portfolio/). The service can
// address any path in the bucket; the storage rules decide what is permitted
// (public read, admin-only write).
export const BUCKET_ROOT = '';

const DEFAULT_CACHE_CONTROL = 'no-cache';

const MIME_TYPES = {
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  webp: 'image/webp',
  gif: 'image/gif',
  avif: 'image/avif',
  svg: 'image/svg+xml',
  pdf: 'application/pdf'
};

export class StoragePathError extends Error {
  constructor(message) {
    super(message);
    this.name = 'StoragePathError';
  }
}

function requireStorage() {
  if (!storage) throw new Error('Firebase Storage is not configured.');
}

export function normalizePath(value) {
  return String(value ?? '')
    .replace(/\\/g, '/')
    .split('/')
    .filter((segment) => segment && segment !== '.')
    .join('/');
}

function requireObjectPath(value) {
  const path = normalizePath(value);
  if (!path) throw new StoragePathError('Provide a full object path.');
  return path;
}

export function joinPath(...segments) {
  return normalizePath(segments.filter(Boolean).join('/'));
}

export function parentFolder(value) {
  const path = normalizePath(value);
  const index = path.lastIndexOf('/');
  return index === -1 ? '' : path.slice(0, index);
}

export function fileExtension(value) {
  const match = /\.([A-Za-z0-9]+)$/.exec(normalizePath(value));
  return match ? match[1].toLowerCase() : '';
}

export function mimeFromName(value) {
  return MIME_TYPES[fileExtension(value)] || '';
}

export function isImage(contentType, name) {
  if (contentType) return contentType.startsWith('image/');
  return Boolean(mimeFromName(name));
}

export function sanitizeFileName(value) {
  const leaf = normalizePath(value).split('/').pop() || '';
  return leaf.replace(/[^\w.\-() ]+/g, '_').replace(/\s+/g, ' ').trim();
}

export function formatBytes(bytes) {
  const value = Number(bytes);
  if (!Number.isFinite(value) || value <= 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const index = Math.min(Math.floor(Math.log(value) / Math.log(1024)), units.length - 1);
  const scaled = value / 1024 ** index;
  return `${scaled >= 10 || index === 0 ? Math.round(scaled) : scaled.toFixed(1)} ${units[index]}`;
}

async function describeItem(itemRef) {
  const [url, metadata] = await Promise.all([
    getDownloadURL(itemRef).catch(() => null),
    getMetadata(itemRef).catch(() => null)
  ]);

  return {
    path: itemRef.fullPath,
    name: itemRef.name,
    url,
    size: metadata ? Number(metadata.size) : null,
    contentType: metadata ? metadata.contentType : null,
    updated: metadata ? metadata.updated : null
  };
}

async function describeItems(items) {
  return Promise.all(items.map(describeItem));
}

export async function listFolder(prefix = BUCKET_ROOT, options = {}) {
  const path = normalizePath(prefix);
  requireStorage();

  const listOptions = {};
  if (options.pageToken) listOptions.pageToken = options.pageToken;
  if (options.maxResults) listOptions.maxResults = options.maxResults;

  const result = await list(ref(storage, path), listOptions);

  return {
    prefix: path,
    folders: result.prefixes.map((item) => item.fullPath),
    files: await describeItems(result.items),
    nextPageToken: result.nextPageToken || null
  };
}

export async function listAllFiles(prefix = BUCKET_ROOT) {
  const path = normalizePath(prefix);
  requireStorage();

  const result = await listAll(ref(storage, path));

  return {
    prefix: path,
    folders: result.prefixes.map((item) => item.fullPath),
    files: await describeItems(result.items)
  };
}

export function uploadObject(path, file, options = {}) {
  const targetPath = requireObjectPath(path);
  requireStorage();

  const metadata = {
    contentType: options.contentType || file.type || mimeFromName(targetPath) || 'application/octet-stream',
    cacheControl: options.cacheControl || DEFAULT_CACHE_CONTROL
  };
  if (options.customMetadata) metadata.customMetadata = options.customMetadata;

  const task = uploadBytesResumable(ref(storage, targetPath), file, metadata);

  return new Promise((resolve, reject) => {
    task.on(
      'state_changed',
      (snapshot) => {
        if (options.onProgress) options.onProgress(snapshot);
      },
      (error) => reject(error),
      async () => {
        try {
          const url = await getDownloadURL(task.snapshot.ref);
          resolve({ path: targetPath, url, metadata: task.snapshot.metadata || null });
        } catch (error) {
          reject(error);
        }
      }
    );
  });
}

export const replaceObject = uploadObject;

export async function deleteObjectAtPath(path) {
  const targetPath = requireObjectPath(path);
  requireStorage();

  await deleteObject(ref(storage, targetPath));
  return targetPath;
}

export async function deleteObjectsAtPaths(paths) {
  const results = await Promise.allSettled(paths.map((path) => deleteObjectAtPath(path)));

  return results.reduce(
    (accumulator, result, index) => {
      if (result.status === 'fulfilled') accumulator.deleted.push(paths[index]);
      else accumulator.failed.push({ path: paths[index], error: result.reason });
      return accumulator;
    },
    { deleted: [], failed: [] }
  );
}

export async function copyObject(fromPath, toPath) {
  const sourcePath = requireObjectPath(fromPath);
  const targetPath = requireObjectPath(toPath);
  requireStorage();

  if (sourcePath === targetPath) throw new StoragePathError('Source and destination are the same object.');

  const source = ref(storage, sourcePath);
  const [blob, metadata] = await Promise.all([getBlob(source), getMetadata(source)]);

  // A copied object must not inherit the source's download token.
  const safeMetadata = { ...(metadata.customMetadata || {}) };
  delete safeMetadata.firebaseStorageDownloadTokens;

  return uploadObject(targetPath, blob, {
    contentType: metadata.contentType,
    cacheControl: metadata.cacheControl || DEFAULT_CACHE_CONTROL,
    customMetadata: Object.keys(safeMetadata).length ? safeMetadata : undefined
  });
}

export async function moveObject(fromPath, toPath) {
  const result = await copyObject(fromPath, toPath);
  await deleteObjectAtPath(fromPath);
  return result;
}

export async function renameObject(path, nextName) {
  const sourcePath = requireObjectPath(path);
  const cleanName = sanitizeFileName(nextName);
  if (!cleanName) throw new StoragePathError('Enter a valid file name.');

  const targetPath = joinPath(parentFolder(sourcePath), cleanName);
  if (targetPath === sourcePath) {
    return { path: sourcePath, url: await getObjectUrl(sourcePath), unchanged: true };
  }
  return moveObject(sourcePath, targetPath);
}

export async function getObjectUrl(path) {
  const targetPath = requireObjectPath(path);
  requireStorage();
  return getDownloadURL(ref(storage, targetPath));
}

export async function getObjectMetadata(path) {
  const targetPath = requireObjectPath(path);
  requireStorage();
  return getMetadata(ref(storage, targetPath));
}
