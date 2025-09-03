-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('student', 'teacher');

-- CreateEnum
CREATE TYPE "public"."SubjectType" AS ENUM ('mathematics', 'english');

-- CreateEnum
CREATE TYPE "public"."SubmissionStatus" AS ENUM ('pending', 'graded', 'failed');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "role" "public"."UserRole" NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Assignment" (
    "id" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "subject" "public"."SubjectType" NOT NULL,
    "name" TEXT NOT NULL,
    "className" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "description" TEXT,
    "questionPaperPath" TEXT,
    "answerKeyPath" TEXT,
    "submissionLink" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Assignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Submission" (
    "id" TEXT NOT NULL,
    "assignmentId" TEXT NOT NULL,
    "studentId" TEXT,
    "studentIdentifier" TEXT NOT NULL,
    "submissionFilePath" TEXT NOT NULL,
    "status" "public"."SubmissionStatus" NOT NULL DEFAULT 'pending',
    "scoreTotal" DOUBLE PRECISION,
    "summary" TEXT,
    "gradedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Submission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Question" (
    "id" TEXT NOT NULL,
    "assignmentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SubmissionResult" (
    "id" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "scoreEarned" DOUBLE PRECISION NOT NULL,
    "scorePossible" DOUBLE PRECISION NOT NULL,
    "rationale" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SubmissionResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ClassSummary" (
    "id" TEXT NOT NULL,
    "assignmentId" TEXT NOT NULL,
    "metrics" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClassSummary_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Assignment_submissionLink_key" ON "public"."Assignment"("submissionLink");

-- CreateIndex
CREATE INDEX "Assignment_teacherId_idx" ON "public"."Assignment"("teacherId");

-- CreateIndex
CREATE INDEX "Submission_assignmentId_idx" ON "public"."Submission"("assignmentId");

-- CreateIndex
CREATE INDEX "Submission_studentId_idx" ON "public"."Submission"("studentId");

-- CreateIndex
CREATE INDEX "Question_assignmentId_idx" ON "public"."Question"("assignmentId");

-- CreateIndex
CREATE INDEX "SubmissionResult_submissionId_idx" ON "public"."SubmissionResult"("submissionId");

-- CreateIndex
CREATE INDEX "SubmissionResult_questionId_idx" ON "public"."SubmissionResult"("questionId");

-- CreateIndex
CREATE INDEX "ClassSummary_assignmentId_idx" ON "public"."ClassSummary"("assignmentId");

-- AddForeignKey
ALTER TABLE "public"."Assignment" ADD CONSTRAINT "Assignment_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Submission" ADD CONSTRAINT "Submission_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "public"."Assignment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Submission" ADD CONSTRAINT "Submission_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Question" ADD CONSTRAINT "Question_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "public"."Assignment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SubmissionResult" ADD CONSTRAINT "SubmissionResult_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "public"."Submission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SubmissionResult" ADD CONSTRAINT "SubmissionResult_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "public"."Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ClassSummary" ADD CONSTRAINT "ClassSummary_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "public"."Assignment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
