/*
  Warnings:

  - You are about to drop the `policy_configurations` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "policy_configurations" DROP CONSTRAINT "policy_configurations_policy_id_fkey";

-- DropTable
DROP TABLE "policy_configurations";
