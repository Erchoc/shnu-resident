import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Resident {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    name: string;

    @Column('int')
    monthdiff: number;

}