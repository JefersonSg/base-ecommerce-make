import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

const bucketName = process.env.BUCKET_NAME ?? "";
const bucketRegion = process.env.BUCKET_REGION ?? "";
const secretAcessKey = process.env.SECRET_ACESS_KEY ?? "";
const acessKey = process.env.ACESS_KEY ?? "";

const s3 = new S3Client({
  credentials: {
    accessKeyId: acessKey,
    secretAccessKey: secretAcessKey,
  },
  region: bucketRegion,
});

async function uploadToS3(path: string, file: Express.Multer.File) {
  const name =
    (await Date.now()) +
    String(Math.floor(Math.random() * 1000)) +
    file?.originalname;

    console.log(file.mimetype)
  const params: {
    Bucket: string;
    Key: string;
    Body: Buffer;
    contentType: string;
  } = {
    Bucket: bucketName,
    Key: `${path}/${name}`,
    Body: file?.buffer,
    contentType: file?.mimetype,
  };

  const command = new PutObjectCommand(params);
  await s3.send(command);

  return name;
}
async function updateImageToS3(file: Express.Multer.File, pathImage: string) {
  const params = {
    Bucket: bucketName,
    Key: pathImage,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  const command = new PutObjectCommand(params);
  await s3.send(command);

  return pathImage;
}
async function removeImageS3(path: string, image: string) {
  const deleteParams = {
    Bucket: bucketName,
    Key: `${path}/${image}`,
  };

  try {
    const deleteObject = new DeleteObjectCommand(deleteParams);
    const response = await s3.send(deleteObject);
  } catch (error) {
    console.error("Erro ao excluir objeto:", error);
  }
}

export { uploadToS3, updateImageToS3, removeImageS3 };
