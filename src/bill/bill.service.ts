
import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bill } from './bill.entity';
import {CrudTypeOrmService} from '../infrastructure/nest-crud/crud-typeorm.service';
import { BookingService } from '../booking/booking.service';

@Injectable()
export class BillService extends CrudTypeOrmService<Bill>{
    constructor(
        @InjectRepository(Bill)
        private readonly repo: Repository<Bill>,
        private readonly bookingService: BookingService
    ) {
        super(repo);
    }

    public async generateAnomaly(month : number,year : number){
        let q = 
        await this.repo.createQueryBuilder("bill")
        .select("distinct type,booking_id")
        .where("type != :t",{t: '正常'})
        .groupBy("type").addGroupBy("booking_id")
        .having("max(year*100+month)=:mm",{mm:year*100+month})
        .getRawMany();

        let res = await Promise.all(q.map(async i=> await this.generateAnomalyHelper(i)))

        return res

    }

    public async generateAnomalyHelper({type, booking_id}){
        let booking = await this.bookingService.getOne(booking_id)
        return {type:type,
                bookingId:booking.id,
                name:booking.teacher.name,
                institute:booking.teacher.institute,
                resident:booking.room.resident,
                serial:booking.teacher.serial
            }
    }
}