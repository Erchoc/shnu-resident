import { Controller, Get, Post, Body, Put, Param, Delete, Res } from '@nestjs/common';
import {Bill} from './bill.entity';
import {CrudController} from '../infrastructure/nest-crud/crud.controller';
import {BillService} from './bill.service';
import { AnnualBill } from './annualbill.entity';
import { AnnualBillService } from './annualbill.service';
import * as moment from 'moment'

@Controller('bill/annual')
export class AnnualBillController extends CrudController<AnnualBill>{
    constructor(private readonly service: AnnualBillService) {
        super(service);
    }

    @Post('/gen')
    public async generate(@Body() range): Promise<any> {
        let [from,to]=range.range
        if(!from || !to) return []
        let res:AnnualBill[] =  await this.service.generate(from,to);
        let times = await this.service.findCreatedAts()
        return times.length ? times[0] : null
    }


    @Get('/times')
    public async times(): Promise<any> {
        return this.service.findCreatedAts()
    }

    @Post('/sheet')
    public async generateSheetByResident(@Body() range: any,@Res() resp): Promise<any> {
        range.take = 1000000;
        let resident = range.resident.replace("*","").replace("*","")
        let data =  await this.query(range);
        let res =  await this.service.generateSheetByResident(resident,data.result);
        resp.contentType('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        resp.send(res)
    }

    // @Get('resident/:resident/from/:from/to/:to/sheet')
    // public async generateSheetByYearAndMonth(@Param('from') from: string,@Param('to') to: string ,@Param('resident') resident: string,@Res() resp): Promise<any> {

    //     let res =  await this.service.generateSheetByFromAndToAndResident(from,to,resident);
    //     resp.contentType('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    //     resp.send(res)
    // }


}

