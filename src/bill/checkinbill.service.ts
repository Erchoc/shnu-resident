
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
import { CheckinBill } from './checkinbill.entity';
const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

@Injectable()
export class CheckinBillService extends CrudTypeOrmService<CheckinBill>{
    constructor(
        @InjectRepository(CheckinBill)
        private readonly repo: Repository<CheckinBill>,
        private readonly billService: BillService
    ) {
        super(repo);
    }


    public async generateSheetByYearAndMonth(year:string, month: string) : Promise<MonthlyBill[]> {
        let today = (new Date()).toISOString().split("T")[0]
        const excelBuf = await readFileAsync(join(__dirname,'../resources/check.xlsx'))
        let data = await this.repo.find({where:{year:parseInt(year),month:parseInt(month)}})
        let dataToRender:any[] = data.map(r=>{return {...r,id:r.id+'',comment:r.comment ? r.comment : ''}})
        let total = data.map(i=>i.amount).reduce((a,b)=>a+b)
        let footertext = '说明：1、有效刷卡时间为当日20:30--次日早上7点。2、以信息办提供刷卡记录为准。3、每日刷卡有效次数为一次,'+month+'月份按'+data[0].checkbase+'次计算））。4、扣费方式参考学校资产处网站【上海师范大学奉贤校区教职工住宿管理办法】。5、如有疑问请与资产处陆老师查询核对。办公室：徐汇行政楼608，电话：64323153'
        let arrToRender = [[{booktitle:year+'年'+month+'月份奉贤教工楼教师入住刷卡收费情况',total:total,footer:today,footertext:footertext}],dataToRender]
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
        const groupedByTeacher = this.groupBy(bills, bill => bill.booking.teacher.serial+bill.booking.room.resident.name)
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