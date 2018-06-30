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

    @Get()
    public async query(@Query() q:any): Promise<T[]> {
        return await this.crudService.query(q);
    }

    @Get(':id')
    public async getOne(@Param('id') id: number): Promise<T> {
        return await this.crudService.getOne(id);
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