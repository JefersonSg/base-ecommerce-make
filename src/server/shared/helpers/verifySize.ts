interface ImageFile {
  data: Buffer;
  mimetype: string;
  fileName: string;
  originalname: string;
  size: number;
}

export function verifySizeImage(images: ImageFile[]) {
  if (!images) {
    return false;
  }

  for (let i = 0; i < images?.length; i++) {
    if (images[i]?.size && images[i]?.size > 10 * 1024 * 1024) {
      return `Tamanho da imagem ${images[i]?.originalname} muito grande, Maximo 10MB`;
    }
  }
}
