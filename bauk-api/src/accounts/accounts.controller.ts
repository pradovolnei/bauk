import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AccountsService } from './accounts.service';

@Controller('accounts')
@UseGuards(AuthGuard('jwt'))
export class AccountsController {
  constructor(private accountsService: AccountsService) {}

  @Get('balance')
  async getBalance(@Request() req) {
    const account = await this.accountsService.findOne(req.user.account.id);
    return { balance: account.balance };
  }
}