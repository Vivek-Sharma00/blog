import { createClient } from '@supabase/supabase-js';
import { createServerClient, parseCookieHeader, serializeCookieHeader } from '@supabase/ssr';
import type { AstroCookies } from 'astro';

const supabaseUrl = import.meta.env.SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.SUPABASE_ANON_KEY as string;
const supabaseServiceKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY as string;

if (!supabaseUrl || supabaseUrl === 'https://placeholder.supabase.co') {
  console.warn(
    '\n⚠️  [SoloDev Blog] Supabase credentials are not configured.\n' +
    '   Copy .env.example → .env and fill in your SUPABASE_URL, SUPABASE_ANON_KEY, and SUPABASE_SERVICE_ROLE_KEY.\n' +
    '   Get these from: https://supabase.com/dashboard → Project Settings → API\n'
  );
}

/** Browser / public anon client */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/** Admin client — bypasses RLS. ONLY use server-side. */
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

/**
 * Server-side cookie-aware client for use inside Astro pages / endpoints.
 * Reads and writes cookies automatically via @supabase/ssr.
 */
export function createSupabaseServerClient(cookies: AstroCookies) {
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return parseCookieHeader(cookies.toString() ?? '');
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          cookies.set(name, value, options);
        });
      },
    },
  });
}

/**
 * Helper to read cookies from a raw Request header string (for API routes).
 */
export function createSupabaseServerClientFromRequest(
  request: Request,
  responseHeaders: Headers
) {
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return parseCookieHeader(request.headers.get('Cookie') ?? '');
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          responseHeaders.append('Set-Cookie', serializeCookieHeader(name, value, options));
        });
      },
    },
  });
}

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          role: string;
          created_at: string;
        };
      };
      posts: {
        Row: {
          id: string;
          title: string;
          slug: string;
          summary: string;
          content: string;
          published: boolean;
          author_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          summary: string;
          content: string;
          published?: boolean;
          author_id: string;
          created_at?: string;
        };
      };
      comments: {
        Row: {
          id: string;
          post_id: string;
          user_id: string;
          content: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          post_id: string;
          user_id: string;
          content: string;
        };
      };
      likes: {
        Row: {
          id: string;
          post_id: string;
          user_id: string;
        };
        Insert: {
          id?: string;
          post_id: string;
          user_id: string;
        };
      };
    };
  };
};
