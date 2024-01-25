import { Inject, Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { ResultUploadDto } from 'src/result/dto/result-upload.dto';
import { DoSpacesServiceLib } from './dospaces.config';

@Injectable()
export class DospacesService {
  constructor(@Inject(DoSpacesServiceLib) private readonly s3: AWS.S3) {}

  async uploadFile(
    file: Express.Multer.File,
    dto: ResultUploadDto,
  ): Promise<string> {
    const fileName = `${Date.now()}-${file.originalname}`;
    const { election, state, LGA, ward, pollingUnit } = dto;
    const electionLowerCase = election.trim().toLowerCase();
    const stateLowerCase = state.trim().toLowerCase();
    const LGALowerCase = LGA.trim().toLowerCase();
    const wardLowerCase = ward.trim().toLowerCase();
    const pollingUnitLowerCase = pollingUnit.trim().toLowerCase();

    return new Promise((resolve, reject) => {
      this.s3.putObject(
        {
          Bucket: process.env.DO_BUCKET_NAME,
          Key:
            `${electionLowerCase}/${stateLowerCase}/${LGALowerCase}/${wardLowerCase}/${pollingUnitLowerCase}/` +
            fileName,
          Body: file.buffer,
          ACL: 'public-read',
        },
        (error: AWS.AWSError) => {
          if (!error) {
            resolve(
              `${process.env.DO_SPACE_RESOLVE_BASE_URL}.${process.env.DO_SPACE_ENDPOINT}/${electionLowerCase}/${stateLowerCase}/${LGALowerCase}/${wardLowerCase}/${pollingUnitLowerCase}/${fileName}`,
            );
          } else {
            reject(
              new Error(
                `DoSpacesService_ERROR: ${
                  error.message || 'Something went wrong'
                }`,
              ),
            );
          }
        },
      );
    });
  }
}
