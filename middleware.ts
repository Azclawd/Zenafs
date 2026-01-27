import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        request.cookies.set(name, value)
                    )
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    const {
        data: { user },
    } = await supabase.auth.getUser()

    // Protect dashboard routes - just check auth, no role queries
    if (request.nextUrl.pathname.startsWith('/dashboard')) {
        if (!user) {
            const url = request.nextUrl.clone()
            url.pathname = '/login'
            return NextResponse.redirect(url)
        }

        // Get role from user metadata (no database query!)
        const role = user.user_metadata?.role || user.app_metadata?.role
        const path = request.nextUrl.pathname

        // Role-based route protection using metadata
        if (role) {
            if (path.startsWith('/dashboard/therapist') && role !== 'therapist') {
                return NextResponse.redirect(new URL('/dashboard/client', request.url))
            }

            if (path.startsWith('/dashboard/client') && role !== 'client') {
                return NextResponse.redirect(new URL('/dashboard/therapist', request.url))
            }
        }
    }

    // Redirect logged-in users away from auth pages
    if (user && (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/signup')) {
        const role = user.user_metadata?.role || user.app_metadata?.role
        if (role === 'therapist') {
            return NextResponse.redirect(new URL('/dashboard/therapist', request.url))
        } else {
            return NextResponse.redirect(new URL('/dashboard/client', request.url))
        }
    }

    return supabaseResponse
}

// Much narrower matcher - only run on specific routes
export const config = {
    matcher: ['/dashboard/:path*', '/login', '/signup'],
}
