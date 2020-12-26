import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AdminGuard } from 'src/guards/admin.guard';
import { IdGuard } from 'src/guards/id.guard';
import { UserResponse } from 'src/response/user.response';
import { UserDTO } from 'src/validation/user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {

    constructor(
        private readonly userService: UserService,
    ) { }

    @UseGuards(IdGuard)
    @Get('me')
    me(@Param('id') id: number): Promise<UserResponse> {
        return this.userService.getUser(id)
    }

    @UseGuards(IdGuard, AdminGuard)
    @Get()
    getAllUsers(): Promise<UserResponse> {
        return this.userService.getAllUsers()
    }

    @Post('signup')
    signup(@Body() userDTO: UserDTO): Promise<UserResponse> {
        return this.userService.signup(userDTO)
    }

    @Post('login')
    login(@Body() userDTO: UserDTO): Promise<UserResponse> {
        return this.userService.login(userDTO)
    }

    // update(): Promise<UserResponse> {
    //     return null
    // }

}
