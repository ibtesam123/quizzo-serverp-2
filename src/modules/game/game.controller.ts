import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AdminGuard } from 'src/guards/admin.guard';
import { IdGuard } from 'src/guards/id.guard';
import { GameResponse } from 'src/response/game.response';
import { GameDTO } from 'src/validation/game.dto';
import { GameService } from './game.service';

@Controller('game')
export class GameController {
    constructor(
        private readonly gameService: GameService,
    ) { }

    @Get()
    @UseGuards(IdGuard, AdminGuard)
    getAllGames(): Promise<GameResponse> {
        return this.gameService.getAllGames()
    }

    @Get('/me')
    @UseGuards(IdGuard)
    getGameByUser(@Param('id') id: number): Promise<GameResponse> {
        return this.gameService.getGamesByUser(id)
    }

    @Get(':gameID')
    @UseGuards(IdGuard)
    getSingleGame(@Param('gameID') gameID: number): Promise<GameResponse> {
        return this.gameService.getGameByID(gameID)
    }

    @Post()
    @UseGuards(IdGuard)
    createGame(@Param('id') id: number, @Body() gameDTO: GameDTO): Promise<GameResponse> {
        return this.gameService.createSinglePlayerGame(id, gameDTO)
    }

    @Put(':gameID')
    @UseGuards(IdGuard)
    updateScore(@Param('gameID') gameID: number, @Param('id') id: number, @Body() gameDTO: GameDTO): Promise<GameResponse> {
        return this.gameService.updateSingleGameScore(id, gameID, gameDTO)
    }
}
