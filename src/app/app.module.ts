import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import {
  AcceptLanguageResolver,
  HeaderResolver,
  I18nModule,
  QueryResolver,
} from 'nestjs-i18n';
import * as path from 'path';
import { AuthenticationModule } from 'src/_modules/authentication/authentication.module';
import { LanguagesModule } from 'src/_modules/languages/languages.module';
import { GlobalModule } from 'src/globals/global.module';
import { LocaleMiddleware } from 'src/globals/middlewares/locale.middleware';
import { RateLimitMiddleware } from 'src/globals/middlewares/rate-limit.middleware';
import { XssMiddleware } from 'src/globals/middlewares/xss.middleware';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SwaggerDiffController } from './swagger/swagger-diff.controller';
import { NotificationMiddleware } from 'src/globals/middlewares/notification.middleware';
import { NotificationService } from 'src/globals/services/notification.service';
import { DayModule } from 'src/_modules/day/day.module';
import { SituationModule } from 'src/_modules/situation/situation.module';
import { NotificationsModule } from 'src/_modules/notifications/notifications.module';
import { PushTokensModule } from 'src/_modules/push-tokens/push-tokens.module';
import { ScheduleModule } from '@nestjs/schedule';
const I18N_DIR = path.join(process.cwd(), './i18n');

@Module({
  imports: [
    ScheduleModule.forRoot(),
    I18nModule.forRootAsync({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env',
        }),
      ],
      useFactory: (configService: ConfigService) => ({
        fallbackLanguage: configService.getOrThrow('FALLBACK_LANGUAGE'),
        loaderOptions: {
          path: I18N_DIR,
          watch: true,
        },
      }),
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        AcceptLanguageResolver,
        new HeaderResolver(['x-lang', 'local-lang']),
      ],
      inject: [ConfigService],
    }),

    GlobalModule,
    // SearchModule,
    NotificationsModule,
    PushTokensModule,
    // MediaModule,
    AuthenticationModule,
    DayModule,
    SituationModule,
    // AuthorizationModule,
    // UserModule,
    LanguagesModule,
  ],
  controllers: [AppController, SwaggerDiffController],
  providers: [AppService, NotificationService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LocaleMiddleware).forRoutes('*');
    consumer.apply(XssMiddleware).forRoutes('*');
    consumer.apply(RateLimitMiddleware).forRoutes('*');
    consumer.apply(NotificationMiddleware).forRoutes('*');
  }
}
