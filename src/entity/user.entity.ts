import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Game } from "./game.entity";

export enum UserRole {
    USER = "user",
    ADMIN = "admin"
}

@Entity('users')
export class User {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column({ unique: true })
    email: string

    @Column()
    password: string

    @Column({ nullable: true })
    image?: string

    @Column({ default: "" })
    token: string

    @Column({ type: "enum", enum: UserRole, default: UserRole.USER })
    role: UserRole

    @ManyToMany(() => Game)
    games: Game[]
}