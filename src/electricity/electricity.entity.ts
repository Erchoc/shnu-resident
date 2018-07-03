import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Room } from '../room/room.entity';
import { Teacher } from '../teacher/teacher.entity';

@Entity()
export class Electricity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('int')
    season: number;

    @Column('int')
    year: number;

    @Column('double')
    amount: number;

    @Column('text')
    roomname: string;

    @Column('text')
    teachername: string;


    @Column('text')
    serial: string;

    @Column('text')
    comment: string;

    @Column('text')
    resident: string;

    @ManyToOne(type => Room)
    @JoinColumn({ name: 'r_id' })
    room: Room;

    @ManyToOne(type => Teacher)
    @JoinColumn({ name: 't_id' })
    teacher: Teacher;

}