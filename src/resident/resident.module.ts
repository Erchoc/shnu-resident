
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResidentService } from './resident.service';
// import { PhotoController } from './photo.controller';
import { Resident } from './resident.entity';
import {ResidentController} from './resident.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Resident])],
    providers: [ResidentService],
    controllers: [ResidentController],
    exports: [ResidentService],

})
export class ResidentModule {}