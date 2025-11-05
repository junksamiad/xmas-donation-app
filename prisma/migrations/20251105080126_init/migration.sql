-- CreateTable
CREATE TABLE "public"."Department" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Department_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."GiftIdea" (
    "id" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "gender" TEXT NOT NULL,
    "giftIdeas" TEXT[],
    "category" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GiftIdea_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Child" (
    "id" TEXT NOT NULL,
    "recipient" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "gender" TEXT NOT NULL,
    "giftIdeas" TEXT NOT NULL,
    "category" TEXT,
    "priority" BOOLEAN NOT NULL DEFAULT false,
    "assigned" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Child_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Donation" (
    "id" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "donorName" TEXT NOT NULL,
    "departmentId" TEXT NOT NULL,
    "donationType" TEXT NOT NULL,
    "amount" DECIMAL(10,2),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Donation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Department_name_key" ON "public"."Department"("name");

-- CreateIndex
CREATE INDEX "Department_active_idx" ON "public"."Department"("active");

-- CreateIndex
CREATE INDEX "GiftIdea_age_gender_idx" ON "public"."GiftIdea"("age", "gender");

-- CreateIndex
CREATE UNIQUE INDEX "GiftIdea_age_gender_category_key" ON "public"."GiftIdea"("age", "gender", "category");

-- CreateIndex
CREATE INDEX "Child_assigned_idx" ON "public"."Child"("assigned");

-- CreateIndex
CREATE INDEX "Child_gender_age_idx" ON "public"."Child"("gender", "age");

-- CreateIndex
CREATE INDEX "Child_category_idx" ON "public"."Child"("category");

-- CreateIndex
CREATE INDEX "Donation_departmentId_idx" ON "public"."Donation"("departmentId");

-- CreateIndex
CREATE INDEX "Donation_createdAt_idx" ON "public"."Donation"("createdAt");

-- CreateIndex
CREATE INDEX "Donation_childId_idx" ON "public"."Donation"("childId");

-- AddForeignKey
ALTER TABLE "public"."Donation" ADD CONSTRAINT "Donation_childId_fkey" FOREIGN KEY ("childId") REFERENCES "public"."Child"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Donation" ADD CONSTRAINT "Donation_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "public"."Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
