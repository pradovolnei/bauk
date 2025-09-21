import { Controller, Post, Body, UseGuards, Request, Get, Query } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('transactions')
@UseGuards(AuthGuard('jwt'))
export class TransactionsController {
  constructor(private transactionsService: TransactionsService) {}

  @Post('transfer')
  async transfer(
    @Request() req,
    @Body('username') creditedUsername: string,
    @Body('value') value: number,
  ) {
    return this.transactionsService.transfer(req.user.userId, creditedUsername, value);
  }

  @Get()
  async getMyTransactions(@Request() req, @Query() filters: any) {
    return this.transactionsService.getMyTransactions(req.user.userId, filters);
  }
}