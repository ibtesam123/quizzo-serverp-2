import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { hash, verify } from 'argon2';
import { User } from 'src/entity/user.entity';
import { UserResponse } from 'src/response/user.response';
import { UserDTO } from 'src/validation/user.dto';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
    constructor(
        private readonly jwtService: JwtService,
        @InjectRepository(User) private readonly userRepo: Repository<User>,
    ) { }

    async getUser(id: number): Promise<UserResponse> {
        let user = await this.userRepo.findOne(id)

        if (!user)
            throw new HttpException("User not found", HttpStatus.NOT_FOUND)

        let { password, role, ...mUser } = user

        return {
            success: true,
            data: mUser,
        }
    }

    async getAllUsers(): Promise<UserResponse> {
        let users = await this.userRepo.find({
            select: ["id", "email", "name", "token", "role"]
        })

        return {
            success: true,
            data: users,
        }
    }

    async signup(userDTO: UserDTO): Promise<UserResponse> {

        userDTO.password = await hash(userDTO.password)
            .catch(({ message }) => {
                console.log(message)
                throw new HttpException("Cannot create user", HttpStatus.BAD_REQUEST)
            })

        await this.userRepo.insert(userDTO)
            .catch(({ message }) => {
                console.log(message)
                if (message.includes('duplicate'))
                    throw new HttpException("Email already exists", HttpStatus.BAD_REQUEST)
                throw new HttpException("Cannot create user", HttpStatus.BAD_REQUEST)
            })

        let user = await this.userRepo.findOne({
            where: {
                email: userDTO.email
            },
        })

        let token = this.jwtService.sign({
            id: user.id,
            role: user.role,
        })

        user.token = token

        user = await this.userRepo.save(user)

        let { password, ...mUser } = user

        return {
            success: true,
            data: mUser,
        }
    }

    async login(userDTO: UserDTO): Promise<UserResponse> {

        let user = await this.userRepo.findOne({
            where: {
                email: userDTO.email
            }
        }).catch(({ message }) => {
            console.log(message)
            throw new HttpException("Cannot login user", HttpStatus.BAD_REQUEST)
        })

        if (!user)
            throw new HttpException("Incorrect email or password", HttpStatus.UNAUTHORIZED)

        let res = await verify(user.password, userDTO.password)

        if (!res)
            throw new HttpException("Incorrect email or password", HttpStatus.UNAUTHORIZED)

        try {
            this.jwtService.verify(user.token)
        } catch (_) {
            let token = this.jwtService.sign({
                id: user.id,
                role: user.role,
            })

            user.token = token

            user = await this.userRepo.save(user)
        }

        let { password, ...mUser } = user

        return {
            success: true,
            data: mUser
        }
    }

    // async update(id: number, userDTO: UserDTO): Promise<UserResponse> {

    // }
}
