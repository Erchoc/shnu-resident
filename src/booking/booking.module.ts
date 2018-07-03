
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingService } from './booking.service';
// import { PhotoController } from './photo.controller';
import { Booking } from './booking.entity';
import {BookingController} from './booking.controller';
import { RoomModule } from '../room/room.module';
import { ResidentModule } from '../resident/resident.module';
import { TeacherModule } from '../teacher/teacher.module';

@Module({
    imports: [TypeOrmModule.forFeature([Booking]),RoomModule,ResidentModule,TeacherModule],
    providers: [BookingService],
    controllers: [BookingController],
    exports: [BookingService],

})
export class BookingModule {}