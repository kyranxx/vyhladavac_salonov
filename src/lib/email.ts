import { Resend } from 'resend';

// Initialize Resend with API key from environment
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

interface EmailOptions {
    to: string;
    subject: string;
    html: string;
    from?: string;
}

export async function sendEmail(options: EmailOptions): Promise<{ success: boolean; error?: string }> {
    if (!resend) {
        console.log('[Email] Resend not configured - email would be sent to:', options.to);
        return { success: false, error: 'Email service not configured. Add RESEND_API_KEY to environment.' };
    }

    try {
        const { error } = await resend.emails.send({
            from: options.from || 'Register Salónov <noreply@registersalonov.sk>',
            to: options.to,
            subject: options.subject,
            html: options.html,
        });

        if (error) {
            console.error('[Email] Failed to send:', error);
            return { success: false, error: error.message };
        }

        return { success: true };
    } catch (err) {
        console.error('[Email] Exception:', err);
        return { success: false, error: 'Failed to send email' };
    }
}

// Email Templates
export const emailTemplates = {
    newSalonRegistration: (salonName: string, ownerEmail: string) => ({
        subject: `Nová registrácia salónu: ${salonName}`,
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <style>
                    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #B76E79 0%, #C19A6B 100%); color: white; padding: 30px; border-radius: 12px 12px 0 0; text-align: center; }
                    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 12px 12px; }
                    .button { display: inline-block; background: linear-gradient(135deg, #B76E79 0%, #C19A6B 100%); color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; margin-top: 20px; }
                    .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>📋 Nová registrácia salónu</h1>
                </div>
                <div class="content">
                    <p>Dobrý deň,</p>
                    <p>Bol zaregistrovaný nový salón, ktorý čaká na schválenie:</p>
                    <p><strong>Názov:</strong> ${salonName}</p>
                    <p><strong>Majiteľ:</strong> ${ownerEmail}</p>
                    <p>
                        <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://registersalonov.sk'}/admin/salony" class="button">
                            Prejsť do administrácie
                        </a>
                    </p>
                </div>
                <div class="footer">
                    <p>Register salónov – automatická notifikácia</p>
                </div>
            </body>
            </html>
        `
    }),

    salonApproved: (salonName: string) => ({
        subject: `Váš salón ${salonName} bol schválený! 🎉`,
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <style>
                    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; border-radius: 12px 12px 0 0; text-align: center; }
                    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 12px 12px; }
                    .button { display: inline-block; background: linear-gradient(135deg, #B76E79 0%, #C19A6B 100%); color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; margin-top: 20px; }
                    .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>✅ Salón schválený!</h1>
                </div>
                <div class="content">
                    <p>Dobrý deň,</p>
                    <p>S radosťou vám oznamujeme, že váš salón <strong>${salonName}</strong> bol úspešne schválený a je teraz viditeľný v našom katalógu.</p>
                    <p>Zákazníci vás teraz môžu nájsť a kontaktovať.</p>
                    <p>
                        <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://registersalonov.sk'}/dashboard/moj-salon" class="button">
                            Spravovať môj salón
                        </a>
                    </p>
                </div>
                <div class="footer">
                    <p>Register salónov – Váš partner v biznise</p>
                </div>
            </body>
            </html>
        `
    }),

    salonRejected: (salonName: string, reason: string) => ({
        subject: `Váš salón ${salonName} nebol schválený`,
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <style>
                    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 30px; border-radius: 12px 12px 0 0; text-align: center; }
                    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 12px 12px; }
                    .reason { background: #fef2f2; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0; }
                    .button { display: inline-block; background: linear-gradient(135deg, #B76E79 0%, #C19A6B 100%); color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; margin-top: 20px; }
                    .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>❌ Salón nebol schválený</h1>
                </div>
                <div class="content">
                    <p>Dobrý deň,</p>
                    <p>Ľutujeme, ale váš salón <strong>${salonName}</strong> nebol schválený z nasledujúceho dôvodu:</p>
                    <div class="reason">
                        <p>${reason}</p>
                    </div>
                    <p>Môžete upraviť informácie a odoslať žiadosť znova.</p>
                    <p>
                        <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://registersalonov.sk'}/dashboard/moj-salon" class="button">
                            Upraviť salón
                        </a>
                    </p>
                </div>
                <div class="footer">
                    <p>Register salónov</p>
                </div>
            </body>
            </html>
        `
    }),

    newSubscription: (salonName: string, planType: string, ownerEmail: string) => ({
        subject: `Nové predplatné: ${salonName} – ${planType}`,
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <style>
                    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 30px; border-radius: 12px 12px 0 0; text-align: center; }
                    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 12px 12px; }
                    .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>💳 Nové predplatné</h1>
                </div>
                <div class="content">
                    <p>Bolo zakúpené nové predplatné:</p>
                    <p><strong>Salón:</strong> ${salonName}</p>
                    <p><strong>Plán:</strong> ${planType}</p>
                    <p><strong>Majiteľ:</strong> ${ownerEmail}</p>
                </div>
                <div class="footer">
                    <p>Register salónov – automatická notifikácia</p>
                </div>
            </body>
            </html>
        `
    }),

    contactForm: (name: string, email: string, message: string) => ({
        subject: `Kontaktný formulár: ${name}`,
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <style>
                    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #B76E79 0%, #C19A6B 100%); color: white; padding: 30px; border-radius: 12px 12px 0 0; text-align: center; }
                    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 12px 12px; }
                    .message { background: white; border: 1px solid #e5e7eb; padding: 20px; border-radius: 8px; margin: 20px 0; }
                    .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>📧 Nová správa</h1>
                </div>
                <div class="content">
                    <p><strong>Od:</strong> ${name}</p>
                    <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                    <div class="message">
                        <p>${message.replace(/\n/g, '<br>')}</p>
                    </div>
                </div>
                <div class="footer">
                    <p>Register salónov – kontaktný formulár</p>
                </div>
            </body>
            </html>
        `
    }),
};
