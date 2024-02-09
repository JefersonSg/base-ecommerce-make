import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";


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

export default async function getUrlImageS3  (image: string)  {
    try {
        const getObjectParams = {
            Bucket: bucketName,
            Key: image,
          };
    
        const command = new GetObjectCommand(getObjectParams)
        const url = await getSignedUrl(s3, command, {expiresIn: 3600})
    
        return url
    } catch (error) {
        console.log('erro ao gerar url' + error)
    }
}