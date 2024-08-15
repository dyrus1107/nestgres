import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PrivateFile } from './entities/privateFile.entity';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';

import { v4 as uuid } from 'uuid';

@Injectable()
export class PrivateFilesService {
  private readonly bucketName: string;
  constructor(
    @InjectRepository(PrivateFile)
    private readonly filesRepository: Repository<PrivateFile>,
    private readonly configService: ConfigService,
  ) {
    this.bucketName = this.configService.get('AWS_PRIVATE_BUCKET_NAME');
  }

  async uploadFile(ownerId: number, dataBuffer: Buffer, filename: string) {
    const s3 = new S3();
    const uploadResult = await s3
      .upload({
        Bucket: this.bucketName,
        Body: dataBuffer,
        Key: `${uuid()}-${filename}`,
      })
      .promise();
    const file = this.filesRepository.create({
      key: uploadResult.Key,
      owner: {
        id: ownerId,
      },
    });
    await this.filesRepository.save(file);
    return file;
  }
}
