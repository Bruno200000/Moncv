import crypto from 'crypto';
import { cookies } from 'next/headers';

const ADMIN_EMAIL = 'katchabruno52@gmail.com';
const ADMIN_PASSWORD = 'Bruno01@';
const ADMIN_SECRET = process.env.ADMIN_SECRET || 'moncv-admin-secret-2026';

export function isAdminCredentials(email: string, password: string) {
  return email.toLowerCase().trim() === ADMIN_EMAIL && password === ADMIN_PASSWORD;
}

export function signAdminToken(): string {
  const payload = {
    email: ADMIN_EMAIL,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 8,
  };
  const data = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', ADMIN_SECRET)
    .update(data)
    .digest('base64url');

  return `${data}.${signature}`;
}

export function verifyAdminToken(token?: string): boolean {
  if (!token) return false;

  try {
    const [data, signature] = token.split('.');
    if (!data || !signature) return false;

    const expectedSignature = crypto
      .createHmac('sha256', ADMIN_SECRET)
      .update(data)
      .digest('base64url');

    if (signature !== expectedSignature) return false;

    const payload = JSON.parse(Buffer.from(data, 'base64url').toString('utf8'));
    return payload.email === ADMIN_EMAIL && Date.now() / 1000 <= payload.exp;
  } catch {
    return false;
  }
}

export async function isAdminSession(): Promise<boolean> {
  const cookieStore = await cookies();
  return verifyAdminToken(cookieStore.get('moncv_admin')?.value);
}
