import { Response } from "express";

interface ImageFile {
    data: Buffer; 
    mimetype: string; 
    fileName: string; 
    originalname: string;
    size: number;
}

export function verifyMimetypeImage ( images: ImageFile[]) {
    for (let i = 0; i < images.length; i++) {

        let mimeTypeOk = false
        const mimeTypes = ['image/jpeg' , 'image/png','image/webp', 'image/svg+xml']

        for (let j = 0; j < mimeTypes.length; j++) {
            if (mimeTypes[j] === images[i].mimetype) {
               mimeTypeOk = true;
            }
        }
        
        if (!mimeTypeOk) {
          return  `Formato da imagem ${images[i]?.originalname} incompativel, use JPG, PNG ou SVG`
        }
      }
}