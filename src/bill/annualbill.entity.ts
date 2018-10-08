import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Booking } from '../booking/booking.entity';

@Entity()
export class AnnualBill {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    institute: string;

    @Column('text')
    name: string;

    @Column('text')
    serial: string;

    @Column('text')
    month12: string;

    @Column('text')
    contact: string;

    @Column('int')
    year: number;

    @Column('double')
    amount: number;

    @Column('double')
    subsidy: number;

    @Column('double')
    amount1: number;

    @Column('double')
    amount2: number;

    @Column('text')
    resident: string;

    @Column('text')
    comment: string;

    @Column('date')
    start1: Date;

    @Column('date')
    end1: Date;

    @Column('date')
    start2: Date;

    @Column('date')
    end2: Date;

    @Column('date')
    checkin: Date;

    @Column('date')
    checkout: Date;

    @Column('datetime')
    generated_at: Date;
}