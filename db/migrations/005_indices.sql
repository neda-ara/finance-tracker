-- EXPENSE

CREATE INDEX idx_expenses_user_date_created
ON expenses (user_id, expense_date DESC, created_at DESC);

CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX idx_expenses_description_trgm
ON expenses
USING GIN (description gin_trgm_ops);

CREATE INDEX idx_expenses_user_category
ON expenses (user_id, category);

-- EARNING