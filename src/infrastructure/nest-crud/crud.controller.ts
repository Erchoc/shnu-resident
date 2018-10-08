import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    Query
} from '@nestjs/common';
import { CrudService } from './crud-service.interface';

export class CrudController<T> {
    constructor(private readonly crudService: CrudService<T>) { }

    @Post()
    public async create(@Body() entity: T): Promise<T> {
        return await this.crudService.create(entity);
    }

    @Post('batch')
    public async updateBatch(@Body() entity: T[]): Promise<T> {
        return await this.crudService.updateBatch(entity);
    }

    @Delete('batch')
    public async deleteBatch(@Body() entity: T[]) {
        return await this.crudService.deleteBatch(entity);
    }

    @Get('query')
    public async query(@Query() q:any): Promise<any> {
        for(let key in q){
            if(key.indexOf('_at')>-1){
                q[key] = new Date(q[key])
            }
        }
        let res = await this.crudService.query(q);
        let currPage = ~~(q.skip / q.take)+1
        let maxPage = Math.ceil(res[1] / q.take)
        return {total:res[1],result:res[0],currPage:currPage,maxPage:maxPage}
    }

    @Get(':id')
    public async getOne(@Param('id') id: number): Promise<T> {
        return await this.crudService.getOne(id);
    }

    @Get()
    public async getAll(@Query() q:any): Promise<T[]> {
        return await this.crudService.getAll(q);
    }

    @Put(':id')
    public async update(@Param('id') id: number, @Body() entity: T): Promise<T> {
        return await this.crudService.update(id, entity);
    }

    @Delete(':id')
    public async delete(@Param('id') id: number) {
        return await this.crudService.delete(id);
    }
}