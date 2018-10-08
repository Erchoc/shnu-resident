
import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bill } from './bill.entity';
import {CrudTypeOrmService} from '../infrastructure/nest-crud/crud-typeorm.service';
import { BookingService } from '../booking/booking.service';
import * as moment from 'moment'

@Injectable()
export class BillService extends CrudTypeOrmService<Bill>{
    constructor(
        @InjectRepository(Bill)
        private readonly repo: Repository<Bill>,
        @Inject(forwardRef(() => BookingService))  

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

    public async findInRange(from : string,to : string,residentId : number){
        let fromDate = moment(from)
        let toDate = moment(to)
        let qb = this.repo.createQueryBuilder("bill")
        .leftJoinAndSelect("bill.booking", "booking")
        .leftJoinAndSelect("booking.teacher", "teacher")
        .leftJoinAndSelect("booking.room", "room")
        .leftJoinAndSelect("room.resident", "resident")

        .where("(year*100+month) between :from and :to",{from:fromDate.year()*100+(fromDate.month()+1),to:toDate.year()*100+(toDate.month()+1)})
        if(residentId){
            qb = qb.andWhere("room.resident = :resident",{resident:residentId})
        }        
        return await qb.getMany();

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

    private monthDiff(a:Date,b:Date){
        let aM = moment(a).startOf('month')
        let bM = moment(b).startOf('month')
        return aM.diff(bM,'months')
    }

    public async billFix(){
        let bookings = await this.bookingService.getAll({})
        let billsToUpdate = []
        let error = false
        for(const booking of bookings){
            let realStartDate = moment(booking.start)
            let realEndDate = moment(booking.end)
            let lastBill = booking.bill[booking.bill.length-1]
            let firstBill = booking.bill[0]

            let fakeEndDate = moment().year(lastBill.year).month(lastBill.month-1).startOf('month')
            let fakeStartDate = moment().year(firstBill.year).month(firstBill.month-1).startOf('month')

            let diffTail = this.monthDiff(fakeEndDate.toDate(),realEndDate.toDate())
            let diffStart = this.monthDiff(fakeStartDate.toDate(),realStartDate.toDate())
            if(diffTail-diffStart>=1){
                error = true
            }else{
                let realDiff = diffTail > diffStart ? diffTail : diffStart
                for (let bill of booking.bill){
                    let fakeDate = moment().year(bill.year).month(bill.month-1).startOf('month').subtract(realDiff,'months')
                    bill.month = fakeDate.month()+1
                    bill.year = fakeDate.year()
                    billsToUpdate.push(bill);
                }
            }
        }
        return error ? null : this.repo.save(billsToUpdate);
    }

}