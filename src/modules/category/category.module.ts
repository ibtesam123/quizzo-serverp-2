import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JWTConfig } from 'src/keys/jwt.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from 'src/entity/category.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Category]),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (jwtConfig: ConfigService<JWTConfig>) => ({
                secret: jwtConfig.get<string>("JWT_SECRET"),
            }),
        })
    ],
    controllers: [
        CategoryController,],
    providers: [
        CategoryService,],
})
export class CategoryModule { }
