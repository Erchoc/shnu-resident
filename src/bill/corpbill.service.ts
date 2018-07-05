
import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOperator } from 'typeorm';
import { Bill } from './bill.entity';
import {CrudTypeOrmService} from '../infrastructure/nest-crud/crud-typeorm.service';
import { BillService } from './bill.service';
import { join } from 'path'
import * as Excel from 'ejsexcel'
import * as fs from 'fs';
import * as util from 'util'
import { CorpBill } from './corpbill.entity';
import { ResidentService } from '../resident/resident.service';
import { RoomService } from '../room/room.service';
import { TeacherService } from '../teacher/teacher.service';
import { BookingService } from '../booking/booking.service';
import { ConstsService } from '../consts/consts.service';
const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

@Injectable()
export class CorpBillService extends CrudTypeOrmService<CorpBill>{
    constructor(
        @InjectRepository(CorpBill)
        private readonly repo: Repository<CorpBill>,
        private readonly billService: BillService,
        private readonly residentService: ResidentService,
        private readonly roomService: RoomService,
        private readonly teacherService: TeacherService,
        private readonly bookingService: BookingService,
        private readonly constService: ConstsService,


    ) {
        super(repo);
    }


    // public async generateSheetByYearAndMonthAndResident(year:string, month: string, resident:string) : Promise<CorpBill[]> {
    //     const excelBuf = await readFileAsync(join(__dirname,'../resources/monthlyBill.xlsx'))
    //     let data = await this.repo.find({where:{year:parseInt(year),month:parseInt(month),resident:new FindOperator('like','%'+resident+'%')}})
    //     let dataToRender:any[] = data.map(r=>{return {id:r.id+'', name:r.name,serial:"'"+r.serial,amount:r.amount}})
    //     dataToRender.push({id:'总计',amount:data.map(i=>i.amount).reduce((a,b)=>a+b)})
    //     let arrToRender = [[{booktitle:resident+'公寓（'+year+'年'+month+'月)'}],dataToRender]

    //     return await Excel.renderExcel(excelBuf, arrToRender);
        
    // }

    public async generateBySeasonAndResident(season: number, resident: number, raw: CorpBill[]) : Promise<CorpBill[]> {

        let r = await this.residentService.getOne(resident)
        let findOption = {year:new Date().getFullYear(),season:season,residentname:new FindOperator('like','%'+r.name+'%')}
        await this.repo.delete(findOption)

        let fail:CorpBill[] = []
        let success:CorpBill[] = []
        let rate = await this.constService.getAll({field:'rate'})
        let realRate = rate && rate.length > 0 ? parseInt(rate[0].value) / 100 : 0.5
        for(let indice in raw){
            let i = raw[indice]
            let cb = new CorpBill()
            let bookings = await this.bookingService.findBookingByRoomBlockTeacherNameAndSeason(r.name,i.roomname,i.block,i.name,season)
            if(bookings.length < 1) {fail.push(i);continue;}
            let room = bookings[0].room
            cb.roomname = room.room
            cb.start = new Date(i.start)
            cb.end = new Date(i.end)
            cb.block = room.block
            cb.amount = parseInt(i.amount+'')
            cb.name = bookings[0].teacher.name
            cb.season = season
            cb.residentname = r.name
            cb.teacher = bookings[0].teacher
            cb.room = room
            cb.subsidy = cb.amount * realRate
            cb.year = new Date().getFullYear()
            success.push(cb)
        }
        this.updateBatch(success)
        return fail
    }

    // private async groupBillsAndGenMonthlyByTeacher(bills: Bill[]): Promise<CorpBill[]>{
    //     let res : CorpBill[] = []
    //     const groupedByTeacher = this.groupBy(bills, bill => bill.booking.teacher.serial)
    //     groupedByTeacher.forEach((bills,serial)=>{
    //         let mb = new CorpBill();
    //         mb.amount = 0; mb.diff = 0;
    //         bills.forEach(bill=>{
    //             if(bill.type === '正常') mb.amount += bill.amount
    //             else mb.diff += bill.amount
    //             mb.name = bill.booking.teacher.name
    //             mb.institute = bill.booking.teacher.institute
    //             mb.month = bill.month
    //             mb.year = bill.year
    //             mb.serial = serial
    //             mb.resident = bill.booking.room.resident.name + bill.booking.room.block+'栋'+bill.booking.room.room+'室'
    //         })
    //         res.push(mb)
    //     })
    //     return res
    // }


    private groupBy(list, keyGetter) {
        const map = new Map();
        list.forEach((item) => {
            const key = keyGetter(item);
            const collection = map.get(key);
            if (!collection) {
                map.set(key, [item]);
            } else {
                collection.push(item);
            }
        });
        return map;
    }
}