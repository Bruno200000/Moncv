import crypto from 'crypto';
import { cookies } from 'next/headers';
import { db, User } from './db';

const JWT_SECRET = process.env.JWT_SECRET || 'moncv-super-secret-key-2026-saas';
const PASSWORD_SALT = process.env.PASSWORD_SALT || 'moncv-password-salt-key-9911';

// Hachage de mot de passe sécurisé (PBKDF2 natif)
export function hashPassword(password: string): string {
  return crypto
    .pbkdf2Sync(password, PASSWORD_SALT, 1000, 64, 'sha512')
    .toString('hex');
}

// Signer un jeton JWT de manière native
export function signToken(payload: { userId: string; email: string }): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  
  // Expiration à 7 jours
  const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7;
  const fullPayload = { ...payload, exp };
  
  const data = Buffer.from(JSON.stringify(fullPayload)).toString('base64url');
  
  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${header}.${data}`)
    .digest('base64url');
    
  return `${header}.${data}.${signature}`;
}

// Vérifier un jeton JWT
export function verifyToken(token: string): { userId: string; email: string; exp: number } | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const [header, data, signature] = parts;
    const expectedSignature = crypto
      .createHmac('sha256', JWT_SECRET)
      .update(`${header}.${data}`)
      .digest('base64url');
      
    if (signature !== expectedSignature) return null;
    
    const decoded = JSON.parse(Buffer.from(data, 'base64url').toString('utf8'));
    
    // Vérification de l'expiration
    if (decoded.exp && Date.now() / 1000 > decoded.exp) {
      return null; // Expiré
    }
    
    return decoded;
  } catch (error) {
    return null;
  }
}

// Obtenir l'utilisateur de la session courante dans un Route Handler ou Server Component
export async function getSessionUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('moncv_session')?.value;
    
    if (!token) return null;
    
    const decoded = verifyToken(token);
    if (!decoded || !decoded.userId) return null;
    
    const user = db.getUserById(decoded.userId);
    return user || null;
  } catch (error) {
    return null;
  }
}
