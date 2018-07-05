import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Room } from '../room/room.entity';
import { Teacher } from '../teacher/teacher.entity';


@Entity()
export class CorpBill {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    roomname: string;

    @Column('text')
    residentname: string;


    @Column('text')
    block: string;

    @Column('text')
    name: string;

    @Column('double')
    amount: number;

    @Column('double')
    subsidy: number;

    @Column('int')
    season: number;

    @Column('int')
    year: number;


    @Column('date')
    start: Date;

    @Column('date')
    end: Date;

    @ManyToOne(type => Room)
    @JoinColumn({ name: 'r_id' })
    room: Room;

    @ManyToOne(type => Teacher)
    @JoinColumn({ name: 't_id' })
    teacher: Teacher;

}