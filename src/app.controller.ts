import { Controller, Get, Res } from '@nestjs/common';
import type { Response } from 'express';

@Controller()
export class AppController {
  @Get('healthz')
  healthz(@Res() response: Response) {
    response.status(200).send();
  }
}
