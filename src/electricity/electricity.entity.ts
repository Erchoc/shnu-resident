import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Room } from '../room/room.entity';

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

    @ManyToOne(type => Room)
    @JoinColumn({ name: 'room_id' })
    room: Room;
}