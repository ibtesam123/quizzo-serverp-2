import { Question } from "src/entity/question.entity"

export class QuestionResponse {
    success: boolean
    data: Question | Question[]
}