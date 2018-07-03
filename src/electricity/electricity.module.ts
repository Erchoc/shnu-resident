
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ElectricityService } from './electricity.service';
// import { PhotoController } from './photo.controller';
import { Electricity } from './electricity.entity';
import {ElectricityController} from './electricity.controller';
import { BookingModule } from '../booking/booking.module';

@Module({
    imports: [TypeOrmModule.forFeature([Electricity]),BookingModule],
    providers: [ElectricityService],
    controllers: [ElectricityController],
    exports: [ElectricityService],

})
export class ElectricityModule {}