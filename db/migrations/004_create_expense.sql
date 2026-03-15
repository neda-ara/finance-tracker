CREATE TABLE IF NOT EXISTS expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expense_date DATE NOT NULL,
    amount NUMERIC(9,2) NOT NULL,
    category TEXT NOT NULL,
    currency CHAR(3) NOT NULL,
    description TEXT, 
    satisfaction_rating INT CHECK (satisfaction_rating BETWEEN 1 AND 5),
    payment_mode TEXT NOT NULL CHECK (payment_mode IN ('cash', 'online')),
    metadata JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TRIGGER trigger_expenses_updated_at
BEFORE UPDATE ON expenses 
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();


