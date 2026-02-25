-- Add owner_id to organizations for ownership transfer support
-- Decouples org ownership from the org.id = user.id assumption

-- Add owner_id column (nullable initially for backfill)
alter table organizations add column if not exists owner_id uuid references auth.users(id) on delete set null;

-- Backfill: set owner_id = id for all existing orgs (current behavior: org creator's user.id = org.id)
update organizations set owner_id = id where owner_id is null;

-- Make it not null after backfill
alter table organizations alter column owner_id set not null;

-- Index for lookups
create index if not exists idx_organizations_owner_id on organizations(owner_id);

-- Remove cascade delete from org → auth.users if it exists
-- The org should survive if the original creator is deleted
-- (Supabase orgs table id references auth.users(id) — we can't easily change the FK 
--  but owner_id is what we check for ownership now)
