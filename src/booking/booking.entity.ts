import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Room } from '../room/room.entity';
import { Bill } from '../bill/bill.entity';
import { Teacher } from '../teacher/teacher.entity';

@Entity()
export class Booking {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    checkin: Date;

    @Column()
    checkout: Date;

    @Column()
    start: Date;

    @Column()
    end: Date;

    @Column('double')
    amount: number;

    @Column('double')
    rent: number;

    @ManyToOne(type => Room, {eager: true})
    @JoinColumn({ name: 'r_id' })
    room: Room;


    @ManyToOne(type => Teacher, {eager: true})
    @JoinColumn({ name: 't_id' })
    teacher: Teacher;

    @OneToMany(type => Bill , bill=>bill.booking, {eager: true,cascade:true})
    bill: Bill[];
}