# 📧 SUPABASE EMAIL TEMPLATES

Copy-paste these templates into your Supabase Dashboard:
Go to: https://supabase.com/dashboard → Your Project → Authentication → Email Templates

---

## 1. CONFIRM SIGNUP (Potvrdenie registrácie)

### Subject:
```
Potvrďte svoju registráciu | Salon Finder SK
```

### Body:
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, sans-serif; background-color: #f9fafb;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <tr>
      <td style="padding: 40px 30px; background: linear-gradient(135deg, #c19a6b 0%, #a67c4a 100%); text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px;">💇‍♀️ Salon Finder SK</h1>
        <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Nájdite salóny krásy na Slovensku</p>
      </td>
    </tr>
    <tr>
      <td style="padding: 40px 30px;">
        <h2 style="color: #1f2937; margin: 0 0 20px 0;">Vitajte v Salon Finder SK! 🎉</h2>
        <p style="color: #4b5563; line-height: 1.6; margin: 0 0 20px 0;">
          Ďakujeme za registráciu. Pre dokončenie a aktiváciu vášho účtu kliknite na tlačidlo nižšie:
        </p>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="text-align: center; padding: 20px 0;">
              <a href="{{ .ConfirmationURL }}" style="display: inline-block; padding: 14px 40px; background: linear-gradient(135deg, #c19a6b 0%, #a67c4a 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                ✓ Potvrdiť e-mail
              </a>
            </td>
          </tr>
        </table>
        <p style="color: #6b7280; font-size: 14px; line-height: 1.5; margin: 20px 0 0 0;">
          Ak ste sa neregistrovali na Salon Finder SK, môžete tento e-mail ignorovať.
        </p>
      </td>
    </tr>
    <tr>
      <td style="padding: 30px; background-color: #f9fafb; text-align: center; border-top: 1px solid #e5e7eb;">
        <p style="color: #9ca3af; font-size: 12px; margin: 0;">
          © 2024 Salon Finder SK | Všetky práva vyhradené<br>
          <a href="https://vyhladavac-salonov.vercel.app" style="color: #c19a6b;">vyhladavac-salonov.vercel.app</a>
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
```

---

## 2. RESET PASSWORD (Obnovenie hesla)

### Subject:
```
Obnovenie hesla | Salon Finder SK
```

### Body:
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, sans-serif; background-color: #f9fafb;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <tr>
      <td style="padding: 40px 30px; background: linear-gradient(135deg, #c19a6b 0%, #a67c4a 100%); text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px;">💇‍♀️ Salon Finder SK</h1>
        <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Obnovenie hesla</p>
      </td>
    </tr>
    <tr>
      <td style="padding: 40px 30px;">
        <h2 style="color: #1f2937; margin: 0 0 20px 0;">Zabudli ste heslo? 🔐</h2>
        <p style="color: #4b5563; line-height: 1.6; margin: 0 0 20px 0;">
          Dostali sme žiadosť o obnovenie hesla pre váš účet. Kliknite na tlačidlo nižšie pre nastavenie nového hesla:
        </p>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="text-align: center; padding: 20px 0;">
              <a href="{{ .ConfirmationURL }}" style="display: inline-block; padding: 14px 40px; background: linear-gradient(135deg, #c19a6b 0%, #a67c4a 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                🔑 Nastaviť nové heslo
              </a>
            </td>
          </tr>
        </table>
        <p style="color: #6b7280; font-size: 14px; line-height: 1.5; margin: 20px 0 0 0;">
          Ak ste nepožiadali o obnovenie hesla, môžete tento e-mail ignorovať. Vaše heslo zostane nezmenené.
        </p>
      </td>
    </tr>
    <tr>
      <td style="padding: 30px; background-color: #f9fafb; text-align: center; border-top: 1px solid #e5e7eb;">
        <p style="color: #9ca3af; font-size: 12px; margin: 0;">
          © 2024 Salon Finder SK | Všetky práva vyhradené<br>
          <a href="https://vyhladavac-salonov.vercel.app" style="color: #c19a6b;">vyhladavac-salonov.vercel.app</a>
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
```

---

## 3. MAGIC LINK (Prihlásenie odkazom)

### Subject:
```
Prihlásenie do účtu | Salon Finder SK
```

### Body:
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, sans-serif; background-color: #f9fafb;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <tr>
      <td style="padding: 40px 30px; background: linear-gradient(135deg, #c19a6b 0%, #a67c4a 100%); text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px;">💇‍♀️ Salon Finder SK</h1>
        <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Prihlásenie do účtu</p>
      </td>
    </tr>
    <tr>
      <td style="padding: 40px 30px;">
        <h2 style="color: #1f2937; margin: 0 0 20px 0;">Prihláste sa jedným kliknutím ✨</h2>
        <p style="color: #4b5563; line-height: 1.6; margin: 0 0 20px 0;">
          Kliknite na tlačidlo nižšie pre okamžité prihlásenie do vášho účtu:
        </p>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="text-align: center; padding: 20px 0;">
              <a href="{{ .ConfirmationURL }}" style="display: inline-block; padding: 14px 40px; background: linear-gradient(135deg, #c19a6b 0%, #a67c4a 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                ➜ Prihlásiť sa
              </a>
            </td>
          </tr>
        </table>
        <p style="color: #6b7280; font-size: 14px; line-height: 1.5; margin: 20px 0 0 0;">
          Tento odkaz je platný 24 hodín. Ak ste nepožiadali o prihlásenie, môžete tento e-mail ignorovať.
        </p>
      </td>
    </tr>
    <tr>
      <td style="padding: 30px; background-color: #f9fafb; text-align: center; border-top: 1px solid #e5e7eb;">
        <p style="color: #9ca3af; font-size: 12px; margin: 0;">
          © 2024 Salon Finder SK | Všetky práva vyhradené<br>
          <a href="https://vyhladavac-salonov.vercel.app" style="color: #c19a6b;">vyhladavac-salonov.vercel.app</a>
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
```

---

## 4. CHANGE EMAIL (Zmena e-mailu)

### Subject:
```
Potvrdenie novej e-mailovej adresy | Salon Finder SK
```

### Body:
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, sans-serif; background-color: #f9fafb;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <tr>
      <td style="padding: 40px 30px; background: linear-gradient(135deg, #c19a6b 0%, #a67c4a 100%); text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px;">💇‍♀️ Salon Finder SK</h1>
        <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Zmena e-mailovej adresy</p>
      </td>
    </tr>
    <tr>
      <td style="padding: 40px 30px;">
        <h2 style="color: #1f2937; margin: 0 0 20px 0;">Potvrďte novú e-mailovú adresu 📧</h2>
        <p style="color: #4b5563; line-height: 1.6; margin: 0 0 20px 0;">
          Požiadali ste o zmenu e-mailovej adresy. Pre potvrdenie kliknite na tlačidlo nižšie:
        </p>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="text-align: center; padding: 20px 0;">
              <a href="{{ .ConfirmationURL }}" style="display: inline-block; padding: 14px 40px; background: linear-gradient(135deg, #c19a6b 0%, #a67c4a 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                ✓ Potvrdiť nový e-mail
              </a>
            </td>
          </tr>
        </table>
        <p style="color: #6b7280; font-size: 14px; line-height: 1.5; margin: 20px 0 0 0;">
          Ak ste nepožiadali o zmenu e-mailu, kontaktujte nás prosím ihneď.
        </p>
      </td>
    </tr>
    <tr>
      <td style="padding: 30px; background-color: #f9fafb; text-align: center; border-top: 1px solid #e5e7eb;">
        <p style="color: #9ca3af; font-size: 12px; margin: 0;">
          © 2024 Salon Finder SK | Všetky práva vyhradené<br>
          <a href="https://vyhladavac-salonov.vercel.app" style="color: #c19a6b;">vyhladavac-salonov.vercel.app</a>
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
```

---

## HOW TO USE:

1. Go to https://supabase.com/dashboard
2. Select your project
3. Go to **Authentication** → **Email Templates**
4. Click on each template type (Confirm signup, Reset Password, etc.)
5. Copy the **Subject** and **Body** from above
6. Paste into the Supabase editor
7. Click **Save**

DONE! Your emails will now look branded and professional! 🎉
