import { Pool } from 'pg';
import { PersonalDetails, Experience, Education, Skill, Language, Hobby } from '@/type';

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  plan: 'free' | 'premium' | 'vip';
  createdAt: string;
}

export interface CV {
  id: string;
  userId: string;
  name: string;
  personalDetails: PersonalDetails;
  experiences: Experience[];
  educations: Education[];
  languages: Language[];
  skills: Skill[];
  hobbies: Hobby[];
  theme: string;
  template?: string;
  createdAt: string;
  updatedAt: string;
}

type Plan = User['plan'];

let pool: Pool | null = null;
let schemaReady: Promise<void> | null = null;

export function getCurrentMonthKey(date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

function getPool() {
  if (pool) return pool;

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL manquant. Ajoutez votre URL Neon dans les variables d environnement Vercel.');
  }

  pool = new Pool({
    connectionString,
    ssl: connectionString.includes('sslmode=require')
      ? { rejectUnauthorized: false }
      : undefined,
  });

  return pool;
}

async function ensureSchema() {
  if (!schemaReady) {
    schemaReady = getPool().query(`
      CREATE EXTENSION IF NOT EXISTS pgcrypto;

      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'premium', 'vip')),
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS cvs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        name TEXT NOT NULL DEFAULT 'Mon CV',
        personal_details JSONB NOT NULL DEFAULT '{}'::jsonb,
        experiences JSONB NOT NULL DEFAULT '[]'::jsonb,
        educations JSONB NOT NULL DEFAULT '[]'::jsonb,
        languages JSONB NOT NULL DEFAULT '[]'::jsonb,
        skills JSONB NOT NULL DEFAULT '[]'::jsonb,
        hobbies JSONB NOT NULL DEFAULT '[]'::jsonb,
        theme TEXT NOT NULL DEFAULT 'cupcake',
        template TEXT NOT NULL DEFAULT 'classic',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS analytics_events (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE SET NULL,
        cv_id UUID REFERENCES cvs(id) ON DELETE SET NULL,
        type TEXT NOT NULL CHECK (type IN ('visit', 'download')),
        path TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_cvs_user_id ON cvs(user_id);
      CREATE INDEX IF NOT EXISTS idx_cvs_created_at ON cvs(created_at);
      CREATE INDEX IF NOT EXISTS idx_analytics_type ON analytics_events(type);
      CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON analytics_events(created_at);

      CREATE OR REPLACE FUNCTION set_updated_at()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;

      DROP TRIGGER IF EXISTS cvs_set_updated_at ON cvs;
      CREATE TRIGGER cvs_set_updated_at
      BEFORE UPDATE ON cvs
      FOR EACH ROW
      EXECUTE FUNCTION set_updated_at();
    `).then(() => undefined);
  }

  return schemaReady;
}

function jsonValue<T>(value: unknown, fallback: T): T {
  if (!value) return fallback;
  if (typeof value === 'string') {
    try {
      return JSON.parse(value) as T;
    } catch {
      return fallback;
    }
  }
  return value as T;
}

function mapUser(row: any): User {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    passwordHash: row.password_hash,
    plan: row.plan,
    createdAt: new Date(row.created_at).toISOString(),
  };
}

function mapCv(row: any): CV {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    personalDetails: jsonValue(row.personal_details, {
      fullName: '',
      email: '',
      phone: '',
      address: '',
      photoUrl: '',
      postSeeking: '',
      description: '',
    }),
    experiences: jsonValue(row.experiences, []),
    educations: jsonValue(row.educations, []),
    languages: jsonValue(row.languages, []),
    skills: jsonValue(row.skills, []),
    hobbies: jsonValue(row.hobbies, []),
    theme: row.theme,
    template: row.template,
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString(),
  };
}

export const db = {
  async getUsers(): Promise<User[]> {
    await ensureSchema();
    const { rows } = await getPool().query('SELECT * FROM users ORDER BY created_at DESC');
    return rows.map(mapUser);
  },

  async getUserById(id: string): Promise<User | undefined> {
    await ensureSchema();
    const { rows } = await getPool().query('SELECT * FROM users WHERE id = $1 LIMIT 1', [id]);
    return rows[0] ? mapUser(rows[0]) : undefined;
  },

  async getUserByEmail(email: string): Promise<User | undefined> {
    await ensureSchema();
    const emailLower = email.toLowerCase().trim();
    const { rows } = await getPool().query('SELECT * FROM users WHERE lower(email) = $1 LIMIT 1', [emailLower]);
    return rows[0] ? mapUser(rows[0]) : undefined;
  },

  async createUser(user: Omit<User, 'id' | 'plan' | 'createdAt'>): Promise<User> {
    await ensureSchema();
    const emailLower = user.email.toLowerCase().trim();
    try {
      const { rows } = await getPool().query(
        `INSERT INTO users (name, email, password_hash)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [user.name, emailLower, user.passwordHash]
      );
      return mapUser(rows[0]);
    } catch (error: any) {
      if (error.code === '23505') {
        throw new Error('Cet email est déjà enregistré.');
      }
      throw error;
    }
  },

  async updateUserPlan(userId: string, plan: Plan): Promise<User> {
    await ensureSchema();
    const { rows } = await getPool().query(
      `UPDATE users SET plan = $1 WHERE id = $2 RETURNING *`,
      [plan, userId]
    );
    if (!rows[0]) throw new Error('Utilisateur introuvable.');
    return mapUser(rows[0]);
  },

  async getCVs(userId: string): Promise<CV[]> {
    await ensureSchema();
    const { rows } = await getPool().query(
      'SELECT * FROM cvs WHERE user_id = $1 ORDER BY updated_at DESC',
      [userId]
    );
    return rows.map(mapCv);
  },

  async getCVsCreatedThisMonth(userId: string): Promise<CV[]> {
    await ensureSchema();
    const { rows } = await getPool().query(
      `SELECT * FROM cvs
       WHERE user_id = $1
       AND created_at >= date_trunc('month', NOW())
       ORDER BY created_at DESC`,
      [userId]
    );
    return rows.map(mapCv);
  },

  async getCV(id: string): Promise<CV | undefined> {
    await ensureSchema();
    const { rows } = await getPool().query('SELECT * FROM cvs WHERE id = $1 LIMIT 1', [id]);
    return rows[0] ? mapCv(rows[0]) : undefined;
  },

  async createCV(userId: string, name: string, template = 'classic'): Promise<CV> {
    await ensureSchema();
    const user = await this.getUserById(userId);
    if (!user) throw new Error('Utilisateur non authentifié.');

    const counts = await getPool().query(
      `SELECT
        COUNT(*)::int AS total,
        COUNT(*) FILTER (WHERE created_at >= date_trunc('month', NOW()))::int AS monthly
       FROM cvs
       WHERE user_id = $1`,
      [userId]
    );
    const total = counts.rows[0]?.total || 0;
    const monthly = counts.rows[0]?.monthly || 0;

    if (user.plan === 'free' && monthly >= 3) {
      throw new Error('Limite atteinte. Vous avez utilisé vos 3 essais gratuits du mois. Passez au plan VIP pour créer des CVs illimités.');
    }
    if (user.plan === 'premium' && total >= 10) {
      throw new Error('Limite atteinte. Le plan Premium est limité à 10 CVs.');
    }

    const personalDetails: PersonalDetails = {
      fullName: user.name,
      email: user.email,
      phone: '',
      address: '',
      photoUrl: '',
      postSeeking: '',
      description: '',
    };

    const { rows } = await getPool().query(
      `INSERT INTO cvs (user_id, name, personal_details, template)
       VALUES ($1, $2, $3::jsonb, $4)
       RETURNING *`,
      [userId, name || 'Mon CV', JSON.stringify(personalDetails), template]
    );

    return mapCv(rows[0]);
  },

  async updateCV(userId: string, cvId: string, updatedFields: Partial<Omit<CV, 'id' | 'userId' | 'createdAt'>>): Promise<CV> {
    await ensureSchema();
    const { rows } = await getPool().query(
      `UPDATE cvs SET
        name = COALESCE($1, name),
        personal_details = COALESCE($2::jsonb, personal_details),
        experiences = COALESCE($3::jsonb, experiences),
        educations = COALESCE($4::jsonb, educations),
        languages = COALESCE($5::jsonb, languages),
        skills = COALESCE($6::jsonb, skills),
        hobbies = COALESCE($7::jsonb, hobbies),
        theme = COALESCE($8, theme),
        template = COALESCE($9, template)
       WHERE id = $10 AND user_id = $11
       RETURNING *`,
      [
        updatedFields.name ?? null,
        updatedFields.personalDetails === undefined ? null : JSON.stringify(updatedFields.personalDetails),
        updatedFields.experiences === undefined ? null : JSON.stringify(updatedFields.experiences),
        updatedFields.educations === undefined ? null : JSON.stringify(updatedFields.educations),
        updatedFields.languages === undefined ? null : JSON.stringify(updatedFields.languages),
        updatedFields.skills === undefined ? null : JSON.stringify(updatedFields.skills),
        updatedFields.hobbies === undefined ? null : JSON.stringify(updatedFields.hobbies),
        updatedFields.theme ?? null,
        updatedFields.template ?? null,
        cvId,
        userId,
      ]
    );

    if (!rows[0]) {
      throw new Error("CV introuvable ou vous n'avez pas l'autorisation de le modifier.");
    }

    return mapCv(rows[0]);
  },

  async deleteCV(userId: string, cvId: string): Promise<void> {
    await ensureSchema();
    const result = await getPool().query('DELETE FROM cvs WHERE id = $1 AND user_id = $2', [cvId, userId]);
    if (!result.rowCount) {
      throw new Error("CV introuvable ou vous n'avez pas l'autorisation de le supprimer.");
    }
  },

  async getAdminStats() {
    await ensureSchema();
    const [totals, plans, recentUsers] = await Promise.all([
      getPool().query(`
        SELECT
          (SELECT COUNT(*)::int FROM users) AS total_users,
          (SELECT COUNT(*)::int FROM users WHERE created_at >= date_trunc('month', NOW())) AS users_this_month,
          (SELECT COUNT(*)::int FROM cvs) AS total_cvs,
          (SELECT COUNT(*)::int FROM cvs WHERE created_at >= date_trunc('month', NOW())) AS cvs_this_month,
          (SELECT COUNT(*)::int FROM analytics_events WHERE type = 'visit') AS total_visits,
          (SELECT COUNT(*)::int FROM analytics_events WHERE type = 'download') AS total_downloads
      `),
      getPool().query(`
        SELECT plan, COUNT(*)::int AS count
        FROM users
        GROUP BY plan
      `),
      getPool().query(`
        SELECT u.*, COUNT(c.id)::int AS cvs_count
        FROM users u
        LEFT JOIN cvs c ON c.user_id = u.id
        GROUP BY u.id
        ORDER BY u.created_at DESC
        LIMIT 8
      `),
    ]);

    const planCounts = { free: 0, premium: 0, vip: 0 };
    for (const row of plans.rows) {
      planCounts[row.plan as Plan] = row.count;
    }

    return {
      totalUsers: totals.rows[0].total_users,
      usersThisMonth: totals.rows[0].users_this_month,
      totalCvs: totals.rows[0].total_cvs,
      cvsThisMonth: totals.rows[0].cvs_this_month,
      totalVisits: totals.rows[0].total_visits,
      totalDownloads: totals.rows[0].total_downloads,
      revenueMonth: planCounts.premium * 1000 + planCounts.vip * 3000,
      plans: planCounts,
      recentUsers: recentUsers.rows.map((row) => ({
        id: row.id,
        name: row.name,
        email: row.email,
        plan: row.plan,
        createdAt: new Date(row.created_at).toISOString(),
        cvsCount: row.cvs_count,
      })),
    };
  },
};
