import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'argon2';
import { User, UserRole } from 'src/entity/user.entity';
import { UserResponse } from 'src/response/user.response';
import { UserDTO } from 'src/validation/user.dto';
import { Repository } from 'typeorm';

@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(User) private readonly userRepo: Repository<User>,
        private readonly jwtService: JwtService,
    ) { }

    async createAdmin(userDTO: UserDTO): Promise<UserResponse> {
        userDTO.password = await hash(userDTO.password)
            .catch(({ message }) => {
                console.log(message)
                throw new HttpException("Cannot create admin", HttpStatus.BAD_REQUEST)
            })

        await this.userRepo.insert({ role: UserRole.ADMIN, ...userDTO })
            .catch(({ message }) => {
                console.log(message)
                if (message.includes('duplicate'))
                    throw new HttpException("Email already exists", HttpStatus.BAD_REQUEST)
                throw new HttpException("Cannot create admin", HttpStatus.BAD_REQUEST)
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
}
