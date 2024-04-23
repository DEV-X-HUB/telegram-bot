-- CreateEnum
CREATE TYPE "LandStatus" AS ENUM ('under_construction', 'new_construction', 'as_built');

-- CreateTable
CREATE TABLE "Post" (
    "id" UUID NOT NULL,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "category" TEXT NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Service1A" (
    "id" UUID NOT NULL,
    "post_id" TEXT NOT NULL,
    "arbr" DOUBLE PRECISION NOT NULL,
    "height" DOUBLE PRECISION NOT NULL,
    "depth" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Service1A_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Service1B" (
    "id" UUID NOT NULL,
    "post_id" TEXT NOT NULL,
    "arbr" DOUBLE PRECISION NOT NULL,
    "height" DOUBLE PRECISION NOT NULL,
    "depth" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Service1B_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Service4ChickenFarm" (
    "id" UUID NOT NULL,
    "post_id" TEXT NOT NULL,
    "sector" TEXT NOT NULL,
    "estimated_capital" TEXT NOT NULL,
    "enterprise_name" TEXT NOT NULL,

    CONSTRAINT "Service4ChickenFarm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Service4Manufacture" (
    "id" UUID NOT NULL,
    "post_id" TEXT NOT NULL,
    "sector" TEXT NOT NULL,
    "number_of_workers" DOUBLE PRECISION NOT NULL,
    "estimated_capital" TEXT NOT NULL,
    "enterprise_name" TEXT NOT NULL,
    "photo" TEXT[],

    CONSTRAINT "Service4Manufacture_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Service4Construction" (
    "id" UUID NOT NULL,
    "post_id" TEXT NOT NULL,
    "construction_size" TEXT,
    "company_experience" TEXT,
    "document_request_type" TEXT,
    "land_size" TEXT,
    "land_status" TEXT,
    "location" TEXT NOT NULL,
    "photo" TEXT[],

    CONSTRAINT "Service4Construction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Service1A_post_id_key" ON "Service1A"("post_id");

-- CreateIndex
CREATE UNIQUE INDEX "Service1B_post_id_key" ON "Service1B"("post_id");

-- CreateIndex
CREATE UNIQUE INDEX "Service4ChickenFarm_post_id_key" ON "Service4ChickenFarm"("post_id");

-- CreateIndex
CREATE UNIQUE INDEX "Service4Manufacture_post_id_key" ON "Service4Manufacture"("post_id");

-- CreateIndex
CREATE UNIQUE INDEX "Service4Construction_post_id_key" ON "Service4Construction"("post_id");

-- AddForeignKey
ALTER TABLE "Service1A" ADD CONSTRAINT "Service1A_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Service1B" ADD CONSTRAINT "Service1B_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Service4ChickenFarm" ADD CONSTRAINT "Service4ChickenFarm_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Service4Manufacture" ADD CONSTRAINT "Service4Manufacture_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Service4Construction" ADD CONSTRAINT "Service4Construction_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
