import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ListTracksFilter,
  PaginationParams,
} from './dtos/list-tracks-filter-params.dto';
import { type AuthenticateUser, CurrentUser } from 'src/auth';
import { CreateTrackParams } from './dtos/create-track-params.dto';
import { UpdateTrackParams } from './dtos/update-track-params.dto';
import { TrackService } from './track.service';

@Controller('tracks')
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @Get()
  list(
    @Query() filter: ListTracksFilter,
    @Query() pagination: PaginationParams,
    @CurrentUser() user: AuthenticateUser,
  ) {
    return this.trackService.list(filter, pagination, user);
  }

  @Post()
  create(
    @Body() data: CreateTrackParams,
    @CurrentUser() user: AuthenticateUser,
  ) {
    return this.trackService.create(data, user);
  }

  @Patch(':id')
  update(
    @Param('id') trackId: string,
    @Body() data: UpdateTrackParams,
    @CurrentUser() user: AuthenticateUser,
  ) {
    return this.trackService.update(trackId, data, user);
  }

  @Delete(':id')
  delete(@Param('id') trackId: string, @CurrentUser() user: AuthenticateUser) {
    return this.trackService.delete(trackId, user);
  }
}
