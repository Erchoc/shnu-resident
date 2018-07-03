import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Booking } from '../booking/booking.entity';

@Entity()
export class MonthlyBill {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    institute: string;

    @Column('text')
    name: string;

    @Column('text')
    serial: string;

    @Column('double')
    amount: number;

    @Column('double')
    diff: number;

    @Column('int')
    year: number;

    @Column('int')
    month: number;

    @Column('text')
    resident: string;

    @Column('text')
    comment: string;

}