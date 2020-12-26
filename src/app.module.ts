import { GameModule } from './modules/game/game.module';
import { CategoryModule } from './modules/category/category.module';
import { QuestionModule } from './modules/question/question.module';
import { AdminModule } from './modules/admin/admin.module';
import { UserModule } from './modules/user/user.module';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { DBConfig } from './keys/db.config';
import { Category } from './entity/category.entity';
import { Question } from './entity/question.entity';
import { Game } from './entity/game.entity';

@Module({
  imports: [
    GameModule,
    CategoryModule,
    QuestionModule,
    AdminModule,
    UserModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (dbConfig: ConfigService<DBConfig>) => ({
        type: "postgres",
        host: dbConfig.get<string>("DB_HOST"),
        port: dbConfig.get<number>("DB_PORT"),
        username: dbConfig.get<string>("DB_USERNAME"),
        password: dbConfig.get<string>("DB_PASSWORD"),
        database: dbConfig.get<string>("DB_NAME"),
        synchronize: true,
        entities: [User, Category, Question, Game],
      }),
    }),
  ],
})
export class AppModule { }
