import { Injectable } from '@angular/core';
import { Storage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage'
import { v4 as uuidv4 } from 'uuid';

@Injectable({ providedIn: 'root' })
export class UploadService {
  constructor(private storage: Storage) {}

  async uploadImage(file: File): Promise<string> {
    const path = `location-images/${uuidv4()}-${file.name}`;
    console.log(path);
    const storageRef = ref(this.storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    return await getDownloadURL(snapshot.ref);
  }
}
