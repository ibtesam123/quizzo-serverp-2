import { QuestionController } from './question.controller';
import { QuestionService } from './question.service';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JWTConfig } from 'src/keys/jwt.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from 'src/entity/category.entity';
import { Question } from 'src/entity/question.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Category, Question]),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (jwtConfig: ConfigService<JWTConfig>) => ({
                secret: jwtConfig.get<string>("JWT_SECRET"),
            }),
        })
    ],
    controllers: [
        QuestionController,
    ],
    providers: [
        QuestionService,
    ],
})
export class QuestionModule { }
