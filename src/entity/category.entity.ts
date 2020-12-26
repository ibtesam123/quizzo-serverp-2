import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Game } from "./game.entity";
import { Question } from "./question.entity";

@Entity('category')
export class Category {

    @PrimaryGeneratedColumn()
    id: number

    @Column({ unique: true })
    name: string

    @Column({ nullable: true })
    image?: string

    @OneToMany(() => Question, (question) => question.category, { onDelete: "CASCADE" })
    questions: Question[]

    @OneToMany(() => Game, (game) => game.category)
    games: Game[]
}