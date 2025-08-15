import {
  DeleteObjectCommand,
  GetObjectCommand,
  paginateListObjectsV2,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const bikePhotoBucketName = 'pedal-assistant-bike-photos';

const s3Client = new S3Client({
  region: 'us-east-2', // your region
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY
  }
});

export const uploadBikePhoto = async (file: Express.Multer.File): Promise<{ bucket: string, key: string } | null> => {
  try {
    const key = `bikes/${Date.now()}-${file.originalname}`;
    await s3Client.send(
      new PutObjectCommand({
        Bucket: bikePhotoBucketName,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );
    return { bucket: bikePhotoBucketName, key: key };
  } catch (error) {
    console.error('Error uploading bike photo: ', error);
    return null;
  }
}

export const deleteBikePhoto = async (bucket: string, key: string): Promise<void> => {
  try {
    const deleteResult = await s3Client.send(
      new DeleteObjectCommand({
        Bucket: bucket,
        Key: key,
      }),
    );
    console.log('info', 'Deleted photo from: ', deleteResult);
  } catch (error) {
    console.error('Error deleting bike photo: ', error);
  }
}

export const refreshS3Url = (bucket: string, key: string, expireInSeconds: number): Promise<string> => {
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key
  });

  return getSignedUrl(s3Client, command, { expiresIn: expireInSeconds });
}

export const listBikePhotos = async (): Promise<string[]> => {
  try {
    const result = []
    const paginator = paginateListObjectsV2(
      { client: s3Client },
      { Bucket: bikePhotoBucketName },
    );
    for await (const page of paginator) {
      const objects = page.Contents;
      if (objects) {
        // For every object in each page, delete it.
        for (const object of objects) {
          result.push(object.Key);
        }
      }
    }
    return result;
  } catch (error) {
    console.error('Error listing bike photos: ', error);
    return [];
  }
}
