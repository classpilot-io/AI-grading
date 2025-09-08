/*
  Warnings:

  - You are about to drop the `Question` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SubmissionResult` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Question" DROP CONSTRAINT "Question_assignmentId_fkey";

-- DropForeignKey
ALTER TABLE "public"."SubmissionResult" DROP CONSTRAINT "SubmissionResult_questionId_fkey";

-- DropForeignKey
ALTER TABLE "public"."SubmissionResult" DROP CONSTRAINT "SubmissionResult_submissionId_fkey";

-- AlterTable
ALTER TABLE "public"."Submission" ADD COLUMN     "results" JSONB;

-- DropTable
DROP TABLE "public"."Question";

-- DropTable
DROP TABLE "public"."SubmissionResult";
