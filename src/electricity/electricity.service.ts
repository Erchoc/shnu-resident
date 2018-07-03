
import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOperator } from 'typeorm';
import { Electricity } from './electricity.entity';
import {CrudTypeOrmService} from '../infrastructure/nest-crud/crud-typeorm.service';
import {ElectricityRaw} from './electricityraw.dto'
import { BookingService } from '../booking/booking.service';
import { Booking } from '../booking/booking.entity';
import { join } from 'path'

import * as moment from 'moment'
import * as Excel from 'ejsexcel'
import * as fs from 'fs';
import * as util from 'util'
const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

@Injectable()
export class ElectricityService extends CrudTypeOrmService<Electricity>{
    constructor(
        @InjectRepository(Electricity)
        private readonly repo: Repository<Electricity>,
        private readonly bookingService: BookingService
    ) {
        super(repo);
    }

    public async generate(season: number ,data: ElectricityRaw[]): Promise<ElectricityRaw[]> {
        let year = new Date().getFullYear()
        await this.deleteAll({year:year,season:season})
        let res = []
        let fails = []
        for(let i in data){
            let raw = data[i]
            let booking = await this.bookingService.findBookingByRoomAndSeason(raw.region,raw.room,season)
            if(booking.length < 1) {
                fails.push(raw); 
                continue;
            }
            let electricities = await this.booking2electrity(booking,raw.price,season)
            res = res.concat(electricities)
        }
        await this.updateBatch(res)
        return fails
    } 

    public async generateSheetByYearAndSeasonAndResident(year:string, season: string, resident:string) : Promise<Electricity[]> {
        const excelBuf = await readFileAsync(join(__dirname,'../resources/electricity.xlsx'))
        let data = await this.repo.find({where:{year:parseInt(year),season:parseInt(season),resident:new FindOperator('like','%'+resident+'%')}})
        let dataToRender:any[] = data.map(r=>{return {roomname:r.roomname, serial:r.serial,amount:r.amount,teachername:r.teachername,comment:r.comment}})
        dataToRender.push({roomname:'总计',amount:dataToRender.map(i=>i.amount).reduce((a,b)=>a+b)})
        let arrToRender = [[{booktitle:resident+'公寓（'+year+'年第'+season+'季度)电费'}],dataToRender]

        return await Excel.renderExcel(excelBuf, arrToRender);
        
    }

    public async booking2electrity(b: Booking[],amount: number,season:number):Promise<Electricity[]>{
        let res:Electricity[] = []
        let startedAt = moment().month((season-1)*3).startOf('month').toDate()
        let endsAt = moment().month((season-1)*3+2).endOf('month').toDate()
        
        let days = b.map(i=>moment(i.checkout > endsAt ? endsAt : i.checkout).diff(moment(i.checkin < startedAt ? startedAt : i.checkin),'days') + 1)
        let daysSum = days.reduce((a,b)=>a+b)
        for(let i = 0; i < b.length; i++){
            let booking = b[i]
            booking.checkout = booking.checkout > endsAt ? endsAt : booking.checkout
            booking.checkin = booking.checkin < startedAt ? startedAt : booking.checkin

            let e = new Electricity()
            e.amount = Math.ceil(days[i] / daysSum * amount)
            e.room = booking.room
            e.roomname = booking.room.room
            e.season = season
            e.teacher = booking.teacher
            e.teachername = booking.teacher.name
            e.serial = booking.teacher.serial
            e.year = new Date().getFullYear()
            e.resident = booking.room.resident.name + booking.room.block+'栋'+booking.room.room+'室'
            e.comment = '调试信息:电费总额'+amount+'，这季从'+moment(booking.checkin).format('YYYY-MM-DD')+'住到'+moment(booking.checkout).format('YYYY-MM-DD')+'一共'+days[i]+'天，该公寓这季所有人一共住了'+daysSum+'天，总额为向上取整('+days[i]+'/'+daysSum+'*'+amount+')'
            res.push(e)
        }
        return res
    }
}