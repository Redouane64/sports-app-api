import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseBoolPipe,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ListTracksFilter } from './dtos/list-tracks-filter-params.dto';
import { PaginationParams } from 'src/common/dtos/pagination-params.dto';
import { type AuthenticatedUser, CurrentUser } from 'src/auth';
import { CreateTrackParams } from './dtos/create-track-params.dto';
import { UpdateTrackParams } from './dtos/update-track-params.dto';
import { TrackService } from './track.service';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { PaginatedResponse } from 'src/common/dtos/paginated-result.dto';
import { Track } from './entities/track.entity';

@ApiTags('Tracks')
@Controller('tracks')
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List tracks', operationId: 'listTracks' })
  @ApiParam({
    name: 'query',
    type: String,
    required: false,
    description: 'The keyword to search for',
    example: 'keyword',
  })
  @ApiOkResponse({
    description: 'List of tracks',
    type: PaginatedResponse(Track),
  })
  @UseGuards(AuthGuard('jwt'))
  list(
    @Query() filter: ListTracksFilter,
    @Query() pagination: PaginationParams,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.trackService.list(filter, pagination, user);
  }

  @Get(':trackId')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Find track by Id', operationId: 'findTrackById' })
  @ApiParam({
    name: 'trackId',
    type: 'uuid',
    required: true,
    description: 'The ID of the track to find',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiParam({
    name: 'location',
    type: String,
    description: 'Client location to calculate distance from the track',
    required: false,
  })
  @ApiParam({
    name: 'route',
    type: Boolean,
    required: false,
    description: 'Whether to include route data in the response',
  })
  @ApiOkResponse({
    description: 'Find track by Id',
    type: Track,
  })
  @ApiNotFoundResponse({
    description: 'Track not found',
  })
  get(
    @Param('trackId', ParseUUIDPipe) trackId: string,
    @Query('location') location: string,
    @Query('route', new DefaultValuePipe(false), ParseBoolPipe) route: boolean,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.trackService.findOne({ trackId, location }, { route }, user);
  }

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create track', operationId: 'createTrack' })
  @ApiCreatedResponse({
    description: 'Track created',
    type: Track,
  })
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() data: CreateTrackParams,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.trackService.create(data, user);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update track', operationId: 'updateTrack' })
  @ApiOkResponse({
    description: 'Track updated',
    type: Track,
  })
  @ApiParam({
    name: 'trackId',
    description: 'Track ID',
    type: 'uuid',
    required: true,
  })
  @ApiNotFoundResponse({
    description: 'Track not found',
  })
  @UseGuards(AuthGuard('jwt'))
  update(
    @Param('trackId', ParseUUIDPipe) trackId: string,
    @Body() data: UpdateTrackParams,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.trackService.update(trackId, data, user);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete track', operationId: 'deleteTrack' })
  @ApiNoContentResponse({
    description: 'Track deleted',
  })
  @ApiParam({
    name: 'trackId',
    description: 'Track ID',
    type: 'uuid',
    required: true,
  })
  @ApiNotFoundResponse({
    description: 'Track not found',
  })
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @Param('trackId', ParseUUIDPipe) trackId: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    await this.trackService.delete(trackId, user);
  }
}
