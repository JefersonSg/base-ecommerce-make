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
const signedUrlsCache : any = {};

export default async function getUrlImageS3(path: string, image: string) {
  const cacheKey = `${path}/${image}`;

  if (signedUrlsCache[cacheKey] && signedUrlsCache[cacheKey].expiry > Date.now()) {
    return signedUrlsCache[cacheKey].url;
  }

  try {
    const getObjectParams = {
      Bucket: bucketName,
      Key: `${path}/${image}`,
    };

    const command = new GetObjectCommand(getObjectParams);
    const expires = 4 * 24 * 60 * 60

    const url = await getSignedUrl(s3, command, {
      expiresIn: 5 * 24 * 60 * 60,
    });

    signedUrlsCache[cacheKey] = {
      url,
      expiry: Date.now() + (expires * 1000)
    };

    setInterval(() => {
      const now = Date.now();
      for (const cacheKey in signedUrlsCache) {
        if (signedUrlsCache.hasOwnProperty(cacheKey) && signedUrlsCache[cacheKey].expiry < now) {
          delete signedUrlsCache[cacheKey];
        }
      }
    }, 3600000);

    return url;
  } catch (error) {
    console.log("erro ao gerar url" + error);
  }
}
