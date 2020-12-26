import { Category } from "src/entity/category.entity"
import { Game, GameType } from "src/entity/game.entity"
import { MinUser } from "src/entity/minUser.model"
import { Question } from "src/entity/question.entity"

export class GameResponse {
    success: boolean
    data: {
        id: number

        pId1: number

        pId2?: number

        pName1: string

        pName2?: string

        pImage1?: string

        pImage2?: string

        score1: number

        score2?: number

        questions: Question[]

        category: Category

        gameType: GameType
    } | {
        id: number

        pId1: number

        pId2?: number

        pName1: string

        pName2?: string

        pImage1?: string

        pImage2?: string

        score1: number

        score2?: number

        questions: Question[]

        category: Category

        gameType: GameType
    }[] | Game[]
}