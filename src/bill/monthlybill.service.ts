
import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOperator } from 'typeorm';
import { Bill } from './bill.entity';
import {CrudTypeOrmService} from '../infrastructure/nest-crud/crud-typeorm.service';
import { MonthlyBill } from './monthlybill.entity';
import { BillService } from './bill.service';
import { join } from 'path'
// import * as Excel from '../lib/ejsexcelplus'
import { renderExcel } from '../../lib/ejsexcelplus'
// import { renderExcel } from 'ejsexcelplus'
import * as XLSX from 'exceljs'
const stream = require('stream');

// const Excel = require('../lib/ejsexcel')
import * as fs from 'fs';
import * as util from 'util'
import { ResidentService } from '../resident/resident.service';
const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);
import * as moment from 'moment'
import { BookingService } from '../booking/booking.service';
import { ConstsService } from '../consts/consts.service';

@Injectable()
export class MonthlyBillService extends CrudTypeOrmService<MonthlyBill>{
    constructor(
        @InjectRepository(MonthlyBill)
        private readonly repo: Repository<MonthlyBill>,
        private readonly billService: BillService,
        private readonly residentService: ResidentService,
        private readonly bookingService: BookingService,
        private readonly constsService: ConstsService

    ) {
        super(repo);
    }


    public async generateSheetByYearAndMonthAndResidentCustomedData(year:string, month: string, resident:string, data:any) : Promise<MonthlyBill[]> {
        const excelBuf = await readFileAsync(join(__dirname,'../resources/monthlyBill.xlsx'))
    
        let id = 0
        let dataToRender:any[] = data.map(r=>{
            id+=1
            if(r.amount_differed){
                return {id:id+'**RED**', name:r.name+'**RED**',serial:r.serial+'**RED**',amount:r.amount+'**RED**'}
            }else{
                return {id:id+'', name:r.name,serial:r.serial,amount:r.amount}
            }
        })
        dataToRender.push({id:'总计',amount:data.map(i=>i.amount).reduce((a,b)=>a+b)})
        let arrToRender = [[{booktitle:resident+'（'+year+'年'+month+'月)'}],dataToRender]

        return await renderExcel(excelBuf, arrToRender);
        
    }

    public async generateSheetByYearAndMonthAndResident(year:string, month: string, resident:string) : Promise<MonthlyBill[]> {
        const excelBuf = await readFileAsync(join(__dirname,'../resources/monthlyBill.xlsx'))
        let realResidents = await this.residentService.getAll({name:new FindOperator('like','%'+resident+'%')})
        let realResident = realResidents[0]
        if(!realResident) return await renderExcel(excelBuf, [[{booktitle:resident+'（'+year+'年'+month+'月)'}],[]]); 
        let realMonth = parseInt(month) + realResident.monthdiff
        let data = await this.repo.find({where:{year:parseInt(year),month:parseInt(month),resident:new FindOperator('like','%'+realResident.name+'%')}})
        if(data.length < 1) return await renderExcel(excelBuf, [[{booktitle:realResident.name+'（'+year+'年'+month+'月)'}],[]]); 
        let id = 0
        let dataToRender:any[] = data.map(r=>{
            id+=1
            if(r.amount_differed){
                return {id:id+'**RED**', name:r.name+'**RED**',serial:r.serial+'**RED**',amount:r.amount+'**RED**'}
            }else{
                return {id:id+'', name:r.name,serial:r.serial,amount:r.amount}
            }
        })
        dataToRender.push({id:'总计',amount:data.map(i=>i.amount).reduce((a,b)=>a+b)})
        let arrToRender = [[{booktitle:resident+'（'+year+'年'+month+'月)'}],dataToRender]

        return await renderExcel(excelBuf, arrToRender);
        
    }

    public async generateByYearAndMonth(from:string, to: string) : Promise<MonthlyBill[]> {
        // if (parseInt(month) !== ((new Date()).getMonth())+1) return null
        let fromM = moment(from)
        let toM = moment(to)
        let findOption = {where:{end:new FindOperator('moreThan',fromM.format('YYYY-MM-DD')),start:new FindOperator('lessThan',toM.format('YYYY-MM-DD'))}}
        let bookings = await this.bookingService.getAll(findOption)
        let bills: Bill[]  = []
        for(let booking of bookings){
            let newBill:Bill[] = booking.bill
            newBill = newBill.map(i=>{i.booking = booking;return i;})
            bills = bills.concat(newBill)
        }
        await this.repo.delete({month:fromM.month()+1,year:fromM.year()})
        let res = await this.groupBillsAndGenMonthlyByTeacher(bills,fromM,toM)
        return this.repo.save(res)
    }

    public async peekByYearAndMonth(from:string, to: string) : Promise<MonthlyBill[]> {
        // if (parseInt(month) !== ((new Date()).getMonth())+1) return null
        let fromM = moment(from)
        let toM = moment(to)
        let findOption = {where:{end:new FindOperator('moreThan',fromM.format('YYYY-MM-DD')),start:new FindOperator('lessThan',toM.format('YYYY-MM-DD'))}}
        let bookings = await this.bookingService.getAll(findOption)
        let bills: Bill[]  = []
        for(let booking of bookings){
            let newBill:Bill[] = booking.bill
            newBill = newBill.map(i=>{i.booking = booking;return i;})
            bills = bills.concat(newBill)
        }
        let res = await this.groupBillsAndGenMonthlyByTeacher(bills,fromM,toM)
        return res
    }


    public async generateXLSXByYearAndMonth(year:string, month: string, res:any) : Promise<any> {

        let wbGeneral = new XLSX.Workbook();

        let allResidents = await this.residentService.getAll({})
        for(let i in allResidents){
            let j = allResidents[i]
            let wbSub = new XLSX.Workbook();        
            let data = await this.repo.find({where:{year:parseInt(year),month:parseInt(month),resident:new FindOperator('like','%'+j.name+'%')}})
            if(!data || !data.length){
                continue;
            }
            let sub = await this.generateSheetByYearAndMonthAndResidentCustomedData(year,month,j.name,data)
            var bufferStream = new stream.PassThrough();

            bufferStream.end(new Buffer(sub));
            let workbook = await wbSub.xlsx.read(bufferStream)
            let wsSub =workbook.getWorksheet(1);
            let wsGen = wbGeneral.addWorksheet(j.name,{pageSetup:wsSub.pageSetup,views:wsSub.views,properties:wsSub.properties})
            wsGen.model = wsSub.model
            wsGen.name = j.name
            for(let masterName in wsSub._merges){
                let dimensions =  wsSub._merges[masterName].model
                let master = wsGen.getCell(dimensions.top, dimensions.left);
                for (let i = dimensions.top; i <= dimensions.bottom; i++) {
                    for (let j = dimensions.left; j <= dimensions.right; j++) {
                        if ((i > dimensions.top) || (j > dimensions.left)) {
                            wsGen.getCell(i, j).merge(master);
                        }
                    }
                }
            }
        


        }
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=Report.xlsx');

        return await wbGeneral.xlsx.write(res)
        
    }

    private async groupBillsAndGenMonthlyByTeacher(bills: Bill[],from: moment.Moment,to: moment.Moment): Promise<MonthlyBill[]>{
        let res : MonthlyBill[] = []
        bills = bills.filter(b => b.booking!=null && b.booking.teacher!=null)
        let failed = bills.filter(b => b.booking==null || b.booking.teacher==null)
        console.log(failed)
        let grouped = await this.groupBy(bills, bill => this.genBillKey(bill))
        for (let [key,bills] of grouped.entries()){
            let mb = await this.multipleBillsToSingleMonthlyBill(bills,from,to)
            res.push(mb)
        }
        return res
    }

    private genBillKey(bill: Bill):String{
        return bill.booking.teacher.serial +  bill.booking.teacher.name +
        bill.booking.room.resident.name
    }

    private getBillTime(bill: Bill):moment.Moment{
        return moment().year(bill.year).month(bill.month-1).startOf('month')
    }

    private billTimeAvailable(bill: Bill, from:moment.Moment, to:moment.Moment):boolean{
        let startMonth = from.startOf('month')
        let endMonth = to.endOf('month')
        let billTime = this.getBillTime(bill);
        let isBetween = billTime.isSameOrAfter(startMonth) && billTime.isSameOrBefore(endMonth)
        return isBetween
    }
    
    private async multipleBillsToSingleMonthlyBill(bills: Bill[],from:moment.Moment,to: moment.Moment){
        let mb = new MonthlyBill();
        mb.amount = 0; mb.diff = 0;
        let subsidy = await this.constsService.getSubsidy()

        bills
        .filter(i=>this.billTimeAvailable(i,from,to))
        .forEach(bill=>{
            if(bill.type === '正常') mb.amount += bill.amount
            else mb.diff += bill.amount
        })
        let bill = bills[0]
        if(!bill) return 
        mb.name = bill.booking.teacher.name
        mb.institute = bill.booking.teacher.institute
        mb.serial = bill.booking.teacher.serial
        mb.month = from.month()+1
        mb.year = from.year()
        mb.resident = bill.booking.room.resident.name + 
                      bill.booking.room.block+'栋'+
                      bill.booking.room.room+'室'
        mb.room = parseInt(bill.booking.room.room) ? parseInt(bill.booking.room.room) : null
        mb.block = parseInt(bill.booking.room.block) ? parseInt(bill.booking.room.block) : null
        mb.res_name = bill.booking.room.resident.name

        mb.amount_differed = await this.isAmountDifferedFromPreviousMonth(mb)
        mb.subsidy = subsidy
        return mb
    }

    private async isAmountDifferedFromPreviousMonth(mb:MonthlyBill) : Promise<boolean>{
        let previousOptions = JSON.parse(JSON.stringify(mb))
        delete previousOptions.amount
        delete previousOptions.diff
        delete previousOptions.id
        delete previousOptions.comment
        if(previousOptions.month === 1){
            previousOptions.year -=1;previousOptions.month = 12;
        }else{
            previousOptions.month -=1
        }

        let previousBills = await this.getAll(previousOptions)
        if(previousBills.length < 1) {
            return false
        }
        else{
            let previousBill = previousBills[0]
            return previousBill.amount !== mb.amount
        }
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