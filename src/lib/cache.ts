import { openDB, DBSchema, IDBPDatabase } from 'idb';
import type { DetectionResponse, FileDetectionResult } from '@/types/detection';

interface TypeSecureDB extends DBSchema {
  detections: {
    key: string;
    value: DetectionResponse | FileDetectionResult;
    indexes: { 'by-date': Date };
  };
}

let db: IDBPDatabase<TypeSecureDB>;

export async function initCache() {
  db = await openDB<TypeSecureDB>('type-secure-cache', 1, {
    upgrade(db) {
      const store = db.createObjectStore('detections', { keyPath: 'id' });
      store.createIndex('by-date', 'timestamp');
    },
  });
}

export async function cacheDetectionResult(result: DetectionResponse | FileDetectionResult) {
  if (!db) await initCache();
  await db.put('detections', {
    ...result,
    id: crypto.randomUUID(),
    timestamp: new Date(),
  });
}

export async function getCachedDetections(): Promise<(DetectionResponse | FileDetectionResult)[]> {
  if (!db) await initCache();
  return db.getAllFromIndex('detections', 'by-date');
}