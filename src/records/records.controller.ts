import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { type AuthenticatedUser, CurrentUser } from 'src/auth';
import { CreateRecordParams } from './dtos/create-record-params.dto';
import { ListRecordFilter } from './dtos/list-records.dto';
import { PaginationParams } from 'src/common/dtos/pagination-params.dto';
import { RecordService } from './records.service';
import { AuthGuard } from '@nestjs/passport';
import { type Response } from 'express';

@Controller('records')
export class RecordController {
  constructor(private readonly recordService: RecordService) {}

  @Get(':trackId')
  @UseGuards(AuthGuard('jwt'))
  list(
    @Param('trackId', ParseUUIDPipe) trackId: string,
    @Query() filter: ListRecordFilter,
    @Query() pagination: PaginationParams,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.recordService.list(trackId, filter, pagination, user);
  }

  @Post(':trackId')
  @UseGuards(AuthGuard('jwt'))
  create(
    @Param('trackId', ParseUUIDPipe) trackId: string,
    @Body() data: CreateRecordParams,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.recordService.create(trackId, data, user);
  }

  @Delete(':recordId')
  @UseGuards(AuthGuard('jwt'))
  async delete(
    @Param('recordId', ParseUUIDPipe) recordId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Res() response: Response,
  ) {
    await this.recordService.delete(recordId, user);
    return response.status(HttpStatus.NO_CONTENT).send();
  }
}
