--- EXPENSE ---

CREATE INDEX idx_expenses_user_date_created
ON expenses (user_id, expense_date DESC, created_at DESC);

CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX idx_expenses_description_trgm
ON expenses
USING GIN (description gin_trgm_ops);

CREATE INDEX idx_expenses_user_category
ON expenses (user_id, category);

--- EARNING ---

CREATE INDEX idx_earnings_user_date_created
ON earnings (user_id, received_date DESC, created_at DESC);

CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX idx_earnings_description_trgm
ON earnings
USING GIN (description gin_trgm_ops);

CREATE INDEX idx_earnings_source_trgm
ON earnings
USING GIN (source gin_trgm_ops);

CREATE INDEX idx_earnings_category_trgm
ON earnings
USING GIN (category gin_trgm_ops);

--- BUDGET ---

CREATE UNIQUE INDEX idx_unique_user_category_budget
ON budgets(user_id, category);

CREATE INDEX idx_budgets_user_date_created
ON budgets (user_id, created_at);