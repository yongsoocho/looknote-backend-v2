import { Injectable } from '@nestjs/common';
import { JwtUserType } from 'src/common/type/user.type';
import { PrismaService } from '../../common/prisma/prisma.service';
import { PostSelect } from '../../common/type/post.type';
import { FcmService } from '../fcm/fcm.service';
import { CoinService } from '../coin/coin.service';
import { PostService } from '../post/post.service';

@Injectable()
export class MyNoteService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly fcmService: FcmService,
    private readonly coinService: CoinService,
    private readonly postService: PostService,
  ) {}

  async getMyNoteCodyPostList(user: JwtUserType, size = 1, page = 1) {
    const [posts, count, scrapList] = await Promise.all([
      this.prisma.post.findMany({
        where: {
          user_id: Number(user.user_id),
        },
        select: PostSelect,
        take: size,
        skip: size * (page - 1),
        orderBy: {
          post_id: 'desc',
        },
      }),
      this.prisma.post.count({
        where: {
          user_id: Number(user.user_id),
        },
      }),
      this.prisma.scrap.findMany({
        where: {
          user_id: Number(user.user_id),
        },
      }),
    ]);
    return {
      posts: this.postService.checkIsScraped(posts, scrapList),
      pagenation: {
        size,
        page,
        lastPage: Math.ceil(count / size),
      },
    };
  }

  async getMyScrapList(user: JwtUserType, size = 1, page = 1) {
    const [scraps, count] = await Promise.all([
      this.prisma.scrap.findMany({
        where: {
          user_id: Number(user.user_id),
        },
        select: {
          post: {
            select: {
              post_id: true,
              imageURL: true,
              scrap: true,
              updated_at: true,
            },
          },
        },
        take: size,
        skip: size * (page - 1),
        orderBy: {
          post_id: 'desc',
        },
      }),
      this.prisma.scrap.count({
        where: {
          user_id: Number(user.user_id),
        },
      }),
    ]);
    return {
      posts: scraps.map((item) => ({ ...item.post, is_scrap: true })),
      pagenation: {
        size,
        page,
        lastPage: Math.ceil(count / size),
      },
    };
  }

  async toggleScrap(post_id, user: JwtUserType) {
    const isScraped = await this.prisma.scrap.findUnique({
      where: {
        user_id_post_id: {
          user_id: Number(user.user_id),
          post_id,
        },
      },
    });
    if (!isScraped) {
      return this.addToMyScrapList(post_id, user);
    } else {
      return this.deleteMyScrap(post_id, user);
    }
  }

  async addToMyScrapList(post_id, user: JwtUserType) {
    const post = await this.prisma.post.update({
      where: {
        post_id,
      },
      data: {
        scrap: {
          increment: 1,
        },
      },
    });
    const [__, scrap] = await Promise.all([
      post.user_id !== Number(user.user_id)
        ? this.prisma.push.create({
            data: {
              user_id: post.user_id,
              post_id: post.post_id,
              from_id: Number(user.user_id),
              type: 'scrap',
              imageURL: post.imageURL[0],
            },
          })
        : () => {
            return 'fulfilled';
          },
      this.prisma.scrap.create({
        data: {
          user_id: Number(user.user_id),
          post_id,
        },
        select: {
          post: {
            select: {
              post_id: true,
              imageURL: true,
            },
          },
        },
      }),
    ]);
    return scrap;
  }

  async deleteMyScrap(post_id, user: JwtUserType) {
    const post = await this.prisma.post.update({
      where: {
        post_id,
      },
      data: {
        scrap: {
          decrement: 1,
        },
      },
    });
    const [scrap] = await Promise.all([
      this.prisma.scrap.delete({
        where: {
          user_id_post_id: {
            user_id: Number(user.user_id),
            post_id,
          },
        },
      }),
    ]);
    return scrap;
  }

  async getCoinInfo(user: JwtUserType) {
    return this.prisma.coin.findUnique({
      where: {
        coin_id: Number(user.user_id),
      },
    });
  }

  async getPushAlarmList(size = 1, page = 1, user: JwtUserType) {
    const [pushs, count] = await Promise.all([
      this.prisma.push.findMany({
        where: {
          user_id: Number(user.user_id),
        },
        take: size,
        skip: size * (page - 1),
        orderBy: {
          push_id: 'desc',
        },
        include: {
          from: {
            select: {
              user_id: true,
              nickname: true,
            },
          },
        },
      }),
      this.prisma.push.count({
        where: {
          user_id: Number(user.user_id),
        },
      }),
    ]);
    return {
      pushs,
      pagenation: {
        size,
        page,
        lastPage: Math.ceil(count / size),
      },
    };
  }

  async getSubscribeCount(user: JwtUserType) {
    return this.prisma.subscribeCount.findUnique({
      where: {
        user_id: Number(user.user_id),
      },
      select: {
        user_id: true,
        subscriber: true,
        subscribing: true,
      },
    });
  }

  async toggleSubscribe(user_id: number, user: JwtUserType) {
    const exist = await this.prisma.subscribe.findUnique({
      where: {
        subscriber_id_subscribing_id: {
          subscriber_id: user_id,
          subscribing_id: Number(user.user_id),
        },
      },
    });
    if (exist) {
      await this.unSubscribing(user_id, user);
    } else {
      await this.subscribing(user_id, user);
    }
    return 'fulfilled';
  }

  async subscribing(user_id: number, user: JwtUserType) {
    return await Promise.all([
      this.prisma.subscribe.create({
        data: {
          subscriber_id: user_id,
          subscribing_id: Number(user.user_id),
        },
      }),
      this.prisma.subscribeCount.upsert({
        where: {
          user_id: Number(user.user_id),
        },
        update: {
          subscribing: {
            increment: 1,
          },
        },
        create: {
          user_id: Number(user.user_id),
        },
      }),
      this.prisma.subscribeCount.upsert({
        where: {
          user_id,
        },
        update: {
          subscriber: {
            increment: 1,
          },
        },
        create: {
          user_id,
        },
      }),
      this.prisma.push.create({
        data: {
          user_id,
          from_id: Number(user.user_id),
          type: 'subscribe',
        },
      }),
    ]);
  }

  async unSubscribing(user_id: number, user: JwtUserType) {
    return await Promise.all([
      this.prisma.subscribe.delete({
        where: {
          subscriber_id_subscribing_id: {
            subscriber_id: user_id,
            subscribing_id: Number(user.user_id),
          },
        },
      }),
      this.prisma.subscribeCount.upsert({
        where: {
          user_id: Number(user.user_id),
        },
        update: {
          subscribing: {
            decrement: 1,
          },
        },
        create: {
          user_id: Number(user.user_id),
        },
      }),
      this.prisma.subscribeCount.upsert({
        where: {
          user_id,
        },
        update: {
          subscriber: {
            decrement: 1,
          },
        },
        create: {
          user_id,
        },
      }),
    ]);
  }
}
