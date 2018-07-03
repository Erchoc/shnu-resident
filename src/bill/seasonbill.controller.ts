import { Controller, Get, Post, Body, Put, Param, Delete, Res } from '@nestjs/common';
import {Bill} from './bill.entity';
import {CrudController} from '../infrastructure/nest-crud/crud.controller';
import {BillService} from './bill.service';
import { SeasonBill } from './seasonbill.entity';
import { SeasonBillService } from './seasonbill.service';

@Controller('bill/season')
export class SeasonBillController extends CrudController<SeasonBill>{
    constructor(private readonly service: SeasonBillService) {
        super(service);
    }

    @Get(':year/:season/gen')
    public async generateByYearAndSeason(@Param('year') year: string,@Param('season') season: string): Promise<boolean> {
        let res =  await this.service.generateByYearAndSeason(year,season);
        return !!res
    }

    @Get(':year/:season/resident/:resident/sheet')
    public async generateSheetByYearAndSeason(@Param('year') year: string,@Param('season') season: string,@Param('resident') resident: string,@Res() resp): Promise<any> {
        let res =  await this.service.generateSheetByYearAndSeasonAndResident(year,season,resident);
        resp.contentType('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        resp.send(res)
    }

}

