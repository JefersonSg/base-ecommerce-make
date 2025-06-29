import sharp from 'sharp';

async function imageComprimer(file: Express.Multer.File) {
  const compressedBuffer = await sharp(file.buffer)
    .resize({ width: 1920, withoutEnlargement: true })
    .toFormat('webp', { quality: 70 })
    .toBuffer();

  // 2. Gerar um nome de arquivo único com a nova extensão .webp
  const originalNameWithoutExt = file.originalname
    .split('.')
    .slice(0, -1)
    .join('.');
  const name = `${Date.now()}-${originalNameWithoutExt}.webp`;

  return {
    name,
    compressedBuffer
  };
}

export { imageComprimer };
