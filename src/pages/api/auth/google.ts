import type { APIRoute } from 'astro';
import { createSupabaseServerClientFromRequest } from '../../../lib/supabase';

export const POST: APIRoute = async ({ request }) => {
  const responseHeaders = new Headers({ 'Content-Type': 'application/json' });
  const supabase = createSupabaseServerClientFromRequest(request, responseHeaders);

  const siteUrl = import.meta.env.SITE ?? 'http://localhost:4321';
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${siteUrl}/api/auth/callback`,
    },
  });

  if (error || !data.url) {
    return new Response(
      JSON.stringify({ error: error?.message ?? 'Google OAuth is not configured.' }),
      { status: 500, headers: responseHeaders }
    );
  }

  return new Response(JSON.stringify({ url: data.url }), { status: 200, headers: responseHeaders });
};
