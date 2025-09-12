/*
  # Create default admin user

  1. New Data
    - Creates a default admin user for testing
    - Email: admin@example.com
    - Password: admin123 (hashed)
    
  2. Security
    - Password is properly hashed using SHA256
    - Admin role assigned
*/

INSERT INTO users (email, password, role) 
VALUES (
  'admin@example.com', 
  'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', -- admin123 hashed
  'admin'
) 
ON CONFLICT (email) DO NOTHING;