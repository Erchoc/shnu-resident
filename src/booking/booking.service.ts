
import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOperator } from 'typeorm';
import { Booking } from './booking.entity';
import {CrudTypeOrmService} from '../infrastructure/nest-crud/crud-typeorm.service';
import { RoomService } from '../room/room.service';
import { ResidentService } from '../resident/resident.service';
import * as moment from 'moment'
import { TeacherService } from '../teacher/teacher.service';

@Injectable()
export class BookingService extends CrudTypeOrmService<Booking>{
    constructor(
        @InjectRepository(Booking)
        private readonly repo: Repository<Booking>,
        private readonly roomService: RoomService,
        private readonly residentService: ResidentService,
        private readonly teacherSercive: TeacherService
    ) {
        super(repo);
    }

    public async saveProccess(entity: Booking): Promise<Booking> {
        entity = await super.saveProccess(entity)
        entity = await this.updateRoom(entity)
        return entity
    }

    public async findBookingByRoomAndSeason(region: string,room: string,season: number): Promise<Booking[]> {
        let residents = await this.residentService.getAll({name:new FindOperator('like','%'+region+'%')})
        if(residents.length < 1) return []
        let rooms = await this.roomService.getAll({resident:new FindOperator('in',residents.map(r=>r.id)),room:room})
        if(rooms.length < 1) return []
        let startedAt = moment().month((season-1)*3).startOf('month').toDate()
        let endsAt = moment().month((season-1)*3+2).endOf('month').toDate()
        
        return await this.getAll({room: new FindOperator('in',rooms.map(r=>r.id)),checkin:new FindOperator('lessThan',endsAt),checkout:new FindOperator('moreThan',startedAt)})
    }


    public async findBookingByRoomBlockTeacherNameAndSeason(region: string,room: string,block: string, name:string, season: number): Promise<Booking[]> {
        let residents = await this.residentService.getAll({name:new FindOperator('like','%'+region+'%')})
        if(residents.length < 1) return []
        let rooms = await this.roomService.getAll({resident:new FindOperator('in',residents.map(r=>r.id)),room:room,block:block})
        if(rooms.length < 1) return []
        let teachers = await this.teacherSercive.getAll({name:name})
        if(teachers.length < 1) return []
        
        let startedAt = moment().month((season-1)*3).startOf('month').toDate()
        let endsAt = moment().month((season-1)*3+2).endOf('month').toDate()
        
        return await this.getAll({room: new FindOperator('in',rooms.map(r=>r.id)),teacher: new FindOperator('in',teachers.map(r=>r.id)),checkin:new FindOperator('lessThan',endsAt),checkout:new FindOperator('moreThan',startedAt)})
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