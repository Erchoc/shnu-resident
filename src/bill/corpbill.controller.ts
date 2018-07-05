import { Controller, Get, Post, Body, Put, Param, Delete, Res } from '@nestjs/common';
import {CrudController} from '../infrastructure/nest-crud/crud.controller';
import { CorpBillService } from './corpbill.service';
import { CorpBill } from './corpbill.entity';

@Controller('bill/corp')
export class CorpBillController extends CrudController<CorpBill>{
    constructor(private readonly service: CorpBillService) {
        super(service);
    }

    @Post('season/:season/resident/:resident/gen')
    public async generateBySeasonAndResident(@Param('season') season: string, @Param('resident') resident: string, @Body() raw: CorpBill[]): Promise<CorpBill[]> {
        let res =  await this.service.generateBySeasonAndResident(parseInt(season),parseInt(resident),raw);
        return res
    }

    @Get('year/:year')
    public async generateSheetBySeasonAndResident(@Param('year') year: string): Promise<any> {
        let raw:CorpBill[] =  await this.service.getAll({year:parseInt(year)});
        let grouped = this.groupBy(raw, corpBill=>corpBill.season)
        let count = [{name:'第一季度',amount:0,subsidy:0,children:[]},{name:'第二季度',amount:0,subsidy:0,children:[]},{name:'第三季度',amount:0,subsidy:0,children:[]},{name:'第四季度',amount:0,subsidy:0,children:[]}]
        grouped.forEach((corpBills,season)=>{
            corpBills.map(corpBill=>{
                count[season-1].amount += Math.ceil(corpBill.amount)
                count[season-1].subsidy += Math.ceil(corpBill.subsidy)
                count[season-1].children.push(corpBill)
            })
        })
        return count
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

