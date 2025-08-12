import { Logger, Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MediaType, S3Media } from './aws-media.entity';
import { refreshS3Url, uploadBikePhoto } from '../utils/aws';

@Injectable()
export class S3MediaService {
  private readonly logger = new Logger(S3MediaService.name);

  constructor(
    @InjectRepository(S3Media)
    private mediaRepository: Repository<S3Media>,
  ) {}

  async createPhoto(file: Express.Multer.File, userId: number): Promise<S3Media> {
    try {
      const {bucket, key} = await uploadBikePhoto(file);
      const media = this.mediaRepository.create(
        { userId: userId,
          bucket: bucket,
          key: key,
          type: MediaType.PHOTO,
        });
      return this.mediaRepository.save(media);
    } catch (error) {
      this.logger.error('Error creating photo: ', error);
      return null;
    }
  }

  async refreshPhoto(media: S3Media): Promise<S3Media> {
    const fifteenMinutesInSeconds = 15 * 60;
    const newUrl = await refreshS3Url(media.bucket, media.key, fifteenMinutesInSeconds);
    media.presignedURL = newUrl;
    media.urlExpires = new Date(Date.now() + 1000 * (fifteenMinutesInSeconds - 60));
    this.logger.log('info', 'Refreshed url for: ', media);
    return this.mediaRepository.save(media);
  }

  async getPhotoUrl(media: S3Media): Promise<string> {
    this.logger.log('info', 'Getting url for: ', media);
    if (!media.urlExpires || media.urlExpires < new Date()) {
      return this.refreshPhoto(media).then((refreshedMedia) =>
        refreshedMedia.presignedURL);
    }
    return media.presignedURL;
  }

  findOne(id: number): Promise<S3Media | null> {
    const result = this.mediaRepository.findOneBy({ id });
    this.logger.log('info', 'Searching for: ' + id + ' found: ' + result);
    return result;
  }

  findAllFor(userId: number): Promise<S3Media[]> {
    return this.mediaRepository.createQueryBuilder('media')
     .where('media.userId = :userId', { userId })
     .getMany();
  }

  save(media: S3Media): Promise<S3Media> {
    return this.mediaRepository.save(media);
  }

};
