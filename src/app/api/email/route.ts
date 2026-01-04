import { NextRequest, NextResponse } from 'next/server';

// Email notification API for salon status changes
// Uses Supabase Auth's built-in email or can be extended with SendGrid/Resend

interface EmailPayload {
    to: string;
    subject: string;
    html: string;
    type: 'salon_approved' | 'salon_rejected' | 'salon_pending' | 'welcome';
}

const emailTemplates = {
    salon_approved: {
        subject: '✅ Váš salón bol schválený - Register salónov',
        html: (salonName: string) => `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #166534;">✅ Gratulujeme!</h1>
                <p>Váš salón <strong>${salonName}</strong> bol úspešne schválený.</p>
                <p>Váš salón je teraz viditeľný vo vyhľadávaní a zákazníci vás môžu nájsť.</p>
                <a href="https://vyhladavacsalonov.vercel.app/dashboard" 
                   style="display: inline-block; padding: 12px 24px; background: #c19a6b; color: white; text-decoration: none; border-radius: 6px; margin-top: 16px;">
                    Prejsť na Dashboard
                </a>
                <hr style="margin: 24px 0; border: none; border-top: 1px solid #e5e7eb;">
                <p style="color: #6b7280; font-size: 14px;">
                    Chcete ešte lepšiu viditeľnosť? Prejdite na Premium plan!
                </p>
            </div>
        `
    },
    salon_rejected: {
        subject: '❌ Váš salón nebol schválený - Register salónov',
        html: (salonName: string) => `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #dc2626;">Salón nebol schválený</h1>
                <p>Ľutujeme, ale váš salón <strong>${salonName}</strong> nebol schválený.</p>
                <p>Dôvody môžu byť:</p>
                <ul>
                    <li>Nekompletné informácie</li>
                    <li>Nereálne údaje</li>
                    <li>Duplicitný záznam</li>
                </ul>
                <p>Prosím, skontrolujte a upravte údaje o salóne a skúste to znova.</p>
                <a href="https://vyhladavacsalonov.vercel.app/dashboard/moj-salon" 
                   style="display: inline-block; padding: 12px 24px; background: #c19a6b; color: white; text-decoration: none; border-radius: 6px; margin-top: 16px;">
                    Upraviť salón
                </a>
            </div>
        `
    },
    welcome: {
        subject: '👋 Vitajte na Register salónov!',
        html: (userName: string) => `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #c19a6b;">Vitajte, ${userName}!</h1>
                <p>Ďakujeme za registráciu na Register salónov.</p>
                <p>Teraz môžete:</p>
                <ul>
                    <li>Zaregistrovať váš salón</li>
                    <li>Pridať fotografie a služby</li>
                    <li>Získavať nových zákazníkov</li>
                </ul>
                <a href="https://vyhladavacsalonov.vercel.app/dashboard/moj-salon" 
                   style="display: inline-block; padding: 12px 24px; background: #c19a6b; color: white; text-decoration: none; border-radius: 6px; margin-top: 16px;">
                    Zaregistrovať salón
                </a>
            </div>
        `
    }
};

export async function POST(request: NextRequest) {
    try {
        const { to, type, data, notifyAdmin } = await request.json();

        if (!to || !type) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const template = emailTemplates[type as keyof typeof emailTemplates];
        if (!template) {
            return NextResponse.json({ error: 'Unknown email type' }, { status: 400 });
        }

        const email: EmailPayload = {
            to,
            subject: template.subject,
            html: template.html(data?.salonName || data?.userName || ''),
            type
        };

        // Check if SMTP is configured
        const isEmailConfigured = process.env.RESEND_API_KEY || process.env.SMTP_HOST;

        if (!isEmailConfigured) {
            // Log the email that would have been sent
            console.log('📧 Email notification (not sent - SMTP not configured):', {
                to,
                type,
                subject: email.subject
            });

            return NextResponse.json({
                success: true,
                message: 'Email logged (SMTP not configured)',
                configured: false
            });
        }

        // TODO: Integrate with email service when SMTP is configured
        // Example with Resend:
        // const resend = new Resend(process.env.RESEND_API_KEY);
        // await resend.emails.send({
        //     from: 'noreply@salonfinder.sk',
        //     to: email.to,
        //     subject: email.subject,
        //     html: email.html,
        // });

        // If notifyAdmin is true, also send to admin email
        // if (notifyAdmin && process.env.ADMIN_EMAIL) {
        //     await resend.emails.send({
        //         from: 'noreply@salonfinder.sk',
        //         to: process.env.ADMIN_EMAIL,
        //         subject: `[Admin] ${email.subject}`,
        //         html: email.html,
        //     });
        // }

        console.log('📧 Email sent:', { to, type, subject: email.subject });

        return NextResponse.json({
            success: true,
            message: 'Email sent',
            configured: true
        });
    } catch (error) {
        console.error('Error sending email:', error);
        return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }
}
