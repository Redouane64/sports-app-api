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
      example: [10.0, 12.0, 123.0],
    },
  })
  coordinates!: typeorm.Position[];
}
