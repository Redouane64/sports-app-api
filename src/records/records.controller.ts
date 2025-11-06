import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { type AuthenticatedUser, CurrentUser } from 'src/auth';
import { CreateTrackRecordParams } from './dtos/create-track-record-params.dto';
import { ListRecordFilter } from './dtos/list-records.dto';
import { PaginationParams } from 'src/common/dtos/pagination-params.dto';
import { RecordService } from './records.service';
import { AuthGuard } from '@nestjs/passport';
import { type Response } from 'express';

@Controller('records')
export class RecordController {
  constructor(private readonly recordService: RecordService) {}

  @Get()
  list(
    @Query() filter: ListRecordFilter,
    @Query() pagination: PaginationParams,
    @CurrentUser() user?: AuthenticatedUser,
  ) {
    return this.recordService.list(filter, pagination, user);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(
    @Param('trackId') trackId: string,
    @Body() data: CreateTrackRecordParams,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.recordService.create(trackId, data, user);
  }

  @Delete()
  @UseGuards(AuthGuard('jwt'))
  async delete(
    @Param('recordId') recordId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Res() response: Response,
  ) {
    await this.recordService.delete(recordId, user);
    return response.status(HttpStatus.NO_CONTENT).send();
  }
}
