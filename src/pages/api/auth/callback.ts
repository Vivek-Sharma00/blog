import type { APIRoute } from 'astro';
import { createSupabaseServerClientFromRequest } from '../../../lib/supabase';

export const GET: APIRoute = async ({ request }) => {
  const responseHeaders = new Headers();
  const supabase = createSupabaseServerClientFromRequest(request, responseHeaders);

  const url = new URL(request.url);
  const code = url.searchParams.get('code');

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      const redirectUrl = new URL('/login', url.origin);
      redirectUrl.searchParams.set('error', encodeURIComponent(error.message));
      return Response.redirect(redirectUrl.toString(), 302);
    }
  }

  // Redirect home on success
  responseHeaders.set('Location', '/');
  return new Response(null, { status: 302, headers: responseHeaders });
};
