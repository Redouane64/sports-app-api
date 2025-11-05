import { BadRequestException, Injectable } from '@nestjs/common';
import { ClientMetadata, TokenPayloadOf } from './interfaces';
import { AuthResult } from './dto/auth-result.dto';
import { Repository } from 'typeorm';
import { Session } from './entities/session.entity';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { LoginUserParams } from './dto/login.dto';
import { TokenService } from './token.service';
import { DataSource } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import crypto from 'node:crypto';
import util from 'node:util';
import { RegisterUserParams } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly tokenService: TokenService,
  ) {}

  async register(data: RegisterUserParams, meta: ClientMetadata) {
    const hash = util.promisify<
      crypto.BinaryLike,
      crypto.BinaryLike,
      number,
      Buffer
    >(crypto.scrypt);
    const salt = Buffer.from(crypto.randomBytes(16));
    const passwordHash = await hash(data.password, salt, 32);

    return await this.dataSource.transaction(async (entityManager) => {
      const user = await entityManager.save(
        User,
        {
          email: data.email,
          password: `${salt.toString('hex')}.${passwordHash.toString('hex')}`,
          fullName: data.fullName,
        },
        { transaction: false },
      );
      const session = await entityManager.save(
        Session,
        {
          userAgent: meta.userAgent,
          ip: meta.ip,
          user: user,
        },
        { transaction: false },
      );

      return await this.tokenService.generateAuthenticationTokenPair(
        session.id,
        {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
        },
      );
    });
  }

  async login(
    data: LoginUserParams,
    meta?: ClientMetadata,
  ): Promise<AuthResult> {
    const user = await this.userRepository.findOne({
      where: { email: data.email },
      select: {
        id: true,
        password: true,
        email: true,
        fullName: true,
      },
      relations: {
        sessions: true,
      },
    });

    if (!user) {
      throw new BadRequestException(`incorrect_credentials`);
    }

    const hash = util.promisify<
      crypto.BinaryLike,
      crypto.BinaryLike,
      number,
      Buffer
    >(crypto.scrypt);

    const [salt, password] = user.password.split('.');
    const passwordHash = await hash(
      data.password,
      Buffer.from(salt, 'hex'),
      32,
    );

    const passwordMatch = crypto.timingSafeEqual(
      passwordHash,
      Buffer.from(password, 'hex'),
    );
    if (!passwordMatch) {
      throw new BadRequestException(`incorrect_credentials`);
    }

    let session: Session | undefined;
    if (meta) {
      session = user.sessions!.find(
        (s) => s.ip == meta.ip && s.userAgent === meta.userAgent,
      );

      if (!session) {
        session = new Session();
        session.userAgent = meta.userAgent;
        session.ip = meta.ip;
        session.user = user;
      } else {
        session.ip ??= meta.ip;
        session.updatedAt = new Date();
      }
    }

    const result = await this.sessionRepository.manager
      .createQueryBuilder()
      .insert()
      .into(Session)
      .values(session!)
      .orUpdate(['ip', 'user_agent', 'updated_at'], ['id'])
      .returning(['id'])
      .execute();

    const [entry] = result.raw as Session[];
    return await this.tokenService.generateAuthenticationTokenPair(entry.id, {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
    });
  }

  async refreshToken(
    user: TokenPayloadOf<'refresh'>,
    meta: ClientMetadata,
  ): Promise<[string, string]> {
    const session = await this.sessionRepository.findOne({
      where: {
        id: user.jti,
        user: {
          email: user.email,
        },
      },
      relations: {
        user: true,
      },
    });

    if (!session || !session.user) {
      throw new BadRequestException(`invalid_session`);
    }

    await this.sessionRepository.update(
      { id: session.id },
      {
        ip: meta.ip,
        userAgent: meta.userAgent,
        userId: session.userId,
      },
    );

    const { accessToken, refreshToken } =
      await this.tokenService.generateAuthenticationTokenPair(
        session.id,
        session.user,
      );

    return [accessToken, refreshToken];
  }

  async logout(user: TokenPayloadOf<'authentication'>) {
    await this.sessionRepository.delete({
      id: user.sessionId,
    });
  }
}
