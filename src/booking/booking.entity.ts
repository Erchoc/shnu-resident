import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Room } from '../room/room.entity';

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

    @ManyToOne(type => Room)
    @JoinColumn({ name: 'room_id' })
    room: Room;
}