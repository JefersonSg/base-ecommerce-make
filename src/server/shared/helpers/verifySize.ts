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
    if (images[i]?.size && images[i]?.size > 3 * 1024 * 1024) {
      return `Tamanho da imagem ${images[i]?.originalname} muito grande, Maximo 3MB`;
    }
  }
}
