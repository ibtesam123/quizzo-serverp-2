import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { Category } from "./category.entity"

export enum GameType {
    SINGLE = "single",
    MULTI = "multi"
}

@Entity('game')
export class Game {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    pId1: number

    @Column({ nullable: true })
    pId2?: number

    @Column()
    pName1: string

    @Column({ nullable: true })
    pName2?: string

    @Column({ nullable: true })
    pImage1?: string

    @Column({ nullable: true })
    pImage2?: string

    @Column({ default: 0 })
    score1: number

    @Column({ default: 0 })
    score2?: number

    @Column({ type: 'text', array: true })
    questions: number[]

    @ManyToOne(() => Category, (category) => category.games)
    category: Category

    @Column({ type: 'enum', enum: GameType, default: GameType.SINGLE })
    gameType: GameType
}