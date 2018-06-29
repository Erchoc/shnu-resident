import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Teacher {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    serial: string;

    @Column('text')
    name: string;

    @Column('text')
    institute: string;

    @Column('text')
    contact: string;
}