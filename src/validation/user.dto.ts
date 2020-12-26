import { IsEmail, IsOptional, MinLength } from "class-validator"
import { UserRole } from "src/entity/user.entity"

export class UserDTO {

    @IsOptional()
    name: string

    @IsOptional()
    @IsEmail()
    email: string

    @IsOptional()
    @MinLength(6, { message: "Mininum length should be 6" })
    password: string
}