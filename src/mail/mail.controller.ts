import { PostUserContactInputDto, PostUserContactOutputDto } from '@mail/dtos/post-user-contact.dto';
import { MailService } from '@mail/mail.service';
import { Body, Controller, Post } from '@nestjs/common';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('contact')
  async postUserContact(@Body() postUserContactInputDto: PostUserContactInputDto): Promise<PostUserContactOutputDto> {
    return this.mailService.sendUserContact(postUserContactInputDto);
  }
}
