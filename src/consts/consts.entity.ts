import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Resident } from '../resident/resident.entity';
@Entity()
export class Consts {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    field: string;

    @Column('text')
    name: string;

    @Column('text')
    value: string;
}