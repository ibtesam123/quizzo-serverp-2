import { GameController } from './game.controller';
import { GameService } from './game.service';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from 'src/entity/category.entity';
import { JWTConfig } from 'src/keys/jwt.config';
import { Question } from 'src/entity/question.entity';
import { Game } from 'src/entity/game.entity';
import { User } from 'src/entity/user.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Category, Question, Game, User]),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (jwtConfig: ConfigService<JWTConfig>) => ({
                secret: jwtConfig.get<string>("JWT_SECRET"),
            }),
        })
    ],
    controllers: [
        GameController,
    ],
    providers: [
        GameService,
    ],
})
export class GameModule { }
