CREATE TABLE IF NOT EXISTS earnings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    received_date DATE NOT NULL,
    amount NUMERIC(10,2) NOT NULL,
    currency CHAR(3) NOT NULL,
    source TEXT NOT NULL,     -- employer/client/platform
    category TEXT NOT NULL,   -- salary, freelance, investment etc
    description TEXT,
    metadata JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TRIGGER trigger_earnings_updated_at
BEFORE UPDATE ON earnings
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();