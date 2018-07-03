
import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from './booking.entity';
import {CrudTypeOrmService} from '../infrastructure/nest-crud/crud-typeorm.service';
import { RoomService } from '../room/room.service';

@Injectable()
export class BookingService extends CrudTypeOrmService<Booking>{
    constructor(
        @InjectRepository(Booking)
        private readonly repo: Repository<Booking>,
        private readonly roomService: RoomService,
    ) {
        super(repo);
    }

    public async saveProccess(entity: Booking): Promise<Booking> {
        entity = await super.saveProccess(entity)
        entity = await this.updateRoom(entity)
        return entity
    }

    private async updateRoom(entity:Booking): Promise<Booking>{
        let newRoom = entity.room
        delete newRoom.id
        let [rooms , roomResult] = await this.roomService.query(newRoom)
        if(roomResult > 0){
            entity.room = rooms[0]
        }else{
            newRoom = await this.roomService.create(newRoom)
            entity.room = newRoom
        }
        return entity
    }

}