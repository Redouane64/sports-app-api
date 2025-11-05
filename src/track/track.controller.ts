import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ListTracksFilter,
  PaginationParams,
} from './dtos/list-tracks-filter-params.dto';
import { type AuthenticateUser, CurrentUser } from 'src/auth';
import { CreateTrackParams } from './dtos/create-track-params.dto';
import { UpdateTrackParams } from './dtos/update-track-params.dto';
import { TrackService } from './track.service';
import { AuthGuard } from '@nestjs/passport';

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

  @Get(':trackId')
  get(
    @Param('trackId') trackId: string,
    @Query('location') location: string,
    @CurrentUser() user?: AuthenticateUser,
  ) {
    return this.trackService.findOne({ trackId, location }, user);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(
    @Body() data: CreateTrackParams,
    @CurrentUser() user: AuthenticateUser,
  ) {
    return this.trackService.create(data, user);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  update(
    @Param('id') trackId: string,
    @Body() data: UpdateTrackParams,
    @CurrentUser() user: AuthenticateUser,
  ) {
    return this.trackService.update(trackId, data, user);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  delete(@Param('id') trackId: string, @CurrentUser() user: AuthenticateUser) {
    return this.trackService.delete(trackId, user);
  }
}
