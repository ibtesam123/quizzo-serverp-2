import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AdminGuard } from 'src/guards/admin.guard';
import { IdGuard } from 'src/guards/id.guard';
import { QuestionResponse } from 'src/response/question.response';
import { QuestionDTO } from 'src/validation/question.dto';
import { QuestionService } from './question.service';

@Controller('question')
export class QuestionController {
    constructor(
        private readonly questionService: QuestionService,
    ) { }

    @Get()
    @UseGuards(IdGuard, AdminGuard)
    getAllQuestions(): Promise<QuestionResponse> {
        return this.questionService.getAllQuestions()
    }

    @Get(':qID')
    @UseGuards(IdGuard, AdminGuard)
    getSingleQuestion(@Param('qID') qID: number): Promise<QuestionResponse> {
        return this.questionService.getSingleQuestion(qID)
    }

    @Get('category/:catID')
    getQuestionByCategory(@Param('catID') catID: number, @Query('limit') limit: number): Promise<QuestionResponse> {
        return this.questionService.getQuestionByCategory(catID, limit)
    }

    @Post()
    @UseGuards(IdGuard, AdminGuard)
    createQuestion(@Body() quesDTO: QuestionDTO): Promise<QuestionResponse> {
        return this.questionService.createQuestion(quesDTO)
    }

    @Put(':qID')
    @UseGuards(IdGuard, AdminGuard)
    updateQuestion(@Param('qID') qID: number, @Body() quesDTO: QuestionDTO): Promise<QuestionResponse> {
        return this.questionService.updateQuestion(qID, quesDTO)
    }

    @Delete()
    @UseGuards(IdGuard, AdminGuard)
    deleteMultipleQuestions(@Query('ids') qIDs: string): Promise<QuestionResponse> {
        return this.questionService.deleteMultipleQuestions(qIDs)
    }

    @Delete(':qID')
    @UseGuards(IdGuard, AdminGuard)
    deleteQuestion(@Param('qID') qID: number): Promise<QuestionResponse> {
        return this.questionService.deleteQuestion(qID)
    }

}
