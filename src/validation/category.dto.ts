import { IsOptional } from "class-validator"

export class CategoryDTO {

    @IsOptional()
    name?: string

    @IsOptional()
    image?: string
}