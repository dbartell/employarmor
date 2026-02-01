-- Migration: Team Invites + Employee-Based Pricing
-- Enables multi-user teams with role-based access

-- ============================================
-- ORGANIZATION MEMBERS (replaces profiles.org_id approach)
-- ============================================
CREATE TABLE IF NOT EXISTS organization_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'manager', 'member')),
  invited_by UUID REFERENCES auth.users(id),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  last_active_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id, user_id)
);

CREATE INDEX idx_org_members_org ON organization_members(organization_id);
CREATE INDEX idx_org_members_user ON organization_members(user_id);

-- ============================================
-- TEAM INVITES (pending invitations)
-- ============================================
CREATE TABLE IF NOT EXISTS team_invites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'manager', 'member')),
  token TEXT UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex'),
  invited_by UUID REFERENCES auth.users(id),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT NOW() + INTERVAL '7 days',
  accepted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_team_invites_token ON team_invites(token);
CREATE INDEX idx_team_invites_email ON team_invites(email);
CREATE INDEX idx_team_invites_org ON team_invites(organization_id);

-- ============================================
-- ORGANIZATION UPDATES (employee count, seat limits)
-- ============================================
ALTER TABLE organizations 
ADD COLUMN IF NOT EXISTS employee_count INTEGER DEFAULT 0;

ALTER TABLE organizations 
ADD COLUMN IF NOT EXISTS seat_limit INTEGER DEFAULT 5;

ALTER TABLE organizations 
ADD COLUMN IF NOT EXISTS seats_used INTEGER DEFAULT 1;

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_invites ENABLE ROW LEVEL SECURITY;

-- Organization members: Users can view members in their org
CREATE POLICY "Users can view org members" ON organization_members
  FOR SELECT USING (
    organization_id IN (
      SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
    )
  );

-- Organization members: Admins/Owners can insert members
CREATE POLICY "Admins can add org members" ON organization_members
  FOR INSERT WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM organization_members 
      WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
    )
  );

-- Organization members: Admins/Owners can update members (but not owners)
CREATE POLICY "Admins can update org members" ON organization_members
  FOR UPDATE USING (
    organization_id IN (
      SELECT organization_id FROM organization_members 
      WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
    )
    -- Can't modify owner unless you are owner
    AND (role != 'owner' OR user_id = auth.uid() OR EXISTS (
      SELECT 1 FROM organization_members om 
      WHERE om.organization_id = organization_members.organization_id 
      AND om.user_id = auth.uid() AND om.role = 'owner'
    ))
  );

-- Organization members: Admins/Owners can delete members (not themselves, not owner)
CREATE POLICY "Admins can remove org members" ON organization_members
  FOR DELETE USING (
    user_id != auth.uid() -- Can't remove yourself
    AND role != 'owner' -- Can't remove owner
    AND organization_id IN (
      SELECT organization_id FROM organization_members 
      WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
    )
  );

-- Team invites: Users can view invites in their org
CREATE POLICY "Users can view team invites" ON team_invites
  FOR SELECT USING (
    organization_id IN (
      SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
    )
  );

-- Team invites: Admins/Owners can create invites
CREATE POLICY "Admins can create team invites" ON team_invites
  FOR INSERT WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM organization_members 
      WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
    )
  );

-- Team invites: Admins/Owners can delete invites
CREATE POLICY "Admins can delete team invites" ON team_invites
  FOR DELETE USING (
    organization_id IN (
      SELECT organization_id FROM organization_members 
      WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
    )
  );

-- Team invites: Anyone can view by token (for accepting)
CREATE POLICY "Anyone can view invite by token" ON team_invites
  FOR SELECT USING (true);

-- Team invites: Service role can update (for accepting)
CREATE POLICY "Service role can update invites" ON team_invites
  FOR UPDATE USING (auth.role() = 'service_role' OR auth.uid() IS NOT NULL);

-- ============================================
-- HELPER FUNCTION: Create owner membership when org is created
-- ============================================
CREATE OR REPLACE FUNCTION create_owner_membership()
RETURNS TRIGGER AS $$
BEGIN
  -- The org ID equals the user ID for the original owner
  INSERT INTO organization_members (organization_id, user_id, role)
  VALUES (NEW.id, NEW.id, 'owner')
  ON CONFLICT (organization_id, user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_organization_created ON organizations;
CREATE TRIGGER on_organization_created
  AFTER INSERT ON organizations
  FOR EACH ROW EXECUTE FUNCTION create_owner_membership();

-- ============================================
-- HELPER FUNCTION: Update seats_used count
-- ============================================
CREATE OR REPLACE FUNCTION update_seats_used()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE organizations 
    SET seats_used = (
      SELECT COUNT(*) FROM organization_members WHERE organization_id = NEW.organization_id
    )
    WHERE id = NEW.organization_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE organizations 
    SET seats_used = (
      SELECT COUNT(*) FROM organization_members WHERE organization_id = OLD.organization_id
    )
    WHERE id = OLD.organization_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_member_change ON organization_members;
CREATE TRIGGER on_member_change
  AFTER INSERT OR DELETE ON organization_members
  FOR EACH ROW EXECUTE FUNCTION update_seats_used();

-- ============================================
-- HELPER FUNCTION: Get user's organization
-- ============================================
CREATE OR REPLACE FUNCTION get_user_organization(p_user_id UUID)
RETURNS UUID AS $$
BEGIN
  RETURN (
    SELECT organization_id 
    FROM organization_members 
    WHERE user_id = p_user_id 
    LIMIT 1
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- HELPER FUNCTION: Check user role
-- ============================================
CREATE OR REPLACE FUNCTION user_has_role(p_user_id UUID, p_roles TEXT[])
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM organization_members 
    WHERE user_id = p_user_id AND role = ANY(p_roles)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- MIGRATE EXISTING USERS TO organization_members
-- ============================================
-- Create membership records for existing org owners
INSERT INTO organization_members (organization_id, user_id, role, joined_at)
SELECT 
  o.id as organization_id,
  o.id as user_id, -- org.id == user.id for owners
  'owner' as role,
  o.created_at as joined_at
FROM organizations o
WHERE NOT EXISTS (
  SELECT 1 FROM organization_members om 
  WHERE om.organization_id = o.id AND om.user_id = o.id
);

-- Update seats_used for all organizations
UPDATE organizations o
SET seats_used = (
  SELECT COUNT(*) FROM organization_members om WHERE om.organization_id = o.id
);
