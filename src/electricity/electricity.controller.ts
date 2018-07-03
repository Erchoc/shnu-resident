import { Controller, Get, Post, Body, Put, Param, Res, Delete, UseInterceptors, FileInterceptor, UploadedFile } from '@nestjs/common';
import {Electricity} from './electricity.entity';
import {CrudController} from '../infrastructure/nest-crud/crud.controller';
import {ElectricityService} from './electricity.service';
import * as Excel from 'ejsexcel'
import * as fs from 'fs';
import * as util from 'util'
import { ElectricityRaw } from './electricityraw.dto';
const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

@Controller('electricity')
export class ElectricityController extends CrudController<Electricity>{
    constructor(private readonly service: ElectricityService) {
        super(service);
    }

    @Post('season/:season/gen')
    public async generate(@Param('season') season:string, @Body() raw: any[]): Promise<ElectricityRaw[]> {
        let data = []
        for(let region in raw){
            raw[region].data.map(element => {
                data.push({...element,region:raw[region].region})
            });
        }
        let res = await this.service.generate(parseInt(season),data)
        return res
    } 
    
    @Get('season/:year/:season/resident/:resident/sheet')
    public async generateSheetByYearAndSeason(@Param('year') year: string,@Param('season') season: string,@Param('resident') resident: string,@Res() resp): Promise<any> {
        let res =  await this.service.generateSheetByYearAndSeasonAndResident(year,season,resident);
        resp.contentType('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        resp.send(res)
    }


}