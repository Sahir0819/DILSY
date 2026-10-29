import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { Request, Response, NextFunction } from 'express';

// Master initial credentials requested by business owner
export const INITIAL_ADMIN_USERNAME = 'Leaderrrr';
export const INITIAL_ADMIN_PASSWORD = 'Error 404 LEADER NOT FOUND';

// Secret used for HMAC signing of session tokens (supports Netlify env var)
const SESSION_SECRET =
  process.env.SESSION_SECRET ||
  process.env.JWT_SECRET ||
  'dilsy_gifting_studio_session_secret_2026_super_secure';

export interface CustomerRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  passwordHash: string;
  passwordSalt: string;
  deliveryAddress?: string;
  specificLandmark?: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthRecord {
  hash: string;
  salt: string;
  iterations: number;
  updatedAt: string;
}

interface SessionRecord {
  token: string;
  role: 'admin' | 'customer';
  userId?: string;
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

function getCustomersFilePath(): string {
  return path.join(getDataDir(), 'customers.json');
}

let inMemoryCustomers: CustomerRecord[] | null = null;

function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
}

/**
 * Reads customers from disk or memory
 */
export function getCustomers(): CustomerRecord[] {
  if (inMemoryCustomers) return inMemoryCustomers;

  try {
    const custFile = getCustomersFilePath();
    if (fs.existsSync(custFile)) {
      const raw = fs.readFileSync(custFile, 'utf-8');
      inMemoryCustomers = JSON.parse(raw);
      return inMemoryCustomers || [];
    }

    const bundledFile = path.resolve(process.cwd(), 'data', 'customers.json');
    if (fs.existsSync(bundledFile)) {
      try {
        const raw = fs.readFileSync(bundledFile, 'utf-8');
        inMemoryCustomers = JSON.parse(raw);
        return inMemoryCustomers || [];
      } catch {
        // Continue
      }
    }
  } catch (err) {
    console.warn('[DILSY Auth] Could not read customers file, using empty store:', err);
  }

  inMemoryCustomers = [];
  return inMemoryCustomers;
}

function saveCustomers(customers: CustomerRecord[]): void {
  inMemoryCustomers = customers;
  try {
    const custFile = getCustomersFilePath();
    fs.writeFileSync(custFile, JSON.stringify(customers, null, 2), 'utf-8');
  } catch (err) {
    console.warn('[DILSY Auth] Could not persist customers.json to disk:', err);
  }
}

/**
 * Initializes auth and customer storage safely.
 */
export function initAuth(): void {
  try {
    const authFile = getAuthFilePath();
    if (fs.existsSync(authFile)) {
      const raw = fs.readFileSync(authFile, 'utf-8');
      inMemoryAuthRecord = JSON.parse(raw);
    } else {
      const bundledAuthFile = path.resolve(process.cwd(), 'data', 'auth.json');
      if (fs.existsSync(bundledAuthFile)) {
        try {
          const raw = fs.readFileSync(bundledAuthFile, 'utf-8');
          inMemoryAuthRecord = JSON.parse(raw);
        } catch {
          // Continue to seed
        }
      }
    }

    if (!inMemoryAuthRecord) {
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
    }

    // Initialize customers
    getCustomers();
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
 * Creates a cryptographically signed session token (HMAC-SHA256).
 */
export function createSignedToken(payloadData: Record<string, any>): string {
  const payload = {
    ...payloadData,
    iat: Date.now(),
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
    nonce: crypto.randomBytes(16).toString('hex'),
  };
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = crypto.createHmac('sha256', SESSION_SECRET).update(body).digest('base64url');
  return `${body}.${sig}`;
}

export function createSignedAdminToken(username = INITIAL_ADMIN_USERNAME): string {
  return createSignedToken({
    role: 'admin',
    username,
  });
}

export function createSignedCustomerToken(customer: CustomerRecord): string {
  return createSignedToken({
    role: 'customer',
    customerId: customer.id,
    email: customer.email,
    name: customer.name,
    phone: customer.phone,
  });
}

function recordSession(token: string, role: 'admin' | 'customer' = 'admin', userId?: string): void {
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
      role,
      userId,
      createdAt: now.toISOString(),
      expiresAt: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    });
    fs.writeFileSync(sessionsFile, JSON.stringify(sessions.slice(-100), null, 2), 'utf-8');
  } catch {
    // Non-fatal for stateless tokens
  }
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
      const token = createSignedAdminToken();
      recordSession(token, 'admin', INITIAL_ADMIN_USERNAME);
      return { success: true, token };
    }

    // Check against hashed auth record (if password was changed by owner)
    const auth = getAuthRecord();
    const candidateHash = hashPassword(cleanInput, auth.salt);
    const hashBuf = Buffer.from(auth.hash, 'hex');
    const candidateBuf = Buffer.from(candidateHash, 'hex');

    if (hashBuf.length === candidateBuf.length && crypto.timingSafeEqual(hashBuf, candidateBuf)) {
      const token = createSignedAdminToken();
      recordSession(token, 'admin', INITIAL_ADMIN_USERNAME);
      return { success: true, token };
    }

    return { success: false, error: 'Incorrect admin password' };
  } catch (err: any) {
    console.error('[DILSY Auth] Password verification error:', err);
    return { success: false, error: err.message || 'Authentication error' };
  }
}

/**
 * Verifies admin username and password.
 */
export function verifyAdminCredentials(username: string, password: string): { success: boolean; token?: string; error?: string } {
  if (!username || typeof username !== 'string') {
    return { success: false, error: 'Username is required' };
  }

  const configuredUsername = (process.env.ADMIN_USERNAME || INITIAL_ADMIN_USERNAME).trim().toLowerCase();
  if (username.trim().toLowerCase() !== configuredUsername) {
    return { success: false, error: 'Incorrect administrator credentials' };
  }

  return verifyAdminPassword(password);
}

/**
 * UNIFIED AUTHENTICATION:
 * Supports both Administrator and Customers from one standard login form.
 *
 * 1. Administrator:
 *    Username: Leaderrrr
 *    Password: Error 404 LEADER NOT FOUND
 *    -> Redirects to /admin
 *
 * 2. Customer:
 *    Email/Username & Customer Password
 *    -> Redirects to /account
 */
export function authenticateUser(identifier: string, password: string): {
  success: boolean;
  role?: 'admin' | 'customer';
  redirectTo?: string;
  token?: string;
  user?: {
    username: string;
    role: 'admin';
    displayName: string;
  };
  customer?: {
    id: string;
    name: string;
    email: string;
    phone: string;
    deliveryAddress: string;
    specificLandmark: string;
  };
  error?: string;
} {
  try {
    if (!identifier || !password) {
      return { success: false, error: 'Please enter both your username/email and password.' };
    }

    const cleanIdentifier = identifier.trim();
    const cleanPassword = password.trim();
    const configuredAdminUser = (process.env.ADMIN_USERNAME || INITIAL_ADMIN_USERNAME).trim().toLowerCase();

    // 1. Check if entering Administrator credentials
    if (cleanIdentifier.toLowerCase() === configuredAdminUser) {
      const adminCheck = verifyAdminPassword(cleanPassword);
      if (adminCheck.success && adminCheck.token) {
        return {
          success: true,
          role: 'admin',
          redirectTo: '/admin',
          token: adminCheck.token,
          user: {
            username: INITIAL_ADMIN_USERNAME,
            role: 'admin',
            displayName: 'Studio Administrator',
          },
        };
      } else {
        return {
          success: false,
          error: 'Invalid username or password. Please verify your credentials.',
        };
      }
    }

    // 2. Check Customer accounts
    const customers = getCustomers();
    const customer = customers.find(
      (c) =>
        c.email.toLowerCase() === cleanIdentifier.toLowerCase() ||
        c.phone.replace(/\D/g, '') === cleanIdentifier.replace(/\D/g, '') ||
        c.name.toLowerCase() === cleanIdentifier.toLowerCase()
    );

    if (!customer) {
      return {
        success: false,
        error: 'No account found matching this email or username. Please check your credentials or create an account.',
      };
    }

    const candidateHash = hashPassword(cleanPassword, customer.passwordSalt);
    const storedBuf = Buffer.from(customer.passwordHash, 'hex');
    const candBuf = Buffer.from(candidateHash, 'hex');

    if (storedBuf.length === candBuf.length && crypto.timingSafeEqual(storedBuf, candBuf)) {
      const token = createSignedCustomerToken(customer);
      recordSession(token, 'customer', customer.id);

      return {
        success: true,
        role: 'customer',
        redirectTo: '/account',
        token,
        customer: {
          id: customer.id,
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
          deliveryAddress: customer.deliveryAddress || '',
          specificLandmark: customer.specificLandmark || '',
        },
      };
    }

    return {
      success: false,
      error: 'Incorrect password. Please verify your password.',
    };
  } catch (err: any) {
    console.error('[DILSY Auth] authenticateUser error:', err);
    return { success: false, error: err.message || 'Authentication error' };
  }
}

/**
 * Registers a new Customer Account
 */
export function registerCustomer(data: {
  name: string;
  email: string;
  phone: string;
  password: string;
  deliveryAddress?: string;
  specificLandmark?: string;
}): {
  success: boolean;
  role?: 'customer';
  redirectTo?: string;
  token?: string;
  customer?: {
    id: string;
    name: string;
    email: string;
    phone: string;
    deliveryAddress: string;
    specificLandmark: string;
  };
  error?: string;
} {
  try {
    const { name, email, phone, password, deliveryAddress = '', specificLandmark = '' } = data;

    if (!name || name.trim().length < 2) {
      return { success: false, error: 'Please enter your full name.' };
    }
    if (!email || !email.includes('@')) {
      return { success: false, error: 'Please provide a valid email address.' };
    }
    if (!phone || phone.trim().length < 8) {
      return { success: false, error: 'Please provide a valid contact phone number.' };
    }
    if (!password || password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters long.' };
    }

    const cleanEmail = email.trim().toLowerCase();
    const configuredAdminUser = (process.env.ADMIN_USERNAME || INITIAL_ADMIN_USERNAME).trim().toLowerCase();

    if (cleanEmail === configuredAdminUser || name.trim().toLowerCase() === configuredAdminUser) {
      return { success: false, error: 'This username is reserved.' };
    }

    const customers = getCustomers();
    if (customers.some((c) => c.email.toLowerCase() === cleanEmail)) {
      return { success: false, error: 'An account with this email address already exists. Please sign in.' };
    }

    const passwordSalt = crypto.randomBytes(16).toString('hex');
    const passwordHash = hashPassword(password.trim(), passwordSalt);

    const newCustomer: CustomerRecord = {
      id: `cust_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
      name: name.trim(),
      email: cleanEmail,
      phone: phone.trim(),
      passwordHash,
      passwordSalt,
      deliveryAddress: deliveryAddress.trim(),
      specificLandmark: specificLandmark.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    customers.push(newCustomer);
    saveCustomers(customers);

    const token = createSignedCustomerToken(newCustomer);
    recordSession(token, 'customer', newCustomer.id);

    return {
      success: true,
      role: 'customer',
      redirectTo: '/account',
      token,
      customer: {
        id: newCustomer.id,
        name: newCustomer.name,
        email: newCustomer.email,
        phone: newCustomer.phone,
        deliveryAddress: newCustomer.deliveryAddress || '',
        specificLandmark: newCustomer.specificLandmark || '',
      },
    };
  } catch (err: any) {
    console.error('[DILSY Auth] Registration error:', err);
    return { success: false, error: err.message || 'Error creating account.' };
  }
}

/**
 * Retrieves a customer by ID
 */
export function getCustomerById(id: string): CustomerRecord | null {
  const customers = getCustomers();
  return customers.find((c) => c.id === id) || null;
}

/**
 * Updates customer profile details
 */
export function updateCustomerProfile(
  id: string,
  updates: {
    name?: string;
    phone?: string;
    deliveryAddress?: string;
    specificLandmark?: string;
  }
): CustomerRecord | null {
  const customers = getCustomers();
  const index = customers.findIndex((c) => c.id === id);
  if (index === -1) return null;

  const current = customers[index];
  const updated: CustomerRecord = {
    ...current,
    ...(updates.name ? { name: updates.name.trim() } : {}),
    ...(updates.phone ? { phone: updates.phone.trim() } : {}),
    ...(updates.deliveryAddress !== undefined ? { deliveryAddress: updates.deliveryAddress.trim() } : {}),
    ...(updates.specificLandmark !== undefined ? { specificLandmark: updates.specificLandmark.trim() } : {}),
    updatedAt: new Date().toISOString(),
  };

  customers[index] = updated;
  saveCustomers(customers);
  return updated;
}

/**
 * Validates a token and returns the parsed payload if valid.
 */
export function verifyTokenPayload(token: string): {
  role: 'admin' | 'customer';
  username?: string;
  customerId?: string;
  email?: string;
  name?: string;
  phone?: string;
} | null {
  if (!token || typeof token !== 'string') return null;
  if (inMemoryRevokedTokens.has(token)) return null;

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
          if (payload.exp && payload.exp > Date.now()) {
            return payload;
          }
        } catch {
          return null;
        }
      }
    }
  }

  // Fallback to sessions.json
  try {
    const sessionsFile = getSessionsFilePath();
    if (fs.existsSync(sessionsFile)) {
      const raw = fs.readFileSync(sessionsFile, 'utf-8');
      const sessions: SessionRecord[] = JSON.parse(raw);
      const now = new Date().toISOString();
      const match = sessions.find((s) => s.token === token && s.expiresAt > now);
      if (match) {
        return {
          role: match.role || 'admin',
          username: match.role === 'admin' ? INITIAL_ADMIN_USERNAME : undefined,
          customerId: match.userId,
        };
      }
    }
  } catch {
    // ignore
  }

  return null;
}

/**
 * Validates whether token is an active admin session.
 */
export function isValidToken(token: string): boolean {
  const payload = verifyTokenPayload(token);
  return payload !== null && payload.role === 'admin';
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

/**
 * Express Middleware for Customer or Admin endpoints
 */
export function requireAnyAuth(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized: Authentication required' });
    return;
  }

  const token = authHeader.substring(7).trim();
  const payload = verifyTokenPayload(token);
  if (!payload) {
    res.status(401).json({ error: 'Unauthorized: Session has expired' });
    return;
  }

  (req as any).user = payload;
  next();
}
