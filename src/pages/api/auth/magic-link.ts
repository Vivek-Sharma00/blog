import type { APIRoute } from 'astro';
import { createSupabaseServerClientFromRequest } from '../../../lib/supabase';

export const POST: APIRoute = async ({ request }) => {
  const responseHeaders = new Headers({ 'Content-Type': 'application/json' });
  const supabase = createSupabaseServerClientFromRequest(request, responseHeaders);

  let body: { email?: string };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400, headers: responseHeaders });
  }

  const { email } = body;
  if (!email || !email.includes('@')) {
    return new Response(JSON.stringify({ error: 'Valid email is required.' }), { status: 400, headers: responseHeaders });
  }

  const siteUrl = import.meta.env.SITE ?? 'http://localhost:4321';
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${siteUrl}/api/auth/callback`,
    },
  });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: responseHeaders });
  }

  return new Response(JSON.stringify({ ok: true }), { status: 200, headers: responseHeaders });
};
