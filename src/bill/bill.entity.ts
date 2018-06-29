import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Booking } from '../booking/booking.entity';

@Entity()
export class Bill {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('int')
    month: number;

    @Column('int')
    year: number;

    @Column('double')
    amount: number;

    @Column('text')
    comment: string;

    @Column('double')
    diff: number;

    @ManyToOne(type => Booking)
    @JoinColumn({ name: 'booking_id' })
    room: Booking;
}