import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreatePushTokenDto } from './dto/create-push-token.dto';

@Injectable()
export class PushTokensService {
  private prisma = new PrismaClient();

  async create(createPushTokenDto: CreatePushTokenDto) {
    try {
      return await this.prisma.pushToken.upsert({
        where: { token: createPushTokenDto.token },
        update: {},
        create: { token: createPushTokenDto.token },
      });
    } catch (error) {
      console.error('Error creating push token:', error);
      throw error;
    }
  }

  async findAll() {
    try {
      return await this.prisma.pushToken.findMany();
    } catch (error) {
      console.error('Error finding push tokens:', error);
      throw error;
    }
  }

  async getAllTokens(): Promise<string[]> {
    try {
      const pushTokens = await this.prisma.pushToken.findMany({
        select: { token: true },
      });
      return pushTokens.map(pt => pt.token);
    } catch (error) {
      console.error('Error getting all tokens:', error);
      throw error;
    }
  }
}

