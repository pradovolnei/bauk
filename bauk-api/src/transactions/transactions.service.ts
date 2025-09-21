import { Injectable, BadRequestException, ForbiddenException, NotFoundException  } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan, LessThanOrEqual } from 'typeorm';
import { Transaction } from './transactions.entity';
import { AccountsService } from '../accounts/accounts.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionsRepository: Repository<Transaction>,
    private accountsService: AccountsService,
    private usersService: UsersService,
  ) {}

  async transfer(debitedUserId: string, creditedUsername: string, value: number): Promise<Transaction> {
    const debitedUser = await this.usersService.findOneById(debitedUserId);
    const creditedUser = await this.usersService.findOneByUsername(creditedUsername);

    if (!debitedUser || !creditedUser) {
      throw new BadRequestException('Usuário(s) não encontrado(s).');
    }

    if (debitedUser.id === creditedUser.id) {
      throw new BadRequestException('Não é possível transferir para si mesmo.');
    }

    if (debitedUser.account.balance < value) {
      throw new BadRequestException('Saldo insuficiente.');
    }

    const queryRunner = this.transactionsRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Atualiza o saldo das contas
      debitedUser.account.balance -= value;
      creditedUser.account.balance += value;

      await queryRunner.manager.save(debitedUser.account);
      await queryRunner.manager.save(creditedUser.account);

      // 2. Cria a nova transação
      const newTransaction = this.transactionsRepository.create({
        debitedAccount: debitedUser.account,
        creditedAccount: creditedUser.account,
        value,
        type: 'cash-out',
      });
      await queryRunner.manager.save(newTransaction);

      await queryRunner.commitTransaction();
      return newTransaction;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException('Falha na transação.');
    } finally {
      await queryRunner.release();
    }
  }

  async getMyTransactions(userId: string, filters: any) {
    const user = await this.usersService.findOneById(userId);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    const query = this.transactionsRepository.createQueryBuilder('transaction')
      .where('transaction.debitedAccountId = :accountId OR transaction.creditedAccountId = :accountId', { accountId: user.account.id });

    if (filters.type === 'cash-out') {
      query.andWhere('transaction.debitedAccountId = :accountId', { accountId: user.account.id });
    } else if (filters.type === 'cash-in') {
      query.andWhere('transaction.creditedAccountId = :accountId', { accountId: user.account.id });
    }

    if (filters.date) {
      const date = new Date(filters.date);
      const nextDay = new Date(date);
      nextDay.setDate(date.getDate() + 1);
      query.andWhere('transaction.createdAt >= :dateStart', { dateStart: date.toISOString().split('T')[0] })
        .andWhere('transaction.createdAt < :dateEnd', { dateEnd: nextDay.toISOString().split('T')[0] });
    }

    const transactions = await query.getMany();
    return transactions;
  }
}