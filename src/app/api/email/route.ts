import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// Email notification API for salon status changes
// Uses Resend for transactional emails

interface EmailPayload {
    to: string;
    subject: string;
    html: string;
    type: 'salon_approved' | 'salon_rejected' | 'salon_pending' | 'welcome' | 'subscription_activated' | 'subscription_cancelled';
}

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://vyhladavacsalonov.vercel.app';
const FROM_EMAIL = 'Register salónov <noreply@vyhladavacsalonov.sk>';
const ADMIN_EMAIL = 'blanarikdaniel@gmail.com';

const emailTemplates = {
    salon_approved: {
        subject: '✅ Váš salón bol schválený - Register salónov',
        html: (salonName: string) => `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #faf8f5;">
                <div style="background: linear-gradient(135deg, #c19a6b 0%, #a67c4a 100%); padding: 20px; border-radius: 12px 12px 0 0;">
                    <h1 style="color: white; margin: 0; font-size: 24px;">✅ Gratulujeme!</h1>
                </div>
                <div style="background: white; padding: 24px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                    <p style="font-size: 16px; color: #374151;">Váš salón <strong style="color: #c19a6b;">${salonName}</strong> bol úspešne schválený.</p>
                    <p style="color: #6b7280;">Váš salón je teraz viditeľný vo vyhľadávaní a zákazníci vás môžu nájsť.</p>
                    <a href="${APP_URL}/dashboard" 
                       style="display: inline-block; padding: 14px 28px; background: linear-gradient(135deg, #c19a6b 0%, #a67c4a 100%); color: white; text-decoration: none; border-radius: 8px; margin-top: 16px; font-weight: 600;">
                        Prejsť na Dashboard
                    </a>
                    <hr style="margin: 24px 0; border: none; border-top: 1px solid #e5e7eb;">
                    <p style="color: #6b7280; font-size: 14px;">
                        💡 <strong>Tip:</strong> Chcete ešte lepšiu viditeľnosť? <a href="${APP_URL}/dashboard/predplatne" style="color: #c19a6b;">Prejdite na Premium plan!</a>
                    </p>
                </div>
            </div>
        `
    },
    salon_rejected: {
        subject: '❌ Váš salón nebol schválený - Register salónov',
        html: (salonName: string, reason?: string) => `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #faf8f5;">
                <div style="background: #dc2626; padding: 20px; border-radius: 12px 12px 0 0;">
                    <h1 style="color: white; margin: 0; font-size: 24px;">Salón nebol schválený</h1>
                </div>
                <div style="background: white; padding: 24px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                    <p style="font-size: 16px; color: #374151;">Ľutujeme, ale váš salón <strong>${salonName}</strong> nebol schválený.</p>
                    ${reason ? `<p style="background: #fef2f2; border-left: 4px solid #dc2626; padding: 12px; color: #991b1b;"><strong>Dôvod:</strong> ${reason}</p>` : ''}
                    <p style="color: #6b7280;">Časté dôvody zamietnutia:</p>
                    <ul style="color: #6b7280;">
                        <li>Nekompletné informácie</li>
                        <li>Nereálne alebo nepravdivé údaje</li>
                        <li>Duplikátny záznam</li>
                        <li>Nevhodný obsah</li>
                    </ul>
                    <p style="color: #374151;">Prosím, skontrolujte a upravte údaje o salóne a skúste to znova.</p>
                    <a href="${APP_URL}/dashboard/moj-salon" 
                       style="display: inline-block; padding: 14px 28px; background: linear-gradient(135deg, #c19a6b 0%, #a67c4a 100%); color: white; text-decoration: none; border-radius: 8px; margin-top: 16px; font-weight: 600;">
                        Upraviť salón
                    </a>
                </div>
            </div>
        `
    },
    welcome: {
        subject: '👋 Vitajte na Register salónov!',
        html: (userName: string) => `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #faf8f5;">
                <div style="background: linear-gradient(135deg, #c19a6b 0%, #a67c4a 100%); padding: 20px; border-radius: 12px 12px 0 0;">
                    <h1 style="color: white; margin: 0; font-size: 24px;">👋 Vitajte, ${userName}!</h1>
                </div>
                <div style="background: white; padding: 24px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                    <p style="font-size: 16px; color: #374151;">Ďakujeme za registráciu na Register salónov - najväčší katalóg salónov krásy na Slovensku.</p>
                    <p style="color: #6b7280;"><strong>Teraz môžete:</strong></p>
                    <ul style="color: #374151;">
                        <li>✅ Zaregistrovať váš salón zadarmo</li>
                        <li>📸 Pridať fotografie a služby</li>
                        <li>👥 Získavať nových zákazníkov</li>
                        <li>📊 Sledovať štatistiky návštevnosti</li>
                    </ul>
                    <a href="${APP_URL}/dashboard/moj-salon" 
                       style="display: inline-block; padding: 14px 28px; background: linear-gradient(135deg, #c19a6b 0%, #a67c4a 100%); color: white; text-decoration: none; border-radius: 8px; margin-top: 16px; font-weight: 600;">
                        Zaregistrovať salón
                    </a>
                </div>
            </div>
        `
    },
    subscription_activated: {
        subject: '🎉 Premium predplatné aktivované - Register salónov',
        html: (salonName: string, planName?: string) => `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #faf8f5;">
                <div style="background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); padding: 20px; border-radius: 12px 12px 0 0;">
                    <h1 style="color: white; margin: 0; font-size: 24px;">🎉 ${planName || 'Premium'} aktivované!</h1>
                </div>
                <div style="background: white; padding: 24px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                    <p style="font-size: 16px; color: #374151;">Váš salón <strong style="color: #c19a6b;">${salonName}</strong> má teraz aktívne predplatné.</p>
                    <p style="color: #6b7280;">Teraz máte prístup k:</p>
                    <ul style="color: #374151;">
                        <li>📸 Neobmedzené fotografie</li>
                        <li>📊 Detailné štatistiky</li>
                        <li>🔗 Odkaz na web a sociálne siete</li>
                        <li>⭐ Prioritné zobrazenie vo výsledkoch</li>
                    </ul>
                    <a href="${APP_URL}/dashboard" 
                       style="display: inline-block; padding: 14px 28px; background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); color: white; text-decoration: none; border-radius: 8px; margin-top: 16px; font-weight: 600;">
                        Prejsť na Dashboard
                    </a>
                </div>
            </div>
        `
    },
    subscription_cancelled: {
        subject: '⚠️ Predplatné zrušené - Register salónov',
        html: (salonName: string, endDate?: string) => `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #faf8f5;">
                <div style="background: #f59e0b; padding: 20px; border-radius: 12px 12px 0 0;">
                    <h1 style="color: white; margin: 0; font-size: 24px;">Predplatné bude ukončené</h1>
                </div>
                <div style="background: white; padding: 24px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                    <p style="font-size: 16px; color: #374151;">Vaše predplatné pre <strong>${salonName}</strong> bolo zrušené.</p>
                    ${endDate ? `<p style="color: #6b7280;">Prístup k prémiovým funkciám zostáva aktívny do: <strong>${endDate}</strong></p>` : ''}
                    <p style="color: #6b7280;">Po tomto dátume sa váš salón vráti na základný (free) plán.</p>
                    <a href="${APP_URL}/dashboard/predplatne" 
                       style="display: inline-block; padding: 14px 28px; background: linear-gradient(135deg, #c19a6b 0%, #a67c4a 100%); color: white; text-decoration: none; border-radius: 8px; margin-top: 16px; font-weight: 600;">
                        Obnoviť predplatné
                    </a>
                </div>
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

        // Build HTML based on template type
        let html: string;
        if (type === 'salon_rejected') {
            html = template.html(data?.salonName || '', data?.reason);
        } else if (type === 'subscription_activated') {
            html = template.html(data?.salonName || '', data?.planName);
        } else if (type === 'subscription_cancelled') {
            html = template.html(data?.salonName || '', data?.endDate);
        } else {
            html = template.html(data?.salonName || data?.userName || '');
        }

        const email: EmailPayload = {
            to,
            subject: template.subject,
            html,
            type
        };

        // Check if Resend is configured
        const resendApiKey = process.env.RESEND_API_KEY;

        if (!resendApiKey) {
            // Log the email that would have been sent
            console.log('📧 Email notification (not sent - RESEND_API_KEY not configured):', {
                to,
                type,
                subject: email.subject
            });

            return NextResponse.json({
                success: true,
                message: 'Email logged (RESEND_API_KEY not configured)',
                configured: false
            });
        }

        // Send email via Resend
        const resend = new Resend(resendApiKey);

        const { data: sendResult, error } = await resend.emails.send({
            from: FROM_EMAIL,
            to: email.to,
            subject: email.subject,
            html: email.html,
        });

        if (error) {
            console.error('Resend error:', error);
            return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
        }

        console.log('📧 Email sent via Resend:', { id: sendResult?.id, to, type, subject: email.subject });

        // If notifyAdmin is true, also send to admin email
        if (notifyAdmin && ADMIN_EMAIL) {
            try {
                await resend.emails.send({
                    from: FROM_EMAIL,
                    to: ADMIN_EMAIL,
                    subject: `[Admin] ${email.subject}`,
                    html: email.html,
                });
                console.log('📧 Admin notification sent:', { to: ADMIN_EMAIL, type });
            } catch (adminError) {
                console.error('Failed to send admin notification:', adminError);
                // Don't fail the main request if admin notification fails
            }
        }

        return NextResponse.json({
            success: true,
            message: 'Email sent',
            emailId: sendResult?.id,
            configured: true
        });
    } catch (error) {
        console.error('Error sending email:', error);
        return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }
}

