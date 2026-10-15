import type { APIRoute } from 'astro';
import { createSupabaseServerClientFromRequest } from '../../lib/supabase';

export const POST: APIRoute = async ({ request }) => {
  const responseHeaders = new Headers({ 'Content-Type': 'application/json' });
  const supabase = createSupabaseServerClientFromRequest(request, responseHeaders);

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: responseHeaders });
  }

  let body: Record<string, string>;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400, headers: responseHeaders });
  }

  const { post_id } = body;
  if (!post_id) {
    return new Response(JSON.stringify({ error: 'post_id required' }), { status: 400, headers: responseHeaders });
  }

  // Check if already liked (idempotent)
  const { data: existing } = await supabase
    .from('likes')
    .select('id')
    .eq('post_id', post_id)
    .eq('user_id', user.id)
    .single();

  if (existing) {
    return new Response(JSON.stringify({ message: 'Already liked' }), { status: 200, headers: responseHeaders });
  }

  const { error } = await supabase.from('likes').insert({ post_id, user_id: user.id });
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: responseHeaders });
  }

  return new Response(JSON.stringify({ liked: true }), { status: 201, headers: responseHeaders });
};

export const DELETE: APIRoute = async ({ request }) => {
  const responseHeaders = new Headers({ 'Content-Type': 'application/json' });
  const supabase = createSupabaseServerClientFromRequest(request, responseHeaders);

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: responseHeaders });
  }

  let body: Record<string, string>;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400, headers: responseHeaders });
  }

  const { post_id } = body;
  if (!post_id) {
    return new Response(JSON.stringify({ error: 'post_id required' }), { status: 400, headers: responseHeaders });
  }

  const { error } = await supabase
    .from('likes')
    .delete()
    .eq('post_id', post_id)
    .eq('user_id', user.id);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: responseHeaders });
  }

  return new Response(JSON.stringify({ liked: false }), { status: 200, headers: responseHeaders });
};
