
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingService } from './booking.service';
// import { PhotoController } from './photo.controller';
import { Booking } from './booking.entity';
import {BookingController} from './booking.controller';
import { RoomModule } from '../room/room.module';

@Module({
    imports: [TypeOrmModule.forFeature([Booking]),RoomModule],
    providers: [BookingService],
    controllers: [BookingController],
    exports: [BookingService],

})
export class BookingModule {}