import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    console.log('entrou no service');
    return 'Hello World!';
  }
}
