
import { Module,forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingService } from './booking.service';
// import { PhotoController } from './photo.controller';
import { Booking } from './booking.entity';
import {BookingController} from './booking.controller';
import { RoomModule } from '../room/room.module';
import { ResidentModule } from '../resident/resident.module';
import { TeacherModule } from '../teacher/teacher.module';
import { BillModule } from '../bill/bill.module';

@Module({
    imports: [TypeOrmModule.forFeature([Booking]),RoomModule,ResidentModule,TeacherModule,forwardRef(() => BillModule)],
    providers: [BookingService],
    controllers: [BookingController],
    exports: [BookingService],

})
export class BookingModule {}