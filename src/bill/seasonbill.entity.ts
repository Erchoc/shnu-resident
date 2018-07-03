import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Booking } from '../booking/booking.entity';

@Entity()
export class SeasonBill {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    institute: string;

    @Column('text')
    name: string;

    @Column('text')
    serial: string;

    @Column('double')
    month1: number;

    @Column('double')
    month2: number;

    @Column('double')
    month3: number;


    @Column('text')
    contact: string;


    @Column('int')
    year: number;

    @Column('int')
    season: number;

    @Column('text')
    resident: string;

    @Column('text')
    comment: string;

    @Column('date')
    start: Date;

    @Column('date')
    end: Date;
}