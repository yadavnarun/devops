import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ActionModule } from './action/action.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Action } from './action/entities/action.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'actions.sql',
      entities: [Action],
      // synchronize: process.env.NODE_ENV === 'development' ? true : false,
      synchronize: true,
    }),
    ActionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
