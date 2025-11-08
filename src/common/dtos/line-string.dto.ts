import { ApiProperty } from '@nestjs/swagger';
import * as typeorm from 'typeorm';

export class LineString implements typeorm.LineString {
  @ApiProperty({ type: 'string', enum: ['LineString'] })
  type!: 'LineString';

  @ApiProperty({
    type: 'array',
    items: {
      type: 'array',
      items: { type: 'number' },
      example: [
        [16.32852, 48.210746, 212.15486744],
        [16.32855, 48.210742, 212.154881811],
        [16.328629, 48.21073, 212.161372691],
      ],
    },
  })
  coordinates!: typeorm.Position[];
}
