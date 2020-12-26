import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/entity/category.entity';
import { Game } from 'src/entity/game.entity';
import { MinUser } from 'src/entity/minUser.model';
import { Question } from 'src/entity/question.entity';
import { User } from 'src/entity/user.entity';
import { GameResponse } from 'src/response/game.response';
import { shuffle } from 'src/util/shuffle';
import { GameDTO } from 'src/validation/game.dto';
import { Repository } from 'typeorm';

@Injectable()
export class GameService {
    constructor(
        @InjectRepository(Game) private readonly gameRepo: Repository<Game>,
        @InjectRepository(Category) private readonly categoryRepo: Repository<Category>,
        @InjectRepository(Question) private readonly questionRepo: Repository<Question>,
        @InjectRepository(User) private readonly userRepo: Repository<User>,
    ) { }

    async _getMinUser(id: number): Promise<MinUser> {
        let user = await this.userRepo.findOne(id)
        if (!user)
            return undefined
        let { name, image } = user
        return {
            id,
            name,
            image: image,
        }
    }

    async _getShuffledQuestions(cat: Category): Promise<Question[]> {

        let questions = await this.questionRepo.find({
            where: {
                category: cat
            }
        })

        shuffle(questions)

        if (questions.length <= 10)
            return questions
        else {
            return questions.slice(0, 10)
        }
    }

    async getAllGames(): Promise<GameResponse> {
        let games = await this.gameRepo.find()

        return {
            success: true,
            data: games,
        }
    }

    async getGameByID(gameID: number): Promise<GameResponse> {

        let game = await this.gameRepo.findOne(gameID, { relations: ['category'] })

        if (!game)
            throw new HttpException('Game not found', HttpStatus.NOT_FOUND)



        return {
            success: true,
            data: {
                ...game,
                questions: [],
            }
        }
    }

    async getGamesByUser(id: number): Promise<GameResponse> {

        let games = await this.gameRepo.createQueryBuilder('game')
            .where(`game.pId1 = ${id} OR game.pId2 = ${id}`)
            .getMany()

        return {
            success: true,
            data: games
        }
    }

    async createSinglePlayerGame(id: number, gameDTO: GameDTO): Promise<GameResponse> {

        let minUser = await this._getMinUser(id)

        if (!minUser)
            throw new HttpException('User not found', HttpStatus.NOT_FOUND)

        let cat = await this.categoryRepo.findOne(gameDTO.categoryID)

        if (!cat)
            throw new HttpException('Category not found', HttpStatus.NOT_FOUND)

        let questions = await this._getShuffledQuestions(cat)

        let qIDs: number[] = []

        questions.forEach((q) => qIDs.push(q.id))

        let res = await this.gameRepo.insert({
            category: cat,
            gameType: gameDTO.gameType,
            pId1: id,
            pName1: minUser.name,
            pImage1: minUser.image,
            questions: qIDs,
        }).catch(({ message }) => {
            console.log(message)
            throw new HttpException('Cannot create game', HttpStatus.BAD_REQUEST)
        })

        let gameID = res.identifiers[0].id

        let game = await await this.gameRepo.findOne(gameID)

        return {
            success: true,
            data: {
                ...game,
                questions: questions,
                category: cat,
            }
        }
    }

    async updateSingleGameScore(id: number, gameID: number, gameDTO: GameDTO): Promise<GameResponse> {

        let game = await this.gameRepo.findOne(gameID)

        if (!game)
            throw new HttpException('Game not found', HttpStatus.NOT_FOUND)

        if (game.pId1 === id) {
            game.score1 = gameDTO.score
        } else {
            game.score2 = gameDTO.score
        }

        game = await this.gameRepo.save(game)

        return {
            success: true,
            data: {
                ...game,
                questions: [],
            }
        }
    }
}
