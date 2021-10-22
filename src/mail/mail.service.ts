import { PostUserContactInputDto, PostUserContactOutputDto } from '@mail/dtos/post-user-contact.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendUserContact(postUserContactInputDto: PostUserContactInputDto): Promise<PostUserContactOutputDto> {
    try {
      const { email, subject, message } = postUserContactInputDto;
      await this.mailerService.sendMail({
        to: email,
        subject,
        html: `<p>메일이 성공적으로 전송되었습니다. 빠른 시일 내로 답장 드리겠습니다.</p>`,
      });
      await this.mailerService.sendMail({
        to: 'shigatsu970704@gmail.com',
        subject,
        html: `<p>${message}</p>`,
      });
      return { ok: true };
    } catch (error) {
      console.log(error);
      return { ok: false, error: '메일 전송을 실패하였습니다' };
    }
  }
}
