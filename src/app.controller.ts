import { Controller, Get, UseGuards, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from './guards/auth.guard';
import { LogInterceptor } from './interceptor/log.interceptor';

@Controller()
@UseGuards(AuthGuard)
@UseInterceptors(LogInterceptor)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/hello')
  getHello(): string {
    return this.appService.getHello();
  }
}
