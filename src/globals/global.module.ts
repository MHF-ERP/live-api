import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Global, Module } from '@nestjs/common';
import * as admin from 'firebase-admin';
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
        host: env('MAIL_HOST'),
        port: env('MAIL_PORT'),
        secure: false,
        auth: {
          user: env('MAIL_USER'),
          pass: env('MAIL_PASSWORD'),
        },
      },
      defaults: {
        from: `"No Reply" <${env('SENDER_EMAIL')}>`,
      },
      //
      template: {
        dir: join(__dirname, '../../src/templates'), // Adjust this path
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
export class GlobalModule {
  constructor() {
    if (env('NOTIFICATIONS')) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: env('FIREBASE_PROJECT_ID'),
          clientEmail: env('FIREBASE_CLIENT_EMAIL'),
          privateKey: env('FIREBASE_PRIVATE_KEY')?.replace(/\\n/g, '\n'),
        }),
      });
    }
  }
}
