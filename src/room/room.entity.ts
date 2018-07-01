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

    @ManyToOne(type => Resident, {eager: true})
    @JoinColumn({ name: 'res_id' })
    resident: Resident;
}
