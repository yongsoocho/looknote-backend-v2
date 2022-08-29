import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtUserType } from 'src/common/type/user.type';
import { PrismaService } from '../../common/prisma/prisma.service';
import { PostSelect } from '../../common/type/post.type';
import { FcmService } from '../fcm/fcm.service';
import { CoinService } from '../coin/coin.service';

@Injectable()
export class PostService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly fcmService: FcmService,
    private readonly coinService: CoinService,
  ) {}

  async checkIsCodyPostAuthor(post_id: number, user: JwtUserType) {
    const post = await this.prisma.post.findUnique({
      where: {
        post_id,
      },
    });
    if (Number(user.user_id) === post.user_id) {
      return true;
    } else {
      return false;
    }
  }

  async checkIsCommentAuthor(comment_id: number, user: JwtUserType) {
    const comment = await this.prisma.comment.findUnique({
      where: {
        comment_id,
      },
    });
    if (Number(user.user_id) === comment.user_id) {
      return true;
    } else {
      return false;
    }
  }

  checkIsScraped(posts, scraps) {
    return posts.map((post) => {
      if (
        scraps.find((scrap) => {
          return scrap.post_id === post.post_id;
        })
      ) {
        return { ...post, is_scrap: true };
      } else {
        return { ...post, is_scrap: false };
      }
    });
  }

  async getCodyPostWithPagenation(size = 1, page = 1, user: JwtUserType) {
    const [posts, count, scrapList] = await Promise.all([
      this.prisma.post.findMany({
        take: size,
        skip: size * (Number(page) - 1),
        orderBy: { post_id: 'desc' },
        select: PostSelect,
      }),
      this.prisma.post.count(),
      this.prisma.scrap.findMany({
        where: {
          user_id: Number(user.user_id),
        },
      }),
    ]);
    return {
      posts: this.checkIsScraped(posts, scrapList),
      pagenation: {
        size,
        page,
        lastPage: Math.ceil(count / size),
      },
    };
  }

  async getCodyVoguePostWithPagenation(size = 1, page = 1, user: JwtUserType) {
    const [posts, count, scrapList] = await Promise.all([
      this.prisma.vogue.findMany({
        take: size,
        skip: size * (Number(page) - 1),
        orderBy: [{ quality: 'desc' }, { vogue_id: 'desc' }],
        select: {
          post_id: true,
          post: true,
        },
      }),
      this.prisma.vogue.count(),
      this.prisma.scrap.findMany({
        where: {
          user_id: Number(user.user_id),
        },
      }),
    ]);
    return {
      posts: this.checkIsScraped(
        posts.map((e) => ({
          post_id: e.post_id,
          imageURL: e.post.imageURL,
          updated_at: e.post.updated_at,
          scrap: e.post.scrap,
          comment: e.post.comment,
        })),
        scrapList,
      ),
      pagenation: {
        size,
        page,
        lastPage: Math.ceil(count / size),
      },
    };
  }

  async addVogueForTest(post_id: number) {
    if (process.env.NODE_ENV === 'dev') {
      return this.prisma.vogue.create({
        data: {
          post_id,
          quality: Math.round(Math.random() * 3),
        },
      });
    } else {
      return 'fulfilled';
    }
  }

  async findCodyPostsByUserId(
    user_id: number,
    size = 1,
    page = 1,
    user: JwtUserType,
  ) {
    const [posts, count, is_subscribe] = await Promise.all([
      this.prisma.post.findMany({
        where: {
          user_id,
        },
        take: size,
        skip: size * (Number(page) - 1),
        orderBy: {
          post_id: 'desc',
        },
        select: PostSelect,
      }),
      this.prisma.post.count({
        where: {
          user_id,
        },
      }),
      this.prisma.subscribe.findUnique({
        where: {
          subscriber_id_subscribing_id: {
            subscriber_id: user_id,
            subscribing_id: Number(user.user_id),
          },
        },
      }),
    ]);
    return {
      posts,
      pagenation: {
        size,
        page,
        lastPage: Math.ceil(count / size),
      },
      is_subscribe: !!is_subscribe,
    };
  }

  async getDetailCodyPost(post_id: number, user: JwtUserType) {
    const [post, scrapCheck] = await Promise.all([
      this.prisma.post.findUnique({
        where: {
          post_id,
        },
        select: {
          post_id: true,
          imageURL: true,
          scrap: true,
          user: {
            select: {
              nickname: true,
              user_id: true,
            },
          },
          comments: {
            select: {
              comment_id: true,
              content: true,
              updated_at: true,
              user: {
                select: {
                  user_id: true,
                  nickname: true,
                },
              },
            },
            take: 20,
          },
        },
      }),
      this.prisma.scrap.findUnique({
        where: {
          user_id_post_id: {
            user_id: Number(user.user_id),
            post_id,
          },
        },
      }),
    ]);
    if (!post) {
      throw new HttpException('post not found', HttpStatus.NOT_FOUND);
    }
    if (!scrapCheck) {
      return {
        ...post,
        isScrap: false,
      };
    } else {
      return {
        ...post,
        isScrap: true,
      };
    }
  }

  async createCodyPost(images, user: JwtUserType) {
    const imageURL = images.map((image) => {
      return image.location;
    });
    if (imageURL.length === 0) {
      throw new HttpException('rejected', HttpStatus.BAD_REQUEST);
    }
    await this.coinService.giveRewardPostReward(Number(user.user_id));
    return this.prisma.post.create({
      data: {
        imageURL,
        user_id: Number(user.user_id),
      },
      select: PostSelect,
    });
  }

  async deleteCodyPost(post_id: number, user: JwtUserType) {
    const post = await this.prisma.post.findUnique({
      where: {
        post_id,
      },
    });
    if (!post) {
      throw new HttpException('post not found', HttpStatus.NOT_FOUND);
    }
    const isAuthor = await this.checkIsCodyPostAuthor(post_id, user);
    if (!isAuthor) {
      throw new HttpException('rejected', HttpStatus.FORBIDDEN);
    }
    await Promise.all([
      this.coinService.giveCoinToUser(Number(user.user_id), -10),
      this.prisma.postReward.update({
        where: {
          user_id: post.user_id,
        },
        data: {
          post: {
            decrement: 1,
          },
        },
      }),
    ]);
    return this.prisma.post.delete({
      where: {
        post_id,
      },
      select: PostSelect,
    });
  }

  async patchImageCodyPost(images, post_id: number, user: JwtUserType) {
    const imageURL = images.map((e) => {
      return e.location
        .split('/')
        .map((ele, i) => {
          if (i === 2) {
            return 'photo.looknote.co.kr';
          } else {
            return ele;
          }
        })
        .join('/');
    });
    if (imageURL.length === 0) {
      throw new HttpException('rejected', HttpStatus.BAD_REQUEST);
    }
    const post = await this.prisma.post.findUnique({
      where: { post_id },
    });
    if (!post) {
      throw new HttpException('rejected', HttpStatus.NOT_FOUND);
    } else {
      const isAuthor = await this.checkIsCodyPostAuthor(post_id, user);
      if (isAuthor) {
        await this.prisma.post.update({
          where: {
            post_id,
          },
          data: {
            imageURL,
          },
        });
        return 'fulfilled';
      } else {
        throw new HttpException('rejected', HttpStatus.FORBIDDEN);
      }
    }
  }

  async getCommentsListWhichInCodyPost(post_id: number, size = 1, page = 1) {
    const [comments, count] = await Promise.all([
      this.prisma.comment.findMany({
        where: {
          post_id,
        },
        select: {
          comment_id: true,
          content: true,
          updated_at: true,
          user: {
            select: {
              user_id: true,
              nickname: true,
            },
          },
        },
        take: size,
        skip: size * (page - 1),
      }),
      this.prisma.comment.count({
        where: {
          post_id,
        },
      }),
    ]);
    return {
      comments,
      pagenation: {
        size,
        page,
        lastPage: Math.ceil(count / size),
      },
    };
  }

  async createComment(createCommentBody, user: JwtUserType) {
    const [post, comment] = await Promise.all([
      this.prisma.post.update({
        where: {
          post_id: Number(createCommentBody.post_id),
        },
        data: {
          comment: {
            increment: 1,
          },
        },
      }),
      this.prisma.comment.create({
        data: {
          post_id: Number(createCommentBody.post_id),
          content: createCommentBody.content,
          user_id: Number(user.user_id),
        },
      }),
    ]);
    await Promise.all([
      post.user_id !== Number(user.user_id)
        ? this.prisma.push.create({
            data: {
              user_id: Number(post.user_id),
              from_id: Number(user.user_id),
              post_id: post.post_id,
              type: 'comment',
              imageURL: post.imageURL[0],
            },
          })
        : () => {
            return 'fulfilled';
          },
    ]);
    return comment;
  }

  async deleteComment(comment_id: number, user: JwtUserType) {
    const isCommentAuthor = await this.checkIsCommentAuthor(comment_id, user);
    if (isCommentAuthor) {
      const deleteComment = await this.prisma.comment.delete({
        where: {
          comment_id,
        },
      });
      this.prisma.post.update({
        where: {
          post_id: deleteComment.post_id,
        },
        data: {
          comment: {
            decrement: 1,
          },
        },
      });
      return 'fulfilled';
    } else {
      throw new HttpException('rejected', HttpStatus.FORBIDDEN);
    }
  }

  async patchCommentContent(patchCommentBody, user: JwtUserType) {
    const isCommentAuthor = await this.checkIsCommentAuthor(
      patchCommentBody.comment_id,
      user,
    );
    if (isCommentAuthor) {
      await this.prisma.comment.update({
        where: {
          comment_id: Number(patchCommentBody.comment_id),
        },
        data: {
          content: patchCommentBody.content,
        },
      });
      return {
        massage: 'fulfilled',
      };
    } else {
      throw new HttpException('rejected', HttpStatus.FORBIDDEN);
    }
  }
}
