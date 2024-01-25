import { AwsService } from '../../aws/aws.service';
import { mailGenerator } from 'src/config/mailgen-config';

export class LoginLinkMail {
  constructor(
    private email: string,
    private href: string,
    private awsService: AwsService,
  ) {}

  async sendEmail() {
    const html = {
      body: {
        greeting: 'Hello',
        intro: [
          'You are receiving this message because you have requested to login on the collate app',
        ],
        action: {
          instructions: 'To login, click the button below',
          button: {
            color: '#48cfad',
            text: 'Login',
            link: this.href,
          },
        },
      },
    };
    const template = mailGenerator.generate(html);
    const mail = {
      to: this.email,
      subject: 'Login',
      from: process.env.SEND_GRID_MAIL,
      html: template,
    };
    return this.awsService.sendEmail(mail.to, mail.subject, mail.html);
  }
}
