import { AwsService } from 'src/aws/aws.service';
import { mailGenerator } from 'src/config/mailgen-config';

export class BaseAuthEmail {
  constructor(
    private email: string,
    private readonly awsService: AwsService,
    private greetingsText: string,
    private introText: string[],
    private instructionTexts: string,
    private outroTexts: string,
    private mailSubject: string,
  ) {}

  async authEmail() {
    const html = {
      body: {
        signature: false,
        greeting: this.greetingsText,
        intro: this.introText,
        instructions: this.instructionTexts,
        outro: this.outroTexts,
      },
    };
    const template = mailGenerator.generate(html);
    const mail = {
      to: this.email,
      subject: this.mailSubject,
      from: process.env.SEND_GRID_MAIL,
      html: template,
    };
    return this.awsService.sendEmail(mail.to, mail.subject, mail.html);
  }
}
