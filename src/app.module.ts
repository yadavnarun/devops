import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ActionModule } from './action/action.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Action } from './action/entities/action.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mariadb',
      host: process.env.DB_HOST,
      port: 3306,
      username: 'admin',
      password: 'pass',
      database: 'actionsdb',
      entities: [Action],
      // synchronize: process.env.NODE_ENV === 'production' ? false : true,
      synchronize: true,
    }),
    ActionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
