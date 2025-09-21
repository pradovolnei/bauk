import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users.entity';
import { Account } from '../accounts/accounts.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Account])],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}