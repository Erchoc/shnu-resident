
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomService } from './room.service';
// import { PhotoController } from './photo.controller';
import { Room } from './room.entity';
import {RoomController} from "./room.controller";

@Module({
    imports: [TypeOrmModule.forFeature([Room])],
    providers: [RoomService],
    controllers: [RoomController],
    exports: [RoomService],

})
export class RoomModule {}