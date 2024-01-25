import { AwsService } from '../../aws/aws.service';
import { BaseAuthEmail } from './base-auth.mail';

export class AccountVerificationMail extends BaseAuthEmail {
  constructor(email: string, secretToken: string, awsService: AwsService) {
    super(
      email,
      awsService,
      `Hello`,
      [
        `YOU are the newest member of Collate, a place where you act as an ambassador of your vote to make sure it counts. We're excited to have you.
To get started, we need to confirm your email address, so please click this link to complete your signup.`,
        `<a href="https://www.collate.africa/verify?token=${secretToken}&mode=v">Confirm your email address</a>`,
        ``,
        `<h3>A few things to know</h3>
        <ul>
          <li style="font-size:1rem">You can always edit the provided information whenever you need to.</li>
          <li style="font-size:1rem">We've got you covered so that you can upload all the results you have. Just click on “Upload new result” to add more results.</li>
          <li style="font-size:1rem">Upload and input the result carefully! As one of the first members of collate, your inputs and uploads will help us collate and analyze election results. Make sure your uploads are clear and the number correct.</li>
        </ul>`,
      ],

      `Once again, thank you for signing up. We are really glad you'll join us to have a better Nigeria.`,

      `Thanks! <br>
        Oo and the Collate team`,

      'Welcome to Collate - Just one more step!',
    );

    this.authEmail.bind(this);
  }
}
