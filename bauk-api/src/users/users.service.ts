import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { Account } from '../accounts/accounts.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Account)
    private accountsRepository: Repository<Account>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { username, password } = createUserDto;

    // 1. Validar unicidade e tamanho do username
    const existingUser = await this.usersRepository.findOne({ where: { username } });
    if (existingUser) {
      throw new BadRequestException('Username já existe.');
    }
    if (username.length < 3) {
      throw new BadRequestException('Username deve ter pelo menos 3 caracteres.');
    }

    // 2. Hash da senha
    if (password.length < 8 || !/[A-Z]/.test(password) || !/\d/.test(password)) {
      throw new BadRequestException('Senha deve ter pelo menos 8 caracteres, um número e uma letra maiúscula.');
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Criar a conta com saldo inicial
    const newAccount = this.accountsRepository.create({ balance: 100.00 });

    // 4. Criar o usuário e associar a conta
    const newUser = this.usersRepository.create({
      username,
      password: hashedPassword,
      account: newAccount,
    });

    // 5. Salvar em uma transação para garantir atomicidade
    const queryRunner = this.usersRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.save(Account, newAccount);
      await queryRunner.manager.save(User, newUser);
      await queryRunner.commitTransaction();
      return newUser;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException('Não foi possível criar o usuário e a conta.');
    } finally {
      await queryRunner.release();
    }
  }

  async findOneById(id: string): Promise<User> {
    return this.usersRepository.findOne({ where: { id }, relations: ['account'] });
  }

  async findOneByUsername(username: string): Promise<User> {
    return this.usersRepository.findOne({ where: { username }, relations: ['account'] });
  }
}