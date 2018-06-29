import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { TeacherModule } from './teacher/teacher.module';
import { RoomModule } from './room/room.module';
import { ResidentModule } from './resident/resident.module';
import { ElectricityModule } from './electricity/electricity.module';
import { ConstsModule } from './consts/consts.module';
import { BookingModule } from './booking/booking.module';
import { BillModule } from './bill/bill.module';

@Module({
  imports: [
      TypeOrmModule.forRoot(),
      TeacherModule,
      RoomModule,
      ResidentModule,
      ElectricityModule,
      ConstsModule,
      BookingModule,
      BillModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
    constructor(private readonly connection: Connection) {}
}
