CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE, 
    password_hash TEXT NOT NULL,
    date_of_birth DATE,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    last_login_at TIMESTAMPTZ,
    email_verified BOOLEAN NOT NULL DEFAULT false
);

CREATE TRIGGER trigger_users_updated_at
BEFORE UPDATE ON users 
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();


