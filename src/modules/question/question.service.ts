import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/entity/category.entity';
import { Question } from 'src/entity/question.entity';
import { QuestionResponse } from 'src/response/question.response';
import { QuestionDTO } from 'src/validation/question.dto';
import { Repository } from 'typeorm';

@Injectable()
export class QuestionService {
    constructor(
        @InjectRepository(Category) private readonly categoryRepo: Repository<Category>,
        @InjectRepository(Question) private readonly questionRepo: Repository<Question>,
    ) { }

    async getAllQuestions(): Promise<QuestionResponse> {
        let ques = await this.questionRepo.find({
            relations: ['category']
        })

        return {
            success: true,
            data: ques,
        }
    }

    async getSingleQuestion(qID: number): Promise<QuestionResponse> {
        let ques = await this.questionRepo.findOne(qID, { relations: ['category'] })

        if (!ques)
            throw new HttpException('Question not found', HttpStatus.NOT_FOUND)

        return {
            success: true,
            data: ques,
        }
    }

    async getQuestionByCategory(catID: number, limit?: number): Promise<QuestionResponse> {

        let cat = await this.categoryRepo.findOne(catID)

        if (!cat)
            throw new HttpException('Category not found', HttpStatus.NOT_FOUND)

        let ques = await this.questionRepo.find({
            where: {
                category: cat
            },
            take: limit
        }).catch(({ message }) => {
            console.log(message)
            throw new HttpException('Cannot get the questions', HttpStatus.BAD_REQUEST)
        })

        return {
            success: true,
            data: ques,
        }
    }

    async createQuestion(quesDTO: QuestionDTO): Promise<QuestionResponse> {

        let cat = await this.categoryRepo.findOne(quesDTO.categoryID)

        if (!cat)
            throw new HttpException('Category not found', HttpStatus.NOT_FOUND)

        await this.questionRepo.insert({ category: cat, ...quesDTO })
            .catch(({ message }) => {
                console.log(message)
                if (message.includes('duplicate'))
                    throw new HttpException('Question already exists', HttpStatus.BAD_REQUEST)
                throw new HttpException('Cannot create Question', HttpStatus.BAD_REQUEST)
            })

        let ques = await this.questionRepo.findOne({
            where: {
                question: quesDTO.question,
            }
        })

        return {
            success: true,
            data: ques,
        }
    }

    async updateQuestion(quesID: number, quesDTO: QuestionDTO): Promise<QuestionResponse> {

        let ques = await this.questionRepo.findOne(quesID)

        if (!ques)
            throw new HttpException('Question not found', HttpStatus.NOT_FOUND)

        await this.questionRepo.update(quesID, quesDTO)
            .catch(({ message }) => {
                console.log(message)
                throw new HttpException('Cannot update question', HttpStatus.BAD_REQUEST)
            })

        ques = await this.questionRepo.findOne(quesID)

        return {
            success: true,
            data: ques,
        }
    }

    async deleteQuestion(quesID: number): Promise<QuestionResponse> {
        let ques = await this.questionRepo.findOne(quesID)

        if (!ques)
            throw new HttpException('Question not found', HttpStatus.NOT_FOUND)

        await this.questionRepo.delete(ques)
            .catch(({ message }) => {
                console.log(message)
                throw new HttpException('Cannot delete question', HttpStatus.BAD_REQUEST)
            })

        return {
            success: true,
            data: ques,
        }
    }

    async deleteMultipleQuestions(quesIDs: string): Promise<QuestionResponse> {

        let qIDs = quesIDs.split(',')

        await this.questionRepo.delete(qIDs)
            .catch(({ message }) => {
                console.log(message)
                throw new HttpException('Cannot delete questions of given category', HttpStatus.BAD_REQUEST)
            })

        return {
            success: true,
            data: null,
        }
    }
}
