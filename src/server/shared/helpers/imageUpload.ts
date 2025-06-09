import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand
} from '@aws-sdk/client-s3';
import { imageComprimer } from './imageComprimer';

const bucketName = process.env.BUCKET_NAME ?? '';
const bucketRegion = process.env.BUCKET_REGION ?? '';
const secretAcessKey = process.env.SECRET_ACESS_KEY ?? '';
const acessKey = process.env.ACESS_KEY ?? '';

const s3 = new S3Client({
  credentials: {
    accessKeyId: acessKey,
    secretAccessKey: secretAcessKey
  },
  region: bucketRegion
});

async function uploadToS3(
  path: string,
  file: Express.Multer.File
): Promise<string | false> {
  try {
    const imagemComprimida = imageComprimer(file);

    const params = {
      Bucket: bucketName,
      Key: `${path}/${(await imagemComprimida).name}`,
      Body: (await imagemComprimida).compressedBuffer, // << USAMOS O BUFFER COMPRIMIDO AQUI
      ContentType: 'image/webp' // << ATUALIZAMOS O TIPO DE CONTEÚDO
    };

    const command = new PutObjectCommand(params);
    await s3.send(command);

    return (await imagemComprimida).name;
  } catch (error) {
    console.log('ocorreu um erro:', error);
    return false;
  }
}
async function updateImageToS3(file: Express.Multer.File, pathImage: string) {
  const imagemComprimida = imageComprimer(file);

  const params = {
    Bucket: bucketName,
    Key: pathImage,

    Body: (await imagemComprimida).compressedBuffer, // << USAMOS O BUFFER COMPRIMIDO AQUI
    ContentType: 'image/webp' // << ATUALIZAMOS O TIPO DE CONTEÚDO
  };

  const command = new PutObjectCommand(params);
  await s3.send(command);

  return pathImage;
}
async function removeImageS3(path: string, image: string) {
  const deleteParams = {
    Bucket: bucketName,
    Key: `${path}/${image}`
  };

  try {
    const deleteObject = new DeleteObjectCommand(deleteParams);
    await s3.send(deleteObject);
    return true;
  } catch (error) {
    console.error('Erro ao excluir objeto:', error);
    return true;
  }
}

export { uploadToS3, updateImageToS3, removeImageS3 };
