
import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOperator } from 'typeorm';
import { Bill } from './bill.entity';
import {CrudTypeOrmService} from '../infrastructure/nest-crud/crud-typeorm.service';
import { MonthlyBill } from './monthlybill.entity';
import { BillService } from './bill.service';
import { join } from 'path'
import * as Excel from 'ejsexcel'
import * as fs from 'fs';
import * as util from 'util'
const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

@Injectable()
export class MonthlyBillService extends CrudTypeOrmService<MonthlyBill>{
    constructor(
        @InjectRepository(MonthlyBill)
        private readonly repo: Repository<MonthlyBill>,
        private readonly billService: BillService
    ) {
        super(repo);
    }


    public async generateSheetByYearAndMonthAndResident(year:string, month: string, resident:string) : Promise<MonthlyBill[]> {
        const excelBuf = await readFileAsync(join(__dirname,'../resources/monthlyBill.xlsx'))
        let data = await this.repo.find({where:{year:parseInt(year),month:parseInt(month),resident:new FindOperator('like','%'+resident+'%')}})
        let dataToRender:any[] = data.map(r=>{return {id:r.id+'', name:r.name,serial:r.serial,amount:r.amount}})
        dataToRender.push({id:'总计',amount:data.map(i=>i.amount).reduce((a,b)=>a+b)})
        let arrToRender = [[{booktitle:resident+'公寓（'+year+'年'+month+'月)'}],dataToRender]

        return await Excel.renderExcel(excelBuf, arrToRender);
        
    }

    public async generateByYearAndMonth(year:string, month: string) : Promise<MonthlyBill[]> {
        if (parseInt(month) !== ((new Date()).getMonth())+1) return null
        let findOption = {year:parseInt(year),month:parseInt(month)}
        await this.repo.delete(findOption)
        let bills : Bill[] = await this.billService.getAll({where:{...findOption},relations:['booking']})
        let res = await this.groupBillsAndGenMonthlyByTeacher(bills)
        return this.repo.save(res)
    }

    private async groupBillsAndGenMonthlyByTeacher(bills: Bill[]): Promise<MonthlyBill[]>{
        let res : MonthlyBill[] = []
        const groupedByTeacher = this.groupBy(bills, bill => bill.booking.teacher.serial)
        groupedByTeacher.forEach((bills,serial)=>{
            let mb = new MonthlyBill();
            mb.amount = 0; mb.diff = 0;
            bills.forEach(bill=>{
                if(bill.type === '正常') mb.amount += bill.amount
                else mb.diff += bill.amount
                mb.name = bill.booking.teacher.name
                mb.institute = bill.booking.teacher.institute
                mb.month = bill.month
                mb.year = bill.year
                mb.serial = serial
                mb.resident = bill.booking.room.resident.name + bill.booking.room.block+'栋'+bill.booking.room.room+'室'
            })
            res.push(mb)
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