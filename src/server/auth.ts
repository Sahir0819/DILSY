import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { Request, Response, NextFunction } from 'express';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const AUTH_FILE = path.join(DATA_DIR, 'auth.json');
const SESSIONS_FILE = path.join(DATA_DIR, 'sessions.json');

// Initial default password requested by business owner
const INITIAL_ADMIN_PASSWORD = 'Error 404 LEADER NOT FOUND';

interface AuthRecord {
  hash: string;
  salt: string;
  iterations: number;
  updatedAt: string;
}

interface SessionRecord {
  token: string;
  createdAt: string;
  expiresAt: string;
}

function ensureDataDir(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
}

/**
 * Initializes auth storage. If no auth record exists, securely seeds the initial credential.
 * Notice the password itself is NEVER saved in plaintext; only the cryptographically secure hash + salt.
 */
export function initAuth(): void {
  ensureDataDir();

  if (!fs.existsSync(AUTH_FILE)) {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = hashPassword(INITIAL_ADMIN_PASSWORD, salt);

    const record: AuthRecord = {
      hash,
      salt,
      iterations: 100000,
      updatedAt: new Date().toISOString(),
    };

    fs.writeFileSync(AUTH_FILE, JSON.stringify(record, null, 2), 'utf-8');
  }

  if (!fs.existsSync(SESSIONS_FILE)) {
    fs.writeFileSync(SESSIONS_FILE, JSON.stringify([], null, 2), 'utf-8');
  }
}

function getAuthRecord(): AuthRecord {
  initAuth();
  const raw = fs.readFileSync(AUTH_FILE, 'utf-8');
  return JSON.parse(raw);
}

function getSessions(): SessionRecord[] {
  ensureDataDir();
  if (!fs.existsSync(SESSIONS_FILE)) {
    return [];
  }
  try {
    const raw = fs.readFileSync(SESSIONS_FILE, 'utf-8');
    const sessions: SessionRecord[] = JSON.parse(raw);
    const now = new Date().toISOString();
    // Clean expired
    const valid = sessions.filter((s) => s.expiresAt > now);
    if (valid.length !== sessions.length) {
      fs.writeFileSync(SESSIONS_FILE, JSON.stringify(valid, null, 2), 'utf-8');
    }
    return valid;
  } catch {
    return [];
  }
}

function saveSessions(sessions: SessionRecord[]): void {
  ensureDataDir();
  fs.writeFileSync(SESSIONS_FILE, JSON.stringify(sessions, null, 2), 'utf-8');
}

/**
 * Verifies admin password using constant-time comparison to prevent timing side-channel attacks.
 */
export function verifyAdminPassword(password: string): { success: boolean; token?: string; error?: string } {
  try {
    const auth = getAuthRecord();
    const candidateHash = hashPassword(password, auth.salt);

    const hashBuf = Buffer.from(auth.hash, 'hex');
    const candidateBuf = Buffer.from(candidateHash, 'hex');

    if (hashBuf.length === candidateBuf.length && crypto.timingSafeEqual(hashBuf, candidateBuf)) {
      // Create session token valid for 7 days
      const token = crypto.randomBytes(32).toString('hex');
      const now = new Date();
      const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();

      const sessions = getSessions();
      sessions.push({
        token,
        createdAt: now.toISOString(),
        expiresAt,
      });
      saveSessions(sessions);

      return { success: true, token };
    }

    return { success: false, error: 'Incorrect admin password' };
  } catch (err: any) {
    return { success: false, error: err.message || 'Authentication error' };
  }
}

/**
 * Validates a session token
 */
export function isValidToken(token: string): boolean {
  if (!token) return false;
  const sessions = getSessions();
  const now = new Date().toISOString();
  return sessions.some((s) => s.token === token && s.expiresAt > now);
}

/**
 * Revokes a session token on logout
 */
export function revokeToken(token: string): void {
  if (!token) return;
  const sessions = getSessions();
  const updated = sessions.filter((s) => s.token !== token);
  saveSessions(updated);
}

/**
 * Allows the owner to change their admin password securely
 */
export function changeAdminPassword(currentPassword: string, newPassword: string): { success: boolean; error?: string } {
  const verify = verifyAdminPassword(currentPassword);
  if (!verify.success) {
    return { success: false, error: 'Current password is incorrect' };
  }

  if (!newPassword || newPassword.length < 8) {
    return { success: false, error: 'New password must be at least 8 characters long' };
  }

  const salt = crypto.randomBytes(16).toString('hex');
  const hash = hashPassword(newPassword, salt);

  const record: AuthRecord = {
    hash,
    salt,
    iterations: 100000,
    updatedAt: new Date().toISOString(),
  };

  fs.writeFileSync(AUTH_FILE, JSON.stringify(record, null, 2), 'utf-8');
  // Clear all other sessions except current if any
  saveSessions([]);

  return { success: true };
}

/**
 * Express Middleware protecting admin endpoints
 */
export function requireAdminAuth(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized: Admin authentication token required' });
    return;
  }

  const token = authHeader.substring(7).trim();
  if (!isValidToken(token)) {
    res.status(401).json({ error: 'Unauthorized: Session has expired or is invalid' });
    return;
  }

  next();
}
