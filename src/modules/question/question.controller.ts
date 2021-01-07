import { Body, Controller, Delete, Get, Param, Post, Put, Query, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AdminGuard } from 'src/guards/admin.guard';
import { IdGuard } from 'src/guards/id.guard';
import { QuestionResponse } from 'src/response/question.response';
import { QuestionDTO } from 'src/validation/question.dto';
import { QuestionService } from './question.service';
import { Request, Response } from 'express'
import { ConfigService } from '@nestjs/config';
import { DevConfig } from 'src/keys/dev.config';

@Controller('question')
export class QuestionController {
    constructor(
        private readonly questionService: QuestionService,
        private readonly devConfig: ConfigService<DevConfig>,
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

    @Post('/image')
    @UseGuards(IdGuard, AdminGuard)
    @UseInterceptors(FileInterceptor('image', {
        storage: diskStorage({
            filename: (req: Request, file, cb) => {
                file.filename = `${req.query.qID}${extname(file.originalname)}`
                cb(null, file.filename)
            },
            destination: './images/question'
        })
    }))
    uploadImage(@Query('qID') qID, @UploadedFile() file): Promise<QuestionResponse> {
        let imgURL = this.devConfig.get<string>("BASE_URL") + `/category/images/${file.filename}`
        return this.questionService.updateQuestion(qID, {
            image: imgURL,
        })
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

    @Get('/images/:imgpath')
    seeUploadedFile(@Param('imgpath') image, @Res() res: Response) {
        return res.sendFile(image, { root: './images/question' });
    }

}
