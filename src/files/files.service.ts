import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PublicFile } from './entities/publicFile.entity';
import { Repository } from 'typeorm';
import { S3 } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
import { v4 as uuid } from 'uuid';

@Injectable()
export class FilesService {
  private readonly bucketName: string;

  constructor(
    @InjectRepository(PublicFile)
    private readonly publicFileRepository: Repository<PublicFile>,
    private readonly configService: ConfigService,
  ) {
    this.bucketName = this.configService.get('AWS_PUBLIC_BUCKET_NAME');
  }

  async uploadPublicFile(dataBuffer: Buffer, filename: string) {
    const s3 = new S3();
    const uploadResult = await s3
      .upload({
        Bucket: this.bucketName,
        Body: dataBuffer,
        Key: `${uuid()}-${filename}`,
      })
      .promise();
    const newFile = this.publicFileRepository.create({
      key: uploadResult.Key,
      url: uploadResult.Location,
    });
    return this.publicFileRepository.save(newFile);
  }

  async deletePublicFile(fileId: number) {
    const file = await this.publicFileRepository.findOneBy({ id: fileId });

    if (!file) {
      throw new NotFoundException('File not found');
    }

    const s3 = new S3();
    await s3
      .deleteObject({
        Bucket: this.bucketName,
        Key: file.key,
      })
      .promise();
    return fileId;
  }
}
