import { verifyAdminPassword } from '../../src/server/auth';

interface HandlerEvent {
  httpMethod: string;
  path: string;
  headers: Record<string, string>;
  body: string | null;
}

interface HandlerResponse {
  statusCode: number;
  headers: Record<string, string>;
  body: string;
}

const COMMON_HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

export const handler = async (event: HandlerEvent): Promise<HandlerResponse> => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: COMMON_HEADERS,
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: COMMON_HEADERS,
      body: JSON.stringify({ error: `Method ${event.httpMethod} not allowed. Please use POST.` }),
    };
  }

  try {
    if (!event.body) {
      return {
        statusCode: 400,
        headers: COMMON_HEADERS,
        body: JSON.stringify({ error: 'Request body is empty. Password is required.' }),
      };
    }

    let payload: any;
    try {
      payload = JSON.parse(event.body);
    } catch {
      return {
        statusCode: 400,
        headers: COMMON_HEADERS,
        body: JSON.stringify({ error: 'Malformed JSON payload in request body.' }),
      };
    }

    const { password } = payload;
    if (!password) {
      return {
        statusCode: 400,
        headers: COMMON_HEADERS,
        body: JSON.stringify({ error: 'Password is required' }),
      };
    }

    const verification = verifyAdminPassword(password);
    if (!verification.success) {
      return {
        statusCode: 401,
        headers: COMMON_HEADERS,
        body: JSON.stringify({ error: verification.error || 'Incorrect admin password' }),
      };
    }

    return {
      statusCode: 200,
      headers: COMMON_HEADERS,
      body: JSON.stringify({
        success: true,
        token: verification.token,
        message: 'Welcome to DILSY Admin Studio',
      }),
    };
  } catch (err: any) {
    console.error('[Netlify admin-login function error]:', err);
    return {
      statusCode: 500,
      headers: COMMON_HEADERS,
      body: JSON.stringify({
        error: err.message || 'Internal authentication error on server',
      }),
    };
  }
};
