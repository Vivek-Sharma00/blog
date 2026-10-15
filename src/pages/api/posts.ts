import type { APIRoute } from 'astro';
import { createSupabaseServerClientFromRequest } from '../../lib/supabase';

export const GET: APIRoute = async ({ request }) => {
  const responseHeaders = new Headers({ 'Content-Type': 'application/json' });
  const supabase = createSupabaseServerClientFromRequest(request, responseHeaders);

  const { data: posts, error } = await supabase
    .from('posts')
    .select('id, title, slug, summary, created_at, author_id')
    .eq('published', true)
    .order('created_at', { ascending: false });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: responseHeaders });
  }

  return new Response(JSON.stringify({ posts }), { status: 200, headers: responseHeaders });
};

export const POST: APIRoute = async ({ request }) => {
  const responseHeaders = new Headers({ 'Content-Type': 'application/json' });
  const supabase = createSupabaseServerClientFromRequest(request, responseHeaders);

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: responseHeaders });
  }

  // Check admin role
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') {
    return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers: responseHeaders });
  }

  let body: Record<string, string>;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), { status: 400, headers: responseHeaders });
  }

  const { title, slug, summary, content } = body;
  if (!title || !slug || !summary || !content) {
    return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400, headers: responseHeaders });
  }

  const { data: post, error } = await supabase.from('posts').insert({
    title, slug, summary, content, published: true, author_id: user.id,
  }).select().single();

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: responseHeaders });
  }

  return new Response(JSON.stringify({ post }), { status: 201, headers: responseHeaders });
};
