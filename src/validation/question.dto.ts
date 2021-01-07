import { IsArray, IsNumber, IsOptional, MinLength } from "class-validator"

export class QuestionDTO {
    @IsOptional()
    @MinLength(5)
    question?: string

    @IsOptional()
    @IsArray()
    options?: string[]

    @IsOptional()
    @IsNumber()
    answer?: number

    @IsOptional()
    image?: string

    @IsOptional()
    @IsNumber()
    categoryID?: number
}