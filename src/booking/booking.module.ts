
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingService } from './booking.service';
// import { PhotoController } from './photo.controller';
import { Booking } from './booking.entity';
import {BookingController} from './booking.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Booking])],
    providers: [BookingService],
    controllers: [BookingController],
    exports: [BookingService],

})
export class BookingModule {}