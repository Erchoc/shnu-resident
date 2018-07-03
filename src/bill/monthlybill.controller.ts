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

    @Get(':year/:month/gen')
    public async generateByYearAndMonth(@Param('year') year: string,@Param('month') month: string): Promise<boolean> {
        let res =  await this.service.generateByYearAndMonth(year,month);
        return !!res
    }

    @Get(':year/:month/resident/:resident/sheet')
    public async generateSheetByYearAndMonth(@Param('year') year: string,@Param('month') month: string,@Param('resident') resident: string,@Res() resp): Promise<any> {
        let res =  await this.service.generateSheetByYearAndMonthAndResident(year,month,resident);
        resp.contentType('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        resp.send(res)
    }

}

