import { Injectable } from '@angular/core';

interface TempImage {
  id: string;
  base64Data: string;
  fileName: string;
  fileType: string;
  timestamp: number;
  relatedId?: string; // ID relacionado (ex: serialKey)
}
@Injectable({
  providedIn: 'root',
})
export class TempStorageService {
  private dbName = 'TempImagesDB';
  private storeName = 'pendingImages';
  private db: IDBDatabase | null = null;
  constructor() {
    this.initDB();
  }

  private initDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          const store = db.createObjectStore(this.storeName, { keyPath: 'id' });
          store.createIndex('relatedId', 'relatedId', { unique: false });
          store.createIndex('timestamp', 'timestamp', { unique: false });
        }
      };
    });
  }

  async saveImage(file: File, relatedId?: string): Promise<string> {
    await this.waitForDB();

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64Data = e.target?.result as string;
        const image: TempImage = {
          id: this.generateId(),
          base64Data,
          fileName: file.name,
          fileType: file.type,
          timestamp: Date.now(),
          relatedId
        };

        const transaction = this.db!.transaction([this.storeName], 'readwrite');
        const store = transaction.objectStore(this.storeName);
        const request = store.add(image);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(image.id);
      };
      reader.readAsDataURL(file);
    });
  }

  async getImage(id: string): Promise<TempImage | null> {
    await this.waitForDB();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.get(id);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result || null);
    });
  }

  async getImagesByRelatedId(relatedId: string): Promise<TempImage[]> {
    await this.waitForDB();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const index = store.index('relatedId');
      const request = index.getAll(relatedId);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  async deleteImage(id: string): Promise<void> {
    await this.waitForDB();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.delete(id);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async clearOldImages(maxAgeHours: number = 24): Promise<void> {
    await this.waitForDB();

    const cutoffTime = Date.now() - (maxAgeHours * 60 * 60 * 1000);

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const index = store.index('timestamp');
      const range = IDBKeyRange.upperBound(cutoffTime);
      const request = index.openCursor(range);

      request.onerror = () => reject(request.error);
      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor) {
          store.delete(cursor.primaryKey);
          cursor.continue();
        } else {
          resolve();
        }
      };
    });
  }

  private generateId(): string {
    return `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async waitForDB(): Promise<void> {
    if (!this.db) {
      await this.initDB();
    }
  }
}
