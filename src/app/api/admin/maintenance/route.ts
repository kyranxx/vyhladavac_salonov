import { NextRequest, NextResponse } from 'next/server';

// Admin API to control maintenance mode
export async function POST(request: NextRequest) {
    try {
        const { enabled } = await request.json();

        // Create response that sets the maintenance mode cookie
        const response = NextResponse.json({ success: true, enabled });

        if (enabled) {
            // Set maintenance mode cookie for 1 year
            response.cookies.set('maintenance_mode', 'true', {
                path: '/',
                maxAge: 31536000, // 1 year
                httpOnly: false, // Allow client to read it
                sameSite: 'lax'
            });
        } else {
            // Delete the cookie
            response.cookies.delete('maintenance_mode');
        }

        return response;
    } catch (error) {
        console.error('Error setting maintenance mode:', error);
        return NextResponse.json({ error: 'Failed to set maintenance mode' }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    const maintenanceModeCookie = request.cookies.get('maintenance_mode');
    const isMaintenanceMode = maintenanceModeCookie?.value === 'true';

    return NextResponse.json({ enabled: isMaintenanceMode });
}
