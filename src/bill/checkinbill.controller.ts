import { Controller, Get, Post, Body, Put, Param, Delete, Res } from '@nestjs/common';
import {Bill} from './bill.entity';
import {CrudController} from '../infrastructure/nest-crud/crud.controller';
import {BillService} from './bill.service';
import { CheckinBill } from './checkinbill.entity';
import { CheckinBillService } from './checkinbill.service';

@Controller('bill/checkin')
export class CheckinBillController extends CrudController<CheckinBill>{
    constructor(private readonly service: CheckinBillService) {
        super(service);
    }

    @Post(':year/:month')
    public async generateByYearAndMonth(@Param('year') year: string,@Param('month') month: string,@Body() data:CheckinBill[]): Promise<any> {
        await this.service.deleteAll({year:year,month:month})
        let res =  await this.service.updateBatch(data);
        return res
    }

    @Get(':year/:month/sheet')
    public async generateSheetByYearAndMonth(@Param('year') year: string,@Param('month') month: string,@Res() resp): Promise<any> {
        let res =  await this.service.generateSheetByYearAndMonth(year,month);
        resp.contentType('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        resp.send(res)
    }

}

