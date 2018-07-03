
import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOperator } from 'typeorm';
import { Bill } from './bill.entity';
import {CrudTypeOrmService} from '../infrastructure/nest-crud/crud-typeorm.service';
import { AnnualBill } from './annualbill.entity';
import { BillService } from './bill.service';
import { join } from 'path'
import * as Excel from 'ejsexcel'
import * as fs from 'fs';
import * as util from 'util'
const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

@Injectable()
export class AnnualBillService extends CrudTypeOrmService<AnnualBill>{
    constructor(
        @InjectRepository(AnnualBill)
        private readonly repo: Repository<AnnualBill>,
        private readonly billService: BillService
    ) {
        super(repo);
    }


    public async generateSheetByResident(year:string, resident:string) : Promise<AnnualBill[]> {
        const excelBuf = await readFileAsync(join(__dirname,'../resources/AnnualBill.xlsx'))
        let data = await this.repo.find({where:{year:parseInt(year),resident:new FindOperator('like','%'+resident+'%')}})
        let dataToRender:any[] = data.map(i=>{return {...i,
            id:i.id+'',
            startend1:i.start1+'~'+i.end1,
            startend2:i.start2+'~'+i.end2,
            checkinout:i.checkin+'~'+i.checkout
        }})
        dataToRender.push({id:'总计',amount:dataToRender.map(i=>i.amount).reduce((a,b)=>a+b),subsidy:dataToRender.map(i=>i.subsidy).reduce((a,b)=>a+b)})
        let arrToRender = [[{booktitle:resident+'公寓（'+year+'年)'}],dataToRender]

        return await Excel.renderExcel(excelBuf, arrToRender);
        
    }

    public async generate(year:string) : Promise<AnnualBill[]> {
        let currentYear = (new Date()).getFullYear()
        if (currentYear !== parseInt(year)) return null // 非本季
        // [monthBase,monthBase+1,monthBase+2]
        
        let findOption = {year:parseInt(year)}
        await this.repo.delete(findOption)
        let bills : Bill[] = await this.billService.getAll({where:findOption,relations:['booking']})
        let res = await this.groupBillsAndGenSeasonByTeacher(bills)
        return this.repo.save(res)
    }

    private async groupBillsAndGenSeasonByTeacher(bills: Bill[]): Promise<AnnualBill[]>{
        let res : AnnualBill[] = []
        const groupedByTeacher = this.groupBy(bills, bill => bill.booking.teacher.serial)
        groupedByTeacher.forEach((bills : Bill[],serial: string)=>{
            let ab = new AnnualBill();
            let monthStats = {1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0,9:0,10:0,11:0,12:0}
            let bookingStats = {}
            let bookingKeyLists = []
            ab.amount = 0; ab.month12 = '';
            bills.forEach((bill:Bill)=>{
                monthStats[bill.month] += (bill.amount)
                bookingStats[bill.booking.checkin.getTime()+''] = bill.booking
                bookingKeyLists.push(bill.booking.checkin.getTime())
                if(bill.type === '正常'){
                    let earlierDate = bill.booking.start > bill.booking.checkin ? bill.booking.checkin : bill.booking.start
                    if(ab.checkin){
                        ab.checkin = ab.checkin > earlierDate ? earlierDate : ab.checkin 
                    }else{
                        ab.checkin = earlierDate
                    }

                    let laterDate = bill.booking.end > bill.booking.checkout ? bill.booking.end : bill.booking.checkout
                    if(ab.checkout){
                         ab.checkout = ab.checkout > laterDate ? ab.checkout : laterDate
                    }else{
                         ab.checkout = laterDate
                    }
                }
                ab.name = bill.booking.teacher.name
                ab.institute = bill.booking.teacher.institute
                ab.contact = bill.booking.teacher.contact
                ab.year = bill.year
                ab.serial = serial
                ab.resident = bill.booking.room.resident.name + bill.booking.room.block+'栋'+bill.booking.room.room+'室'
            })
            for(let i = 1; i < 13; i++){
                ab.amount+=monthStats[i]
                ab.month12+=(monthStats[i]+',')
            }
            ab.month12 = ab.month12.slice(0, -1);
            ab.subsidy = ab.amount / 2
            let b1,b2;
            if(bookingKeyLists[0] < bookingKeyLists[1]){
                b1 = bookingStats[bookingKeyLists[0]]
                b2 = bookingStats[bookingKeyLists[1]]
            }else{
                b1 = bookingStats[bookingKeyLists[1]]
                b2 = bookingStats[bookingKeyLists[0]]    
            }
            ab.amount1 = b1.rent
            ab.start1 = b1.start
            ab.end1 = b1.end
            ab.amount2 = b2.rent
            ab.start2 = b2.start
            ab.end2 = b2.end
            res.push(ab)
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