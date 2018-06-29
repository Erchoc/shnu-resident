
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConstsService } from './consts.service';
// import { PhotoController } from './photo.controller';
import { Consts } from './consts.entity';
import {ConstsController} from './consts.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Consts])],
    providers: [ConstsService],
    controllers: [ConstsController],
    exports: [ConstsService],

})
export class ConstsModule {}