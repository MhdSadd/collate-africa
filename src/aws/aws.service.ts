import { Injectable } from '@nestjs/common';
import { SES } from 'aws-sdk';
import { AwsConfigService } from 'src/config/aws.config';

@Injectable()
export class AwsService {
  constructor(private readonly awsConfigService: AwsConfigService) {}

  public async sendEmail(to: string, subject: string, body: string) {
    const params: SES.SendEmailRequest = {
      Destination: {
        ToAddresses: [to],
      },
      Message: {
        Body: {
          Html: {
            Data: body,
          },
        },
        Subject: {
          Data: subject,
        },
      },
      Source: process.env.AWS_SENDER_MAIL,
    };

    const ses: SES = this.awsConfigService.getSES();
    ses.sendEmail(params).promise();
    console.log(`mail successfully dispatched to ${to}`);
  }
}
