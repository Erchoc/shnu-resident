import { Controller, Get, Post, Body, Put, Param, Delete, Res } from '@nestjs/common';
import {Bill} from './bill.entity';
import {CrudController} from '../infrastructure/nest-crud/crud.controller';
import {BillService} from './bill.service';
import { AnnualBill } from './annualbill.entity';
import { AnnualBillService } from './annualbill.service';

@Controller('bill/annual')
export class AnnualBillController extends CrudController<AnnualBill>{
    constructor(private readonly service: AnnualBillService) {
        super(service);
    }

    @Get(':year/gen')
    public async generate(@Param('year') year: string): Promise<boolean> {
        let res =  await this.service.generate(year);
        return !!res
    }

    @Get(':year/resident/:resident/sheet')
    public async generateSheetByResident(@Param('year') year: string,@Param('resident') resident: string,@Res() resp): Promise<any> {
        let res =  await this.service.generateSheetByResident(year,resident);
        resp.contentType('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        resp.send(res)
    }

}

