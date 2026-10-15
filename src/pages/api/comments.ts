import type { APIRoute } from 'astro';
import { createSupabaseServerClientFromRequest } from '../../lib/supabase';

export const POST: APIRoute = async ({ request }) => {
  const responseHeaders = new Headers({ 'Content-Type': 'application/json' });
  const supabase = createSupabaseServerClientFromRequest(request, responseHeaders);

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return new Response(JSON.stringify({ error: 'You must be signed in to comment.' }), {
      status: 401,
      headers: responseHeaders,
    });
  }

  let body: Record<string, string>;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), { status: 400, headers: responseHeaders });
  }

  const { post_id, content } = body;
  if (!post_id || !content?.trim()) {
    return new Response(JSON.stringify({ error: 'post_id and content are required.' }), {
      status: 400,
      headers: responseHeaders,
    });
  }

  if (content.trim().length > 2000) {
    return new Response(JSON.stringify({ error: 'Comment too long (max 2000 chars).' }), {
      status: 400,
      headers: responseHeaders,
    });
  }

  const { data: inserted, error } = await supabase
    .from('comments')
    .insert({ post_id, user_id: user.id, content: content.trim() })
    .select('id, content, created_at')
    .single();

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: responseHeaders });
  }

  return new Response(
    JSON.stringify({
      comment: { ...inserted, author_email: user.email },
    }),
    { status: 201, headers: responseHeaders }
  );
};

export const GET: APIRoute = async ({ request }) => {
  const responseHeaders = new Headers({ 'Content-Type': 'application/json' });
  const supabase = createSupabaseServerClientFromRequest(request, responseHeaders);

  const url = new URL(request.url);
  const post_id = url.searchParams.get('post_id');

  if (!post_id) {
    return new Response(JSON.stringify({ error: 'post_id query param required' }), {
      status: 400,
      headers: responseHeaders,
    });
  }

  const { data: comments, error } = await supabase
    .from('comments')
    .select('id, content, created_at, user_id, profiles(email)')
    .eq('post_id', post_id)
    .order('created_at', { ascending: true });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: responseHeaders });
  }

  return new Response(JSON.stringify({ comments }), { status: 200, headers: responseHeaders });
};
