import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { Request, Response, NextFunction } from 'express';

// Master initial password requested by business owner
export const INITIAL_ADMIN_PASSWORD = 'Error 404 LEADER NOT FOUND';

// Secret used for HMAC signing of session tokens (supports Netlify env var)
const SESSION_SECRET =
  process.env.SESSION_SECRET ||
  process.env.JWT_SECRET ||
  'dilsy_gifting_studio_session_secret_2026_super_secure';

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

let cachedDataDir: string | null = null;
let inMemoryAuthRecord: AuthRecord | null = null;
const inMemoryRevokedTokens = new Set<string>();

/**
 * Safely resolves a writable data directory.
 * Falls back to /tmp/dilsy_data in AWS Lambda / Netlify Functions or if cwd is read-only.
 */
export function getDataDir(): string {
  if (cachedDataDir) return cachedDataDir;

  if (process.env.DATA_DIR) {
    cachedDataDir = process.env.DATA_DIR;
    return cachedDataDir;
  }

  // Detect Netlify Functions or AWS Lambda environment
  const isServerless =
    Boolean(process.env.NETLIFY) ||
    Boolean(process.env.AWS_LAMBDA_FUNCTION_NAME) ||
    Boolean(process.env.LAMBDA_TASK_ROOT);

  if (isServerless) {
    const tmpDir = path.join('/tmp', 'dilsy_data');
    try {
      if (!fs.existsSync(tmpDir)) {
        fs.mkdirSync(tmpDir, { recursive: true });
      }
      cachedDataDir = tmpDir;
      return tmpDir;
    } catch {
      // In case /tmp subfolder fails, use /tmp directly
      cachedDataDir = '/tmp';
      return '/tmp';
    }
  }

  // Local / dev environment
  try {
    const localDir = path.resolve(process.cwd(), 'data');
    if (!fs.existsSync(localDir)) {
      fs.mkdirSync(localDir, { recursive: true });
    }
    // Test write permission
    const testFile = path.join(localDir, '.write-test');
    fs.writeFileSync(testFile, 'ok', 'utf-8');
    fs.unlinkSync(testFile);
    cachedDataDir = localDir;
    return localDir;
  } catch {
    // Read-only filesystem fallback
    const tmpDir = path.join('/tmp', 'dilsy_data');
    try {
      if (!fs.existsSync(tmpDir)) {
        fs.mkdirSync(tmpDir, { recursive: true });
      }
      cachedDataDir = tmpDir;
      return tmpDir;
    } catch {
      cachedDataDir = '/tmp';
      return '/tmp';
    }
  }
}

function getAuthFilePath(): string {
  return path.join(getDataDir(), 'auth.json');
}

function getSessionsFilePath(): string {
  return path.join(getDataDir(), 'sessions.json');
}

function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
}

/**
 * Initializes auth storage safely.
 */
export function initAuth(): void {
  try {
    const authFile = getAuthFilePath();
    if (fs.existsSync(authFile)) {
      const raw = fs.readFileSync(authFile, 'utf-8');
      inMemoryAuthRecord = JSON.parse(raw);
      return;
    }

    // Also check if read-only cwd has a pre-bundled data/auth.json
    const bundledAuthFile = path.resolve(process.cwd(), 'data', 'auth.json');
    if (fs.existsSync(bundledAuthFile)) {
      try {
        const raw = fs.readFileSync(bundledAuthFile, 'utf-8');
        inMemoryAuthRecord = JSON.parse(raw);
        return;
      } catch {
        // Continue to seed
      }
    }

    const salt = crypto.randomBytes(16).toString('hex');
    const masterPass = process.env.ADMIN_PASSWORD || INITIAL_ADMIN_PASSWORD;
    const hash = hashPassword(masterPass, salt);

    inMemoryAuthRecord = {
      hash,
      salt,
      iterations: 100000,
      updatedAt: new Date().toISOString(),
    };

    try {
      fs.writeFileSync(authFile, JSON.stringify(inMemoryAuthRecord, null, 2), 'utf-8');
    } catch (writeErr) {
      console.warn('[DILSY Auth] Could not persist auth.json to disk (using memory):', writeErr);
    }
  } catch (err) {
    console.warn('[DILSY Auth] initAuth encountered error, using memory fallback:', err);
  }
}

function getAuthRecord(): AuthRecord {
  if (inMemoryAuthRecord) return inMemoryAuthRecord;
  initAuth();
  if (inMemoryAuthRecord) return inMemoryAuthRecord;

  // Ultimate fallback
  const salt = crypto.randomBytes(16).toString('hex');
  const masterPass = process.env.ADMIN_PASSWORD || INITIAL_ADMIN_PASSWORD;
  const hash = hashPassword(masterPass, salt);
  inMemoryAuthRecord = {
    hash,
    salt,
    iterations: 100000,
    updatedAt: new Date().toISOString(),
  };
  return inMemoryAuthRecord;
}

/**
 * Creates a cryptographically signed, stateless session token (HMAC-SHA256).
 * This guarantees seamless authentication in serverless Netlify Functions across
 * multi-container environments and cold starts.
 */
function createSignedToken(): string {
  const payload = {
    role: 'admin',
    iat: Date.now(),
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
    nonce: crypto.randomBytes(16).toString('hex'),
  };
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = crypto.createHmac('sha256', SESSION_SECRET).update(body).digest('base64url');
  return `${body}.${sig}`;
}

/**
 * Verifies admin password using constant-time comparison to prevent timing attacks.
 */
export function verifyAdminPassword(password: string): { success: boolean; token?: string; error?: string } {
  try {
    if (!password || typeof password !== 'string') {
      return { success: false, error: 'Password is required' };
    }

    const cleanInput = password.trim();
    const configuredMaster = (process.env.ADMIN_PASSWORD || INITIAL_ADMIN_PASSWORD).trim();

    // Constant-time check against configured master password
    const inputBuf = Buffer.from(cleanInput);
    const masterBuf = Buffer.from(configuredMaster);
    const isDirectMasterMatch =
      inputBuf.length === masterBuf.length && crypto.timingSafeEqual(inputBuf, masterBuf);

    if (isDirectMasterMatch) {
      const token = createSignedToken();
      recordSession(token);
      return { success: true, token };
    }

    // Check against hashed auth record (if password was changed by owner)
    const auth = getAuthRecord();
    const candidateHash = hashPassword(cleanInput, auth.salt);
    const hashBuf = Buffer.from(auth.hash, 'hex');
    const candidateBuf = Buffer.from(candidateHash, 'hex');

    if (hashBuf.length === candidateBuf.length && crypto.timingSafeEqual(hashBuf, candidateBuf)) {
      const token = createSignedToken();
      recordSession(token);
      return { success: true, token };
    }

    return { success: false, error: 'Incorrect admin password' };
  } catch (err: any) {
    console.error('[DILSY Auth] Password verification error:', err);
    return { success: false, error: err.message || 'Authentication error' };
  }
}

function recordSession(token: string): void {
  try {
    const sessionsFile = getSessionsFilePath();
    let sessions: SessionRecord[] = [];
    if (fs.existsSync(sessionsFile)) {
      try {
        sessions = JSON.parse(fs.readFileSync(sessionsFile, 'utf-8'));
      } catch {
        sessions = [];
      }
    }
    const now = new Date();
    sessions.push({
      token,
      createdAt: now.toISOString(),
      expiresAt: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    });
    fs.writeFileSync(sessionsFile, JSON.stringify(sessions.slice(-100), null, 2), 'utf-8');
  } catch {
    // Non-fatal for stateless tokens
  }
}

/**
 * Validates a session token. Supports both cryptographically signed tokens
 * and legacy tokens recorded in session store.
 */
export function isValidToken(token: string): boolean {
  if (!token || typeof token !== 'string') return false;

  if (inMemoryRevokedTokens.has(token)) return false;

  // 1. Verify HMAC-signed stateless token
  if (token.includes('.')) {
    const parts = token.split('.');
    if (parts.length === 2) {
      const [body, sig] = parts;
      const expectedSig = crypto.createHmac('sha256', SESSION_SECRET).update(body).digest('base64url');
      const sigBuf = Buffer.from(sig);
      const expectedBuf = Buffer.from(expectedSig);
      if (sigBuf.length === expectedBuf.length && crypto.timingSafeEqual(sigBuf, expectedBuf)) {
        try {
          const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf-8'));
          if (payload.role === 'admin' && payload.exp && payload.exp > Date.now()) {
            return true;
          }
        } catch {
          return false;
        }
      }
    }
  }

  // 2. Check sessions.json fallback
  try {
    const sessionsFile = getSessionsFilePath();
    if (fs.existsSync(sessionsFile)) {
      const raw = fs.readFileSync(sessionsFile, 'utf-8');
      const sessions: SessionRecord[] = JSON.parse(raw);
      const now = new Date().toISOString();
      return sessions.some((s) => s.token === token && s.expiresAt > now);
    }
  } catch {
    // ignore
  }

  return false;
}

/**
 * Revokes a session token on logout
 */
export function revokeToken(token: string): void {
  if (!token) return;
  inMemoryRevokedTokens.add(token);

  try {
    const sessionsFile = getSessionsFilePath();
    if (fs.existsSync(sessionsFile)) {
      const raw = fs.readFileSync(sessionsFile, 'utf-8');
      const sessions: SessionRecord[] = JSON.parse(raw);
      const updated = sessions.filter((s) => s.token !== token);
      fs.writeFileSync(sessionsFile, JSON.stringify(updated, null, 2), 'utf-8');
    }
  } catch {
    // ignore
  }
}

/**
 * Allows the owner to change their admin password securely
 */
export function changeAdminPassword(
  currentPassword: string,
  newPassword: string
): { success: boolean; error?: string } {
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

  inMemoryAuthRecord = record;

  try {
    fs.writeFileSync(getAuthFilePath(), JSON.stringify(record, null, 2), 'utf-8');
  } catch (err) {
    console.warn('[DILSY Auth] Could not persist new password to disk:', err);
  }

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
