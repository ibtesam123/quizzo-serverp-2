import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { DevCheckGuard } from 'src/guards/devcheck.guard';
import { UserResponse } from 'src/response/user.response';
import { UserDTO } from 'src/validation/user.dto';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
    constructor(
        private readonly adminService: AdminService,
    ) { }


    @Post()
    @UseGuards(DevCheckGuard)
    createAdmin(@Body() userDTO: UserDTO): Promise<UserResponse> {
        return this.adminService.createAdmin(userDTO);
    }
}
