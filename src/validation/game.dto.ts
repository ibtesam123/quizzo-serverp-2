import { IsNumber, IsOptional } from "class-validator"
import { GameType } from "src/entity/game.entity"

export class GameDTO {
    @IsOptional()
    categoryID: number

    @IsOptional()
    gameType: GameType

    @IsOptional()
    @IsNumber()
    score: number
}