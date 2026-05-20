-- Run on Render PostgreSQL if withdrawals fail with "Anfrage fehlgeschlagen"
-- (database still has btcAmount column instead of eurAmount)

-- Option A: rename column (keeps existing values)
ALTER TABLE "WithdrawalRequest" RENAME COLUMN "btcAmount" TO "eurAmount";

-- Option B: if eurAmount already exists, skip Option A
