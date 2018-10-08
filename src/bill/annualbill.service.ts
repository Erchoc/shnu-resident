
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
import * as moment from 'moment'
import { ConstsService } from '../consts/consts.service';
const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);
import { ResidentService } from '../resident/resident.service';

@Injectable()
export class AnnualBillService extends CrudTypeOrmService<AnnualBill>{
    constructor(
        @InjectRepository(AnnualBill)
        private readonly repo: Repository<AnnualBill>,
        private readonly billService: BillService,
        private readonly constService: ConstsService,
        private readonly residentService: ResidentService

    ) {
        super(repo);
    }


    public async generateSheetByResident(resident:String,data:AnnualBill[]) : Promise<AnnualBill[]> {
        
        const excelBuf = await readFileAsync(join(__dirname,'../resources/AnnualBill.xlsx'))
        let dataToRender:any[] = data.map(i=>{return {...i,
            id:i.id+'',
            startend1:this.getDateRangeString(i.start1,i.end1),
            startend2:this.getDateRangeString(i.start2,i.end2),
            checkinout:this.getDateRangeString(i.checkin,i.checkout)
        }})
        dataToRender.push({id:'总计',amount:dataToRender.map(i=>i.amount).reduce((a,b)=>a+b),subsidy:dataToRender.map(i=>i.subsidy).reduce((a,b)=>a+b)})
        let arrToRender = [[{booktitle:resident}],dataToRender]

        return await Excel.renderExcel(excelBuf, arrToRender);
        
    }

    private getDateRangeString(start1,end1){
        start1 = start1 == null ? "":start1;
        end1 = end1 == null ? "":end1;
        if(!start1 && !end1){
            return ""
        }
        return start1+'~'+end1
    }

    // public async generateSheetByFromAndToAndResident(from:string, to:string, resident:string) : Promise<AnnualBill[]> {
    //     const excelBuf = await readFileAsync(join(__dirname,'../resources/AnnualBill.xlsx'))
    //     let fromMoment = moment(from)
    //     let toMoment = moment(to)

    //     let data = await this.repo.find({where:{year:new FindOperator('like','%'+resident+'%'),resident:new FindOperator('like','%'+resident+'%')}})
    //     let dataToRender:any[] = data.map(i=>{return {...i,
    //         id:i.id+'',
    //         startend1:i.start1+'~'+i.end1,
    //         startend2:i.start2+'~'+i.end2,
    //         checkinout:i.checkin+'~'+i.checkout
    //     }})
    //     dataToRender.push({id:'总计',amount:dataToRender.map(i=>i.amount).reduce((a,b)=>a+b),subsidy:dataToRender.map(i=>i.subsidy).reduce((a,b)=>a+b)})
    //     let arrToRender = [[{booktitle:resident+'公寓（'+year+'年)'}],dataToRender]

    //     return await Excel.renderExcel(excelBuf, arrToRender);
        
    // }

    public async generate(from:string,to:string) : Promise<AnnualBill[]> {
        let residents = await this.residentService.getAll({});
        let bills : Bill[] = []
        for (let resident of residents){
            let b = await this.billService.findInRange(from,to,resident.id)
            b = b.map(i=>i.deductAmountByActualDate(from,to))
            bills=bills.concat(b)
        }
        // bills = bills.filter(b=>b.booking.room.resident.name.indexOf(resident) >= 0)
        let res = await this.groupBillsAndGenSeasonByTeacher(bills,from,to)
        return this.repo.save(res)
    }

    private async groupBillsAndGenSeasonByTeacher(bills: Bill[],from: string, to: string): Promise<AnnualBill[]>{
        let fromDate = moment(from)
        let toDate = moment(to)

        let now = new Date()
        let res : AnnualBill[] = []
        let subsidyRate = await this.constService.getAll({field:'rate'})
        let realSubsidyRate = subsidyRate && subsidyRate[0] ? parseInt(subsidyRate[0].value) /100 : 0.5
        bills = bills.filter(b => b.booking!=null && b.booking.teacher!=null)
        const groupedByTeacher = this.groupBy(bills, bill => bill.booking.teacher.serial+bill.booking.room.resident.name)
        groupedByTeacher.forEach((bills : Bill[],serial: string)=>{
            let ab = new AnnualBill();
            ab.generated_at = now
            let monthStats = {1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0,9:0,10:0,11:0,12:0}
            let bookingStats = {}
            let bookingKeyLists = []
            let subsidyDisabled = false
            ab.amount = 0; ab.month12 = '';
            bills.forEach((bill:Bill)=>{
                monthStats[bill.month] += (bill.amount)
                bookingStats[bill.booking.checkin.getTime()+''] = bill.booking
                if(bookingKeyLists.length < 1 || bookingKeyLists[bookingKeyLists.length-1] !== bill.booking.checkin.getTime()){
                    bookingKeyLists.push(bill.booking.checkin.getTime())
                }
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
                }else{
                    subsidyDisabled = true
                }
                ab.name = bill.booking.teacher.name
                ab.institute = bill.booking.teacher.institute
                ab.contact = bill.booking.teacher.contact
                ab.year = bill.year
                ab.serial = bill.booking.teacher.serial
                ab.resident = bill.booking.room.resident.name + bill.booking.room.block+'栋'+bill.booking.room.room+'室'
            })
            for(let i = 1; i < 13; i++){
                ab.amount+=monthStats[i]
                ab.month12+=(monthStats[i]+',')
            }
            ab.month12 = ab.month12.slice(0, -1);
            let realCheckout = moment(ab.checkout) > toDate ? toDate : moment(ab.checkout)
            let realCheckIn = moment(ab.checkin) < fromDate ? fromDate : moment(ab.checkin)

            let daysDiff = moment(realCheckout).diff(moment(realCheckIn),'days')
            ab.subsidy = subsidyDisabled ? 0 : Math.ceil(ab.amount * realSubsidyRate * (daysDiff / toDate.diff(fromDate,'days')))
            ab.comment = subsidyDisabled ? '补贴计算调试信息：有异常情况':'补贴计算调试信息：'+ab.amount+'*'+realSubsidyRate+'*('+daysDiff+' / '+toDate.diff(fromDate,'days')+')'+',其中实际结算的日期为'+realCheckIn.format('YYYY-MM-DD')+'至'+realCheckout.format('YYYY-MM-DD')
            let b1,b2;
            if(bookingKeyLists.length > 1){
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
            }else{
                b1 = bookingStats[bookingKeyLists[0]]
                ab.amount1 = b1.rent
                ab.start1 = b1.start
                ab.end1 = b1.end
                ab.amount2 = 0
                ab.start2 = null
                ab.end2 = null
            }
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


    public async findCreatedAts(){
        let dates = await this.repo.createQueryBuilder("annualBill")
        .select("distinct generated_at")
        .addGroupBy("generated_at desc")
        .getRawMany();

        return dates.map(i=>i.generated_at)

    }

}