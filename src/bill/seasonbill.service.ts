
import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOperator } from 'typeorm';
import { Bill } from './bill.entity';
import {CrudTypeOrmService} from '../infrastructure/nest-crud/crud-typeorm.service';
import { SeasonBill } from './seasonbill.entity';
import { BillService } from './bill.service';
import { join } from 'path'
import * as Excel from 'ejsexcel'
import * as fs from 'fs';
import * as util from 'util'
const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

@Injectable()
export class SeasonBillService extends CrudTypeOrmService<SeasonBill>{
    constructor(
        @InjectRepository(SeasonBill)
        private readonly repo: Repository<SeasonBill>,
        private readonly billService: BillService
    ) {
        super(repo);
    }


    public async generateSheetByYearAndSeasonAndResident(year:string, season: string, resident:string) : Promise<SeasonBill[]> {
        const excelBuf = await readFileAsync(join(__dirname,'../resources/SeasonBill.xlsx'))
        let data = await this.repo.find({where:{year:parseInt(year),season:parseInt(season),resident:new FindOperator('like','%'+resident+'%')}})
        let dataToRender:any[] = data.map(r=>{return {id:r.id+'', resident:r.resident,contact:r.contact,start:r.start,end:r.end,institute:r.institute,name:r.name,serial:r.serial,amount:r.month1+r.month2+r.month3,month1:r.month1,month2:r.month2,month3:r.month3}})
        dataToRender.push({id:'总计',amount:dataToRender.map(i=>i.amount).reduce((a,b)=>a+b),month1:dataToRender.map(i=>i.month1).reduce((a,b)=>a+b),month2:dataToRender.map(i=>i.month2).reduce((a,b)=>a+b),month3:dataToRender.map(i=>i.month3).reduce((a,b)=>a+b)})
        let arrToRender = [[{booktitle:resident+'公寓（'+year+'年第'+season+'季度)'}],dataToRender]

        return await Excel.renderExcel(excelBuf, arrToRender);
        
    }

    public async generateByYearAndSeason(year:string, season: string) : Promise<SeasonBill[]> {
        let monthBase = (parseInt(season) - 1) * 3 + 1
        let currentMonth = ((new Date()).getMonth())+1
        if (currentMonth < monthBase || currentMonth > monthBase+2) return null // 非本季
        // [monthBase,monthBase+1,monthBase+2]
        
        let findOption = {where:{year:parseInt(year),month:new FindOperator('in',[monthBase,monthBase+1,monthBase+2])}}
        await this.repo.delete({year:parseInt(year),season:parseInt(season)})
        let bills : Bill[] = await this.billService.getAll({...findOption,relations:['booking']})
        let res = await this.groupBillsAndGenSeasonByTeacher(bills,parseInt(season))
        return this.repo.save(res)
    }

    private async groupBillsAndGenSeasonByTeacher(bills: Bill[],season:number): Promise<SeasonBill[]>{
        let res : SeasonBill[] = []
        let monthBase = (season - 1) * 3 + 1
        const groupedByTeacher = this.groupBy(bills, bill => bill.booking.teacher.serial)
        groupedByTeacher.forEach((bills : Bill[],serial: string)=>{
            let sb = new SeasonBill();
            sb.month1 = 0; sb.month2 = 0; sb.month3 = 0;
            bills.forEach((bill:Bill)=>{
                if(bill.month === monthBase){
                    sb.month1+=bill.amount
                    if(bill.type === '正常'){
                        let earlierDate = bill.booking.start > bill.booking.checkin ? bill.booking.checkin : bill.booking.start
                        if(sb.start){
                            sb.start = sb.start > earlierDate ? earlierDate : sb.start 
                        }else{
                            sb.start = earlierDate
                        }
                    }
                }else if(bill.month === monthBase + 1){
                    sb.month2+=bill.amount
                }else{
                    sb.month3+=bill.amount
                    if(bill.type === '正常'){
                        let laterDate = bill.booking.end > bill.booking.checkout ? bill.booking.end : bill.booking.checkout
                        if(sb.end){
                            sb.end = sb.end > laterDate ? sb.end : laterDate
                        }else{
                            sb.end = laterDate
                        }
                    }
                }
                sb.name = bill.booking.teacher.name
                sb.institute = bill.booking.teacher.institute
                sb.contact = bill.booking.teacher.contact
                sb.season = season
                sb.year = bill.year
                sb.serial = serial
                sb.resident = bill.booking.room.resident.name + bill.booking.room.block+'栋'+bill.booking.room.room+'室'
            })
            res.push(sb)
        })
        return res
    }


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