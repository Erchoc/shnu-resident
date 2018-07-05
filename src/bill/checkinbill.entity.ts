import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Booking } from '../booking/booking.entity';

@Entity()
export class CheckinBill {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    institute: string;

    @Column('text')
    name: string;

    @Column('text')
    serial: string;

    @Column('text')
    gender: string;

    @Column('text')
    room: string;



    @Column('double')
    amount: number;

    @Column('double')
    amountbase: number;

    @Column('int')
    check: number;

    @Column('int')
    checkbase: number;
    
    @Column('int')
    year: number;

    @Column('int')
    month: number;

    @Column('int')
    vacation: boolean;


    @Column('text')
    comment: string;

}