import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isRetryableSupabaseError, logSupabaseError } from "./errors";
import { createSupabaseFetch } from "./fetch";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  // With Fluid compute, don't put this client in a global environment
  // variable. Always create a new one on each request.
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
      global: {
        fetch: createSupabaseFetch(),
      },
    },
  );

  let user: unknown = null;

  try {
    const { data, error } = await supabase.auth.getClaims();
    if (error) {
      if (isRetryableSupabaseError(error)) {
        logSupabaseError("middleware.getClaims", error);
        return supabaseResponse;
      }
      logSupabaseError("middleware.getClaims", error);
    } else {
      user = data?.claims ?? null;
    }
  } catch (error) {
    if (isRetryableSupabaseError(error)) {
      logSupabaseError("middleware.getClaims", error);
      return supabaseResponse;
    }
    logSupabaseError("middleware.getClaims", error);
  }

  if (
    !user &&
    !request.nextUrl.pathname.startsWith("/login") &&
    !request.nextUrl.pathname.startsWith("/auth")
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
