import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class CoinService {
  constructor(private readonly prisma: PrismaService) {}

  async testFlightCoin(user_id, coin) {
    return this.prisma.coin.update({
      where: {
        coin_id: user_id,
      },
      data: {
        coin: {
          increment: coin,
        },
        coin_sum: {
          increment: coin,
        },
      },
    });
  }

  async giveCoinToUser(user_id: number, coin: number) {
    return this.prisma.coin.update({
      where: {
        coin_id: user_id,
      },
      data: {
        coin: {
          increment: coin,
        },
        coin_sum: {
          increment: coin,
        },
      },
    });
  }

  async getCoinShopList(size = 1, page = 1) {
    const [shops, count] = await Promise.all([
      this.prisma.shop.findMany({
        take: size,
        skip: size * (page - 1),
        orderBy: {
          shop_id: 'desc',
        },
      }),
      this.prisma.shop.count(),
    ]);
    return {
      shops,
      pagenation: {
        size,
        count,
        lastPage: Math.ceil(count / size),
      },
    };
  }

  async giveRewardPostReward(user_id: number) {
    const postReward = await this.prisma.postReward.upsert({
      where: {
        user_id,
      },
      update: {
        post: {
          increment: 1,
        },
      },
      create: {
        user_id,
      },
    });
    this.giveCoinToUser(user_id, 10);
    return postReward;
  }

  async giveRewardScrapReward(user_id: number) {
    const scrapReward = await this.prisma.scrapReward.upsert({
      where: {
        user_id,
      },
      update: {
        scrap: {
          increment: 1,
        },
      },
      create: {
        user_id,
      },
    });
    if (
      scrapReward.scrap % 30 === 0 &&
      scrapReward.scrap / 30 > scrapReward.count
    ) {
      // Promise.all([
      //   this.giveCoinToUser(user_id, 500),
      //   this.prisma.scrapReward.update({
      //     where: {
      //       user_id,
      //     },
      //     data: {
      //       count: {
      //         increment: 1,
      //       },
      //     },
      //   }),
      // ]);
      return true;
    }
    return false;
  }
}
