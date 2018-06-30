import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Resident } from '../resident/resident.entity';
@Entity()
export class Room {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    room: string;

    @Column('text')
    block: string;

    @ManyToOne(type => Resident)
    @JoinColumn({ name: 'resident_id' })
    resident: Resident;
}
