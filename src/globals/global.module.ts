import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Global, Module } from '@nestjs/common';
import { join } from 'path';
import { LanguagesService } from 'src/_modules/languages/languages.service';
import { MediaService } from 'src/_modules/media/services/media.service';
import { EmailService } from './services/email.service';
import { MapService } from './services/map.service';
import { ModelHelperService } from './services/modelHelper.service';
import { PrismaService } from './services/prisma.service';
import { ResponseService } from './services/response.service';
import { SMSService } from './services/sms.service';

@Global()
@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: process.env.MAIL_HOST,
        port: parseInt(process.env.MAIL_PORT, 10),
        secure: false,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASSWORD,
        },
      },
      defaults: {
        from: `"No Reply" <${process.env.SENDER_EMAIL}>`,
      },
      template: {
        dir: join(__dirname, '../../src/templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],

  providers: [
    ResponseService,
    PrismaService,
    SMSService,
    MapService,
    EmailService,
    ModelHelperService,
    LanguagesService,
    MediaService,
  ],
  exports: [
    ResponseService,
    PrismaService,
    SMSService,
    MapService,
    EmailService,
    ModelHelperService,
    LanguagesService,
    MediaService,
  ],
})
export class GlobalModule {}

