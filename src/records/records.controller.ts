import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { type AuthenticatedUser, CurrentUser } from 'src/auth';
import { CreateRecordParams } from './dtos/create-record-params.dto';
import { ListRecordFilter } from './dtos/list-records.dto';
import { PaginationParams } from 'src/common/dtos/pagination-params.dto';
import { RecordService } from './records.service';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { PaginatedResponse } from 'src/common/dtos/paginated-result.dto';
import { Record } from './entities/record.entity';

@ApiTags('records')
@Controller('records')
export class RecordController {
  constructor(private readonly recordService: RecordService) {}

  @Get(':trackId')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'List records for a track',
    operationId: 'listRecords',
  })
  @ApiParam({
    name: 'trackId',
    type: 'uuid',
    required: true,
    description: 'Track ID to fetch records for',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiOkResponse({ type: PaginatedResponse(Record) })
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
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create a record for a track',
    operationId: 'createRecord',
  })
  @ApiParam({
    name: 'trackId',
    type: 'uuid',
    required: true,
    description: 'Track ID to create a record for',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiCreatedResponse({
    description: 'Record created successfully',
    type: Record,
  })
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.CREATED)
  create(
    @Param('trackId', ParseUUIDPipe) trackId: string,
    @Body() data: CreateRecordParams,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.recordService.create(trackId, data, user);
  }

  @Delete(':recordId')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete a record',
    operationId: 'deleteRecord',
  })
  @ApiParam({
    name: 'recordId',
    type: 'uuid',
    required: true,
    description: 'Record ID to delete',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiNoContentResponse({
    description: 'Record deleted successfully',
  })
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @Param('recordId', ParseUUIDPipe) recordId: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    await this.recordService.delete(recordId, user);
  }
}
