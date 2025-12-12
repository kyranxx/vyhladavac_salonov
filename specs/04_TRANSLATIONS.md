# 🌍 Translations (i18n)

## Translation Structure

Using `next-intl` for internationalization.

### File Structure

```
messages/
├── sk.json     # Slovak (default)
├── en.json     # English
└── hu.json     # Hungarian
```

---

## Complete Translations

### Slovak (sk.json)

```json
{
  "meta": {
    "siteName": "Salon Finder",
    "siteDescription": "Najväčší katalóg salónov na Slovensku. Nájdite kaderníctvo, kozmetiku, masáže, nechtové štúdiá a ďalšie služby vo vašom meste.",
    "siteKeywords": "salóny, kaderníctvo, kozmetika, masáže, nechty, Slovensko"
  },
  
  "common": {
    "search": "Hľadať",
    "searchPlaceholder": "Hľadať salón...",
    "loading": "Načítavam...",
    "error": "Nastala chyba",
    "save": "Uložiť",
    "cancel": "Zrušiť",
    "delete": "Vymazať",
    "edit": "Upraviť",
    "back": "Späť",
    "next": "Ďalej",
    "previous": "Predchádzajúce",
    "submit": "Odoslať",
    "close": "Zavrieť",
    "viewAll": "Zobraziť všetko",
    "viewMore": "Zobraziť viac",
    "showLess": "Zobraziť menej",
    "noResults": "Žiadne výsledky",
    "filters": "Filtre",
    "clearFilters": "Zrušiť filtre",
    "sortBy": "Zoradiť podľa",
    "newest": "Najnovšie",
    "popular": "Najpopulárnejšie",
    "alphabetical": "Abecedne",
    "allCategories": "Všetky kategórie",
    "allCities": "Všetky mestá",
    "selectCity": "Vyberte mesto",
    "selectCategory": "Vyberte kategóriu",
    "free": "Zadarmo",
    "premium": "Premium",
    "featured": "Odporúčané",
    "verified": "Overené",
    "new": "Nové",
    "perMonth": "/mesiac",
    "perYear": "/rok",
    "days": "dní",
    "readMore": "Čítať viac",
    "share": "Zdieľať",
    "phone": "Telefón",
    "email": "E-mail",
    "website": "Web",
    "address": "Adresa",
    "openingHours": "Otváracie hodiny",
    "services": "Služby",
    "photos": "Fotky",
    "priceList": "Cenník",
    "about": "O nás",
    "contact": "Kontakt",
    "location": "Poloha"
  },
  
  "nav": {
    "home": "Domov",
    "salons": "Salóny",
    "categories": "Kategórie",
    "cities": "Mestá",
    "forOwners": "Pre majiteľov",
    "pricing": "Cenník",
    "login": "Prihlásiť sa",
    "register": "Registrovať sa",
    "dashboard": "Dashboard",
    "logout": "Odhlásiť sa",
    "myProfile": "Môj profil",
    "settings": "Nastavenia"
  },
  
  "home": {
    "heroTitle": "Nájdite perfektný salón",
    "heroSubtitle": "Objavte {count} salónov po celom Slovensku",
    "searchLabel": "Čo hľadáte?",
    "cityLabel": "Kde?",
    "browseCategories": "Prehľadávať podľa kategórie",
    "popularCities": "Populárne mestá",
    "featuredSalons": "Odporúčané salóny",
    "latestSalons": "Najnovšie pridané",
    "howItWorks": "Ako to funguje",
    "step1Title": "Vyhľadajte",
    "step1Desc": "Vyberte kategóriu a mesto",
    "step2Title": "Porovnajte",
    "step2Desc": "Prezrite si fotky, služby a cenníky",
    "step3Title": "Kontaktujte",
    "step3Desc": "Zavolajte alebo navštívte salón",
    "forOwnersTitle": "Ste majiteľ salónu?",
    "forOwnersDesc": "Pridajte svoj salón zadarmo a získajte nových zákazníkov",
    "addSalonFree": "Pridať salón zadarmo",
    "stats": {
      "salons": "salónov",
      "cities": "miest",
      "categories": "kategórií",
      "visits": "návštev mesačne"
    }
  },
  
  "salon": {
    "callNow": "Zavolať",
    "visitWebsite": "Navštíviť web",
    "bookNow": "Rezervovať",
    "getDirections": "Navigovať",
    "viewOnMap": "Zobraziť na mape",
    "shareProfile": "Zdieľať profil",
    "reportListing": "Nahlásiť",
    "closed": "Zatvorené",
    "openNow": "Otvorené",
    "closingSoon": "Čoskoro zatvára",
    "openingAt": "Otvára o {time}",
    "notSpecified": "Neuvedené",
    "freeParking": "Parkovanie zadarmo",
    "paidParking": "Platené parkovanie",
    "noParking": "Bez parkovania",
    "paymentMethods": "Spôsoby platby",
    "cash": "Hotovosť",
    "card": "Kartou",
    "transfer": "Prevodom",
    "followUs": "Sledujte nás",
    "reviews": "Recenzie",
    "viewGoogleReviews": "Zobraziť recenzie na Google",
    "similarSalons": "Podobné salóny",
    "salonNotFound": "Salón sa nenašiel",
    "salonNotFoundDesc": "Salón, ktorý hľadáte, neexistuje alebo bol odstránený."
  },
  
  "listing": {
    "resultsCount": "{count} salónov",
    "resultCount": "1 salón",
    "noSalonsFound": "Nenašli sa žiadne salóny",
    "noSalonsFoundDesc": "Skúste zmeniť filtre alebo vyhľadávanie",
    "inCity": "v meste {city}",
    "showingCategory": "Zobrazujem: {category}",
    "filterByCategory": "Filtrovať podľa kategórie",
    "filterByCity": "Filtrovať podľa mesta",
    "loadMore": "Načítať viac"
  },
  
  "auth": {
    "loginTitle": "Prihláste sa do svojho účtu",
    "registerTitle": "Vytvorte si účet",
    "email": "E-mailová adresa",
    "password": "Heslo",
    "confirmPassword": "Potvrďte heslo",
    "fullName": "Celé meno",
    "phoneNumber": "Telefónne číslo",
    "forgotPassword": "Zabudli ste heslo?",
    "resetPassword": "Obnoviť heslo",
    "sendResetLink": "Odoslať odkaz na obnovenie",
    "noAccount": "Nemáte účet?",
    "haveAccount": "Už máte účet?",
    "registerNow": "Zaregistrujte sa",
    "loginNow": "Prihláste sa",
    "loginWithGoogle": "Prihlásiť sa cez Google",
    "orContinueWith": "alebo pokračujte s",
    "agreeToTerms": "Registráciou súhlasím s",
    "termsOfService": "obchodnými podmienkami",
    "and": "a",
    "privacyPolicy": "zásadami ochrany súkromia",
    "verifyEmail": "Overte svoj e-mail",
    "verifyEmailDesc": "Poslali sme vám overovací odkaz na {email}",
    "resendEmail": "Odoslať znova",
    "emailSent": "E-mail odoslaný"
  },
  
  "registration": {
    "title": "Pridajte svoj salón",
    "subtitle": "Začnite získavať nových zákazníkov zadarmo",
    "step1": "Základné údaje",
    "step2": "Kontaktné údaje",
    "step3": "Služby a hodiny",
    "step4": "Fotky",
    "step5": "Kontrola a odoslanie",
    "salonName": "Názov salónu",
    "salonNamePlaceholder": "napr. Salón Mária",
    "category": "Hlavná kategória",
    "additionalCategories": "Ďalšie kategórie (Premium)",
    "address": "Adresa",
    "addressPlaceholder": "Ulica, číslo",
    "city": "Mesto / Okres",
    "phone": "Telefón",
    "phonePlaceholder": "+421 9XX XXX XXX",
    "openingHours": "Otváracie hodiny",
    "addService": "Pridať službu",
    "serviceName": "Názov služby",
    "servicePrice": "Cena (€)",
    "serviceDuration": "Trvanie (min)",
    "uploadLogo": "Nahrať logo",
    "uploadPhotos": "Nahrať fotky",
    "dragAndDrop": "Presuňte sem alebo kliknite pre výber",
    "maxPhotos": "Maximálne {count} fotiek",
    "maxFileSize": "Maximálna veľkosť súboru: 5 MB",
    "supportedFormats": "Podporované formáty: JPG, PNG",
    "submitting": "Odosielam...",
    "submitForApproval": "Odoslať na schválenie",
    "registrationSuccess": "Registrácia bola úspešná!",
    "registrationSuccessDesc": "Váš salón sme prijali na schválenie. O výsledku vás budeme informovať e-mailom.",
    "goToDashboard": "Prejsť do Dashboard"
  },
  
  "dashboard": {
    "welcome": "Vitajte, {name}",
    "mySalon": "Môj salón",
    "editSalon": "Upraviť salón",
    "managePhotos": "Správa fotiek",
    "manageServices": "Správa služieb",
    "subscription": "Predplatné",
    "statistics": "Štatistiky",
    "payments": "Platby",
    "settings": "Nastavenia",
    "status": {
      "pending": "Čaká na schválenie",
      "approved": "Schválené",
      "rejected": "Zamietnuté",
      "suspended": "Pozastavené"
    },
    "pendingApproval": "Váš salón čaká na schválenie",
    "pendingApprovalDesc": "Náš tím preveruje vaše údaje. Zvyčajne to trvá 24-48 hodín.",
    "rejectedDesc": "Váš salón bol zamietnutý. Dôvod: {reason}",
    "editAndResubmit": "Upraviť a znova odoslať",
    "noSalon": "Nemáte ešte pridaný žiadny salón",
    "addSalonNow": "Pridať salón teraz",
    "stats": {
      "views": "Zobrazenia",
      "clicks": "Kliky",
      "last7Days": "Za posledných 7 dní",
      "last30Days": "Za posledných 30 dní",
      "allTime": "Celkovo",
      "phoneClicks": "Kliky na telefón",
      "websiteClicks": "Kliky na web",
      "bookingClicks": "Kliky na rezerváciu",
      "upgradeToSee": "Aktivujte Premium pre zobrazenie štatistík"
    }
  },
  
  "subscription": {
    "currentPlan": "Aktuálny plán",
    "freePlan": "Zadarmo",
    "premiumPlan": "Premium",
    "featuredPlan": "Propagovaný",
    "verifiedPlan": "Overený",
    "upgradeNow": "Aktivovať teraz",
    "expiresOn": "Vyprší: {date}",
    "cancelSubscription": "Zrušiť predplatné",
    "renewNow": "Obnoviť teraz",
    "paymentHistory": "História platieb",
    "noPayments": "Zatiaľ žiadne platby",
    "features": {
      "free": {
        "title": "Zadarmo",
        "price": "0 €",
        "features": [
          "Základný profil",
          "1 fotka (logo)",
          "1 kategória",
          "Telefónne číslo",
          "Adresa",
          "Otváracie hodiny",
          "Zoznam služieb"
        ]
      },
      "premium": {
        "title": "Premium",
        "priceMonthly": "3 €",
        "priceYearly": "30 €",
        "features": [
          "Všetko zo Zadarmo, plus:",
          "Až 10 fotiek",
          "Až 3 kategórie",
          "Cenník služieb",
          "Popis salónu",
          "Odkaz na web",
          "Odkaz na rezervácie",
          "Sociálne siete (FB, IG)",
          "Google recenzie",
          "Štatistiky návštevnosti"
        ]
      },
      "featured": {
        "title": "Propagovaný",
        "price": "5 € / 7 dní",
        "features": [
          "Zobrazenie na vrchu zoznamu",
          "Zvýraznená karta",
          "Prednosť vo vyhľadávaní"
        ]
      },
      "verified": {
        "title": "Overený",
        "price": "20 € / rok",
        "features": [
          "Overený odznak",
          "Zvýšená dôveryhodnosť",
          "Preferencia u zákazníkov"
        ]
      }
    }
  },
  
  "pricing": {
    "title": "Cenník",
    "subtitle": "Vyberte si plán, ktorý vám vyhovuje",
    "forSalonOwners": "Pre majiteľov salónov",
    "forAdvertisers": "Pre inzerentov",
    "monthlyBilling": "Mesačná platba",
    "yearlyBilling": "Ročná platba",
    "yearlyDiscount": "Ušetrite 2 mesiace",
    "mostPopular": "Najpopulárnejší",
    "startFree": "Začať zadarmo",
    "contactUs": "Kontaktujte nás"
  },
  
  "footer": {
    "rights": "Všetky práva vyhradené",
    "about": "O nás",
    "contact": "Kontakt",
    "termsOfService": "Obchodné podmienky",
    "privacyPolicy": "Ochrana súkromia",
    "cookies": "Cookies",
    "forOwners": "Pre majiteľov",
    "help": "Pomoc",
    "followUs": "Sledujte nás"
  },
  
  "cookies": {
    "message": "Táto stránka používa cookies pre zlepšenie vášho zážitku.",
    "learnMore": "Zistiť viac",
    "accept": "Súhlasím",
    "reject": "Odmietnuť"
  },
  
  "errors": {
    "required": "Toto pole je povinné",
    "invalidEmail": "Neplatná e-mailová adresa",
    "invalidPhone": "Neplatné telefónne číslo",
    "minLength": "Minimálna dĺžka je {count} znakov",
    "maxLength": "Maximálna dĺžka je {count} znakov",
    "passwordMismatch": "Heslá sa nezhodujú",
    "weakPassword": "Heslo je príliš slabé",
    "fileTooLarge": "Súbor je príliš veľký",
    "invalidFileType": "Neplatný typ súboru",
    "serverError": "Nastala chyba servera. Skúste to znova.",
    "networkError": "Problém s pripojením. Skontrolujte internet.",
    "unauthorized": "Nie ste prihlásený",
    "forbidden": "Nemáte oprávnenie",
    "notFound": "Nenájdené"
  },
  
  "days": {
    "monday": "Pondelok",
    "tuesday": "Utorok",
    "wednesday": "Streda",
    "thursday": "Štvrtok",
    "friday": "Piatok",
    "saturday": "Sobota",
    "sunday": "Nedeľa",
    "mon": "Po",
    "tue": "Ut",
    "wed": "St",
    "thu": "Št",
    "fri": "Pi",
    "sat": "So",
    "sun": "Ne"
  },
  
  "admin": {
    "dashboard": "Admin Dashboard",
    "salons": "Salóny",
    "approvals": "Schvaľovanie",
    "categories": "Kategórie",
    "districts": "Okresy",
    "users": "Používatelia",
    "bannerAds": "Reklamné bannery",
    "subscriptions": "Predplatné",
    "featured": "Propagované",
    "verified": "Overené",
    "analytics": "Analytika",
    "export": "Export",
    "settings": "Nastavenia",
    "pendingApprovals": "Čakajúce schválenia",
    "approve": "Schváliť",
    "reject": "Zamietnuť",
    "rejectReason": "Dôvod zamietnutia",
    "totalSalons": "Celkom salónov",
    "totalUsers": "Celkom používateľov",
    "monthlyRevenue": "Mesačný príjem",
    "newThisWeek": "Nových tento týždeň"
  }
}
```

---

### English (en.json)

```json
{
  "meta": {
    "siteName": "Salon Finder",
    "siteDescription": "The largest salon directory in Slovakia. Find hairdressers, beauty salons, massage, nail studios and more in your city.",
    "siteKeywords": "salons, hairdresser, beauty, massage, nails, Slovakia"
  },
  
  "common": {
    "search": "Search",
    "searchPlaceholder": "Search salon...",
    "loading": "Loading...",
    "error": "An error occurred",
    "save": "Save",
    "cancel": "Cancel",
    "delete": "Delete",
    "edit": "Edit",
    "back": "Back",
    "next": "Next",
    "previous": "Previous",
    "submit": "Submit",
    "close": "Close",
    "viewAll": "View all",
    "viewMore": "View more",
    "showLess": "Show less",
    "noResults": "No results",
    "filters": "Filters",
    "clearFilters": "Clear filters",
    "sortBy": "Sort by",
    "newest": "Newest",
    "popular": "Most popular",
    "alphabetical": "Alphabetical",
    "allCategories": "All categories",
    "allCities": "All cities",
    "selectCity": "Select city",
    "selectCategory": "Select category",
    "free": "Free",
    "premium": "Premium",
    "featured": "Featured",
    "verified": "Verified",
    "new": "New",
    "perMonth": "/month",
    "perYear": "/year",
    "days": "days",
    "readMore": "Read more",
    "share": "Share",
    "phone": "Phone",
    "email": "Email",
    "website": "Website",
    "address": "Address",
    "openingHours": "Opening hours",
    "services": "Services",
    "photos": "Photos",
    "priceList": "Price list",
    "about": "About",
    "contact": "Contact",
    "location": "Location"
  },
  
  "nav": {
    "home": "Home",
    "salons": "Salons",
    "categories": "Categories",
    "cities": "Cities",
    "forOwners": "For Owners",
    "pricing": "Pricing",
    "login": "Log in",
    "register": "Sign up",
    "dashboard": "Dashboard",
    "logout": "Log out",
    "myProfile": "My Profile",
    "settings": "Settings"
  },
  
  "home": {
    "heroTitle": "Find the perfect salon",
    "heroSubtitle": "Discover {count} salons across Slovakia",
    "searchLabel": "What are you looking for?",
    "cityLabel": "Where?",
    "browseCategories": "Browse by category",
    "popularCities": "Popular cities",
    "featuredSalons": "Featured salons",
    "latestSalons": "Recently added",
    "howItWorks": "How it works",
    "step1Title": "Search",
    "step1Desc": "Choose a category and city",
    "step2Title": "Compare",
    "step2Desc": "View photos, services and prices",
    "step3Title": "Contact",
    "step3Desc": "Call or visit the salon",
    "forOwnersTitle": "Are you a salon owner?",
    "forOwnersDesc": "Add your salon for free and get new customers",
    "addSalonFree": "Add salon for free",
    "stats": {
      "salons": "salons",
      "cities": "cities",
      "categories": "categories",
      "visits": "monthly visits"
    }
  },
  
  "salon": {
    "callNow": "Call now",
    "visitWebsite": "Visit website",
    "bookNow": "Book now",
    "getDirections": "Get directions",
    "viewOnMap": "View on map",
    "shareProfile": "Share profile",
    "reportListing": "Report",
    "closed": "Closed",
    "openNow": "Open now",
    "closingSoon": "Closing soon",
    "openingAt": "Opens at {time}",
    "notSpecified": "Not specified",
    "freeParking": "Free parking",
    "paidParking": "Paid parking",
    "noParking": "No parking",
    "paymentMethods": "Payment methods",
    "cash": "Cash",
    "card": "Card",
    "transfer": "Bank transfer",
    "followUs": "Follow us",
    "reviews": "Reviews",
    "viewGoogleReviews": "View Google reviews",
    "similarSalons": "Similar salons",
    "salonNotFound": "Salon not found",
    "salonNotFoundDesc": "The salon you're looking for doesn't exist or has been removed."
  },
  
  "listing": {
    "resultsCount": "{count} salons",
    "resultCount": "1 salon",
    "noSalonsFound": "No salons found",
    "noSalonsFoundDesc": "Try changing your filters or search",
    "inCity": "in {city}",
    "showingCategory": "Showing: {category}",
    "filterByCategory": "Filter by category",
    "filterByCity": "Filter by city",
    "loadMore": "Load more"
  },
  
  "auth": {
    "loginTitle": "Log in to your account",
    "registerTitle": "Create an account",
    "email": "Email address",
    "password": "Password",
    "confirmPassword": "Confirm password",
    "fullName": "Full name",
    "phoneNumber": "Phone number",
    "forgotPassword": "Forgot password?",
    "resetPassword": "Reset password",
    "sendResetLink": "Send reset link",
    "noAccount": "Don't have an account?",
    "haveAccount": "Already have an account?",
    "registerNow": "Sign up",
    "loginNow": "Log in",
    "loginWithGoogle": "Continue with Google",
    "orContinueWith": "or continue with",
    "agreeToTerms": "By signing up, I agree to the",
    "termsOfService": "Terms of Service",
    "and": "and",
    "privacyPolicy": "Privacy Policy",
    "verifyEmail": "Verify your email",
    "verifyEmailDesc": "We've sent a verification link to {email}",
    "resendEmail": "Resend email",
    "emailSent": "Email sent"
  },
  
  "registration": {
    "title": "Add your salon",
    "subtitle": "Start getting new customers for free",
    "step1": "Basic info",
    "step2": "Contact details",
    "step3": "Services & hours",
    "step4": "Photos",
    "step5": "Review & submit",
    "salonName": "Salon name",
    "salonNamePlaceholder": "e.g. Maria's Salon",
    "category": "Main category",
    "additionalCategories": "Additional categories (Premium)",
    "address": "Address",
    "addressPlaceholder": "Street, number",
    "city": "City / District",
    "phone": "Phone",
    "phonePlaceholder": "+421 9XX XXX XXX",
    "openingHours": "Opening hours",
    "addService": "Add service",
    "serviceName": "Service name",
    "servicePrice": "Price (€)",
    "serviceDuration": "Duration (min)",
    "uploadLogo": "Upload logo",
    "uploadPhotos": "Upload photos",
    "dragAndDrop": "Drag & drop or click to select",
    "maxPhotos": "Maximum {count} photos",
    "maxFileSize": "Maximum file size: 5 MB",
    "supportedFormats": "Supported formats: JPG, PNG",
    "submitting": "Submitting...",
    "submitForApproval": "Submit for approval",
    "registrationSuccess": "Registration successful!",
    "registrationSuccessDesc": "Your salon has been submitted for approval. We'll notify you by email.",
    "goToDashboard": "Go to Dashboard"
  },
  
  "dashboard": {
    "welcome": "Welcome, {name}",
    "mySalon": "My Salon",
    "editSalon": "Edit salon",
    "managePhotos": "Manage photos",
    "manageServices": "Manage services",
    "subscription": "Subscription",
    "statistics": "Statistics",
    "payments": "Payments",
    "settings": "Settings",
    "status": {
      "pending": "Pending approval",
      "approved": "Approved",
      "rejected": "Rejected",
      "suspended": "Suspended"
    },
    "pendingApproval": "Your salon is pending approval",
    "pendingApprovalDesc": "Our team is reviewing your submission. This usually takes 24-48 hours.",
    "rejectedDesc": "Your salon was rejected. Reason: {reason}",
    "editAndResubmit": "Edit and resubmit",
    "noSalon": "You haven't added a salon yet",
    "addSalonNow": "Add salon now",
    "stats": {
      "views": "Views",
      "clicks": "Clicks",
      "last7Days": "Last 7 days",
      "last30Days": "Last 30 days",
      "allTime": "All time",
      "phoneClicks": "Phone clicks",
      "websiteClicks": "Website clicks",
      "bookingClicks": "Booking clicks",
      "upgradeToSee": "Upgrade to Premium to see statistics"
    }
  },
  
  "subscription": {
    "currentPlan": "Current plan",
    "freePlan": "Free",
    "premiumPlan": "Premium",
    "featuredPlan": "Featured",
    "verifiedPlan": "Verified",
    "upgradeNow": "Upgrade now",
    "expiresOn": "Expires: {date}",
    "cancelSubscription": "Cancel subscription",
    "renewNow": "Renew now",
    "paymentHistory": "Payment history",
    "noPayments": "No payments yet",
    "features": {
      "free": {
        "title": "Free",
        "price": "€0",
        "features": [
          "Basic profile",
          "1 photo (logo)",
          "1 category",
          "Phone number",
          "Address",
          "Opening hours",
          "Services list"
        ]
      },
      "premium": {
        "title": "Premium",
        "priceMonthly": "€3",
        "priceYearly": "€30",
        "features": [
          "Everything in Free, plus:",
          "Up to 10 photos",
          "Up to 3 categories",
          "Service price list",
          "Salon description",
          "Website link",
          "Booking link",
          "Social media (FB, IG)",
          "Google reviews",
          "Traffic statistics"
        ]
      },
      "featured": {
        "title": "Featured",
        "price": "€5 / 7 days",
        "features": [
          "Top of listings",
          "Highlighted card",
          "Search priority"
        ]
      },
      "verified": {
        "title": "Verified",
        "price": "€20 / year",
        "features": [
          "Verified badge",
          "Increased trust",
          "Customer preference"
        ]
      }
    }
  },
  
  "pricing": {
    "title": "Pricing",
    "subtitle": "Choose the plan that works for you",
    "forSalonOwners": "For salon owners",
    "forAdvertisers": "For advertisers",
    "monthlyBilling": "Monthly billing",
    "yearlyBilling": "Yearly billing",
    "yearlyDiscount": "Save 2 months",
    "mostPopular": "Most popular",
    "startFree": "Start free",
    "contactUs": "Contact us"
  },
  
  "footer": {
    "rights": "All rights reserved",
    "about": "About",
    "contact": "Contact",
    "termsOfService": "Terms of Service",
    "privacyPolicy": "Privacy Policy",
    "cookies": "Cookies",
    "forOwners": "For Owners",
    "help": "Help",
    "followUs": "Follow us"
  },
  
  "cookies": {
    "message": "This website uses cookies to improve your experience.",
    "learnMore": "Learn more",
    "accept": "Accept",
    "reject": "Reject"
  },
  
  "errors": {
    "required": "This field is required",
    "invalidEmail": "Invalid email address",
    "invalidPhone": "Invalid phone number",
    "minLength": "Minimum length is {count} characters",
    "maxLength": "Maximum length is {count} characters",
    "passwordMismatch": "Passwords don't match",
    "weakPassword": "Password is too weak",
    "fileTooLarge": "File is too large",
    "invalidFileType": "Invalid file type",
    "serverError": "Server error occurred. Please try again.",
    "networkError": "Connection problem. Check your internet.",
    "unauthorized": "You are not logged in",
    "forbidden": "Access denied",
    "notFound": "Not found"
  },
  
  "days": {
    "monday": "Monday",
    "tuesday": "Tuesday",
    "wednesday": "Wednesday",
    "thursday": "Thursday",
    "friday": "Friday",
    "saturday": "Saturday",
    "sunday": "Sunday",
    "mon": "Mon",
    "tue": "Tue",
    "wed": "Wed",
    "thu": "Thu",
    "fri": "Fri",
    "sat": "Sat",
    "sun": "Sun"
  },
  
  "admin": {
    "dashboard": "Admin Dashboard",
    "salons": "Salons",
    "approvals": "Approvals",
    "categories": "Categories",
    "districts": "Districts",
    "users": "Users",
    "bannerAds": "Banner Ads",
    "subscriptions": "Subscriptions",
    "featured": "Featured",
    "verified": "Verified",
    "analytics": "Analytics",
    "export": "Export",
    "settings": "Settings",
    "pendingApprovals": "Pending approvals",
    "approve": "Approve",
    "reject": "Reject",
    "rejectReason": "Rejection reason",
    "totalSalons": "Total salons",
    "totalUsers": "Total users",
    "monthlyRevenue": "Monthly revenue",
    "newThisWeek": "New this week"
  }
}
```

---

### Hungarian (hu.json)

**Note:** This needs verification by a native Hungarian speaker. Provided as a starting point.

```json
{
  "meta": {
    "siteName": "Salon Finder",
    "siteDescription": "Szlovákia legnagyobb szalonkatalógusa. Találjon fodrászatot, kozmetikát, masszázst, körömstúdiót és sok mást a városában.",
    "siteKeywords": "szalonok, fodrászat, kozmetika, masszázs, köröm, Szlovákia"
  },
  
  "common": {
    "search": "Keresés",
    "searchPlaceholder": "Szalon keresése...",
    "loading": "Betöltés...",
    "error": "Hiba történt",
    "save": "Mentés",
    "cancel": "Mégse",
    "delete": "Törlés",
    "edit": "Szerkesztés",
    "back": "Vissza",
    "next": "Következő",
    "previous": "Előző",
    "submit": "Küldés",
    "close": "Bezárás",
    "viewAll": "Összes megtekintése",
    "viewMore": "Több megtekintése",
    "showLess": "Kevesebb mutatása",
    "noResults": "Nincs találat",
    "filters": "Szűrők",
    "clearFilters": "Szűrők törlése",
    "sortBy": "Rendezés",
    "newest": "Legújabb",
    "popular": "Legnépszerűbb",
    "alphabetical": "ABC sorrend",
    "allCategories": "Összes kategória",
    "allCities": "Összes város",
    "selectCity": "Válasszon várost",
    "selectCategory": "Válasszon kategóriát",
    "free": "Ingyenes",
    "premium": "Prémium",
    "featured": "Kiemelt",
    "verified": "Ellenőrzött",
    "new": "Új",
    "perMonth": "/hó",
    "perYear": "/év",
    "days": "nap",
    "readMore": "Tovább olvasom",
    "share": "Megosztás",
    "phone": "Telefon",
    "email": "E-mail",
    "website": "Weboldal",
    "address": "Cím",
    "openingHours": "Nyitvatartás",
    "services": "Szolgáltatások",
    "photos": "Fotók",
    "priceList": "Árlista",
    "about": "Rólunk",
    "contact": "Kapcsolat",
    "location": "Helyszín"
  },
  
  "nav": {
    "home": "Főoldal",
    "salons": "Szalonok",
    "categories": "Kategóriák",
    "cities": "Városok",
    "forOwners": "Tulajdonosoknak",
    "pricing": "Árak",
    "login": "Bejelentkezés",
    "register": "Regisztráció",
    "dashboard": "Irányítópult",
    "logout": "Kijelentkezés",
    "myProfile": "Profilom",
    "settings": "Beállítások"
  },
  
  "home": {
    "heroTitle": "Találja meg a tökéletes szalont",
    "heroSubtitle": "Fedezzen fel {count} szalont Szlovákia-szerte",
    "searchLabel": "Mit keres?",
    "cityLabel": "Hol?",
    "browseCategories": "Böngészés kategória szerint",
    "popularCities": "Népszerű városok",
    "featuredSalons": "Kiemelt szalonok",
    "latestSalons": "Legújabban hozzáadott",
    "howItWorks": "Hogyan működik",
    "step1Title": "Keresés",
    "step1Desc": "Válasszon kategóriát és várost",
    "step2Title": "Összehasonlítás",
    "step2Desc": "Nézze meg a fotókat, szolgáltatásokat és árakat",
    "step3Title": "Kapcsolat",
    "step3Desc": "Hívja fel vagy látogassa meg a szalont",
    "forOwnersTitle": "Szalontulajdonos?",
    "forOwnersDesc": "Adja hozzá szalonját ingyen és szerezzen új ügyfeleket",
    "addSalonFree": "Szalon hozzáadása ingyen",
    "stats": {
      "salons": "szalon",
      "cities": "város",
      "categories": "kategória",
      "visits": "havi látogatás"
    }
  },
  
  "salon": {
    "callNow": "Hívás most",
    "visitWebsite": "Weboldal",
    "bookNow": "Foglalás",
    "getDirections": "Útvonal",
    "viewOnMap": "Térkép",
    "shareProfile": "Profil megosztása",
    "reportListing": "Jelentés",
    "closed": "Zárva",
    "openNow": "Nyitva",
    "closingSoon": "Hamarosan zár",
    "openingAt": "Nyit: {time}",
    "notSpecified": "Nincs megadva",
    "freeParking": "Ingyenes parkolás",
    "paidParking": "Fizetős parkolás",
    "noParking": "Nincs parkolás",
    "paymentMethods": "Fizetési módok",
    "cash": "Készpénz",
    "card": "Kártya",
    "transfer": "Átutalás",
    "followUs": "Kövessen minket",
    "reviews": "Vélemények",
    "viewGoogleReviews": "Google vélemények",
    "similarSalons": "Hasonló szalonok",
    "salonNotFound": "Szalon nem található",
    "salonNotFoundDesc": "A keresett szalon nem létezik vagy eltávolították."
  },
  
  "footer": {
    "rights": "Minden jog fenntartva",
    "about": "Rólunk",
    "contact": "Kapcsolat",
    "termsOfService": "Általános Szerződési Feltételek",
    "privacyPolicy": "Adatvédelem",
    "cookies": "Cookie-k",
    "forOwners": "Tulajdonosoknak",
    "help": "Segítség",
    "followUs": "Kövessen minket"
  },
  
  "cookies": {
    "message": "Ez a weboldal cookie-kat használ a jobb felhasználói élmény érdekében.",
    "learnMore": "Tudjon meg többet",
    "accept": "Elfogadom",
    "reject": "Elutasítom"
  }
}
```

---

## Translation Workflow

### Adding New Strings

1. Add to all 3 language files
2. Use `{{variable}}` for dynamic content
3. Use `count` for pluralization
4. Test all languages after changes

### Translation Keys Convention

```
section.subsection.key

Examples:
- home.heroTitle
- salon.callNow
- errors.required
- subscription.features.premium.title
```

---

**Document Version:** 1.0  
**Last Updated:** December 12, 2024
