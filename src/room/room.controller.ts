import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import {Room} from './room.entity';
import {CrudController} from '../infrastructure/nest-crud/crud.controller';
import {RoomService} from './room.service';

@Controller('room')
export class RoomController extends CrudController<Room>{
    constructor(private readonly service: RoomService) {
        super(service);
    }
}