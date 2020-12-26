import { text } from "express"
import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { Category } from "./category.entity"
import { Game } from "./game.entity"

@Entity('question')
export class Question {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ unique: true })
    question: string

    @Column({ type: 'text', array: true, })
    options: string[]

    @Column()
    answer: number

    @Column({ nullable: true })
    image?: string

    @ManyToOne(() => Category, (category) => category.questions, { onDelete: "CASCADE" })
    category: Category

}