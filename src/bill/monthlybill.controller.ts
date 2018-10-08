import { Controller, Get, Post, Body, Put, Param, Delete, Res } from '@nestjs/common';
import {Bill} from './bill.entity';
import {CrudController} from '../infrastructure/nest-crud/crud.controller';
import {BillService} from './bill.service';
import { MonthlyBill } from './monthlybill.entity';
import { MonthlyBillService } from './monthlybill.service';

@Controller('bill/monthly')
export class MonthlyBillController extends CrudController<MonthlyBill>{
    constructor(private readonly service: MonthlyBillService) {
        super(service);
    }

    @Post('/gen')
    public async generate(@Body() range): Promise<any> {
        let [from,to]=range.range
        if(!from || !to) return []
        let res:MonthlyBill[] =  await this.service.generateByYearAndMonth(from,to)
        // let times = await this.service.findCreatedAts()
        // return times.length ? times[0] : null
        return !!res
    }


    @Post('/peek')
    public async peek(@Body() range): Promise<any> {
        let [from,to]=range.range
        if(!from || !to) return []
        let res:MonthlyBill[] =  await this.service.peekByYearAndMonth(from,to)
        // let times = await this.service.findCreatedAts()
        // return times.length ? times[0] : null
        return res
    }

    @Get(':year/:month/sheet')
    public async generateByYearAndMonth(@Param('year') year: string,@Param('month') month: string, @Res() resp): Promise<any> {
        let res =  await this.service.generateXLSXByYearAndMonth(year,month,resp);
        resp.end()
        // return !!res
    }

    @Get(':year/:month/resident/:resident/sheet')
    public async generateSheetByYearAndMonth(@Param('year') year: string,@Param('month') month: string,@Param('resident') resident: string,@Res() resp): Promise<any> {
        let res =  await this.service.generateSheetByYearAndMonthAndResident(year,month,resident);
        resp.contentType('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        resp.send(res)
    }

}

