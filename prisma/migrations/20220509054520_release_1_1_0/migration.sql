/*
  Warnings:

  - You are about to drop the `Subscribe` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Tag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TagCloset` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `noteId` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_postId_fkey";

-- DropForeignKey
ALTER TABLE "Likes" DROP CONSTRAINT "Likes_postId_fkey";

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_authorId_fkey";

-- DropForeignKey
ALTER TABLE "Report" DROP CONSTRAINT "Report_authorId_fkey";

-- DropForeignKey
ALTER TABLE "Report" DROP CONSTRAINT "Report_postId_fkey";

-- DropForeignKey
ALTER TABLE "Subscribe" DROP CONSTRAINT "Subscribe_subscriberId_fkey";

-- DropForeignKey
ALTER TABLE "Subscribe" DROP CONSTRAINT "Subscribe_subscribingId_fkey";

-- DropForeignKey
ALTER TABLE "Tag" DROP CONSTRAINT "Tag_authorId_fkey";

-- DropForeignKey
ALTER TABLE "TagCloset" DROP CONSTRAINT "TagCloset_authorId_fkey";

-- DropForeignKey
ALTER TABLE "TagCloset" DROP CONSTRAINT "TagCloset_tagId_fkey";

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "noteId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Subscribe";

-- DropTable
DROP TABLE "Tag";

-- DropTable
DROP TABLE "TagCloset";

-- DropEnum
DROP TYPE "TagStatus";

-- CreateTable
CREATE TABLE "MyNote" (
    "authorId" INTEGER NOT NULL,

    CONSTRAINT "MyNote_pkey" PRIMARY KEY ("authorId")
);

-- CreateTable
CREATE TABLE "RewardList" (
    "authorId" INTEGER NOT NULL,
    "postId" INTEGER NOT NULL,

    CONSTRAINT "RewardList_pkey" PRIMARY KEY ("authorId","postId")
);

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Likes" ADD CONSTRAINT "Likes_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_noteId_fkey" FOREIGN KEY ("noteId") REFERENCES "MyNote"("authorId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MyNote" ADD CONSTRAINT "MyNote_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RewardList" ADD CONSTRAINT "RewardList_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RewardList" ADD CONSTRAINT "RewardList_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
