import type { APIRoute } from 'astro';
import { createSupabaseServerClientFromRequest } from '../../../lib/supabase';

export const GET: APIRoute = async ({ request }) => {
  const responseHeaders = new Headers();
  const supabase = createSupabaseServerClientFromRequest(request, responseHeaders);

  await supabase.auth.signOut();

  responseHeaders.set('Location', '/');
  return new Response(null, { status: 302, headers: responseHeaders });
};
