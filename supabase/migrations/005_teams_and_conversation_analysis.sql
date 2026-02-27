-- ============================================================================
-- Vibe Working — Teams & Conversation Analysis
-- 005_teams_and_conversation_analysis.sql
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. Teams
-- ---------------------------------------------------------------------------
CREATE TABLE teams (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          TEXT NOT NULL,
  invite_code   TEXT UNIQUE NOT NULL,
  created_by    UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE team_members (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id       UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  user_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role          TEXT NOT NULL DEFAULT 'member',
  joined_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(team_id, user_id)
);

CREATE INDEX idx_teams_created_by ON teams(created_by);
CREATE INDEX idx_teams_invite_code ON teams(invite_code);
CREATE INDEX idx_team_members_team ON team_members(team_id);
CREATE INDEX idx_team_members_user ON team_members(user_id);

-- ---------------------------------------------------------------------------
-- 2. Conversation analyses (store past analyses + recommendations)
-- ---------------------------------------------------------------------------
CREATE TABLE conversation_analyses (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id             UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  team_id             UUID REFERENCES teams(id) ON DELETE SET NULL,
  other_member_name   TEXT,
  conversation_text   TEXT NOT NULL,
  recommendation_text TEXT NOT NULL,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_conversation_analyses_user ON conversation_analyses(user_id, created_at DESC);
CREATE INDEX idx_conversation_analyses_team ON conversation_analyses(team_id);

-- ---------------------------------------------------------------------------
-- 3. Triggers
-- ---------------------------------------------------------------------------
CREATE TRIGGER teams_updated_at
  BEFORE UPDATE ON teams
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ---------------------------------------------------------------------------
-- 4. RLS
-- ---------------------------------------------------------------------------
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_analyses ENABLE ROW LEVEL SECURITY;

-- Teams: members can read; creator can update/delete
CREATE POLICY "teams_select_member" ON teams
  FOR SELECT TO authenticated USING (
    id IN (SELECT team_id FROM team_members WHERE user_id = auth.uid())
  );
CREATE POLICY "teams_insert_own" ON teams
  FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "teams_update_creator" ON teams
  FOR UPDATE USING (auth.uid() = created_by);
CREATE POLICY "teams_delete_creator" ON teams
  FOR DELETE USING (auth.uid() = created_by);

-- Team members: members of the team can read; creator can insert/delete
CREATE POLICY "team_members_select" ON team_members
  FOR SELECT TO authenticated USING (
    team_id IN (SELECT team_id FROM team_members WHERE user_id = auth.uid())
  );
CREATE POLICY "team_members_insert_creator" ON team_members
  FOR INSERT WITH CHECK (
    team_id IN (SELECT id FROM teams WHERE created_by = auth.uid())
    OR user_id = auth.uid()
  );
CREATE POLICY "team_members_delete_own" ON team_members
  FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "team_members_delete_creator" ON team_members
  FOR DELETE USING (
    team_id IN (SELECT id FROM teams WHERE created_by = auth.uid())
  );

-- Conversation analyses: own only
CREATE POLICY "conversation_analyses_select_own" ON conversation_analyses
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "conversation_analyses_insert_own" ON conversation_analyses
  FOR INSERT WITH CHECK (auth.uid() = user_id);
