/**
 * Lex System: White-Label Tenant Config Service (Mock)
 * Objective: Simulates fetching a tenant's custom UI configuration from the database.
 * B.L.A.S.T Rule: Modular SaaS Architecture. 
 * The single Next.js application renders differently depending on the domain accessed.
 */

export interface TenantConfig {
    id: string;
    domain: string;
    firmName: string;
    logoText: string;
    colors: {
        primary: string; // Tailwind hex color
        secondary: string; // Harmonious pair
        surface: string; // Tinted dark background
        background: string;
    };
    copywriting: {
        heroHeadline: string;
        heroSubtitle: string;
        heroAccent: string; // The italicized serif text
        aboutText: string;
    };
    team: {
        name: string;
        role: string;
        imageUrl: string;
    }[];
    testimonials: {
        quote: string;
        client: string;
    }[];
}

// Pure math helpers to generate harmonious colors from a hex string
function hexToHSL(hex: string) {
    let r = parseInt(hex.substring(1, 3), 16) / 255;
    let g = parseInt(hex.substring(3, 5), 16) / 255;
    let b = parseInt(hex.substring(5, 7), 16) / 255;
    let cmin = Math.min(r, g, b), cmax = Math.max(r, g, b), delta = cmax - cmin, h = 0, s = 0, l = 0;
    if (delta == 0) h = 0;
    else if (cmax == r) h = ((g - b) / delta) % 6;
    else if (cmax == g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;
    h = Math.round(h * 60);
    if (h < 0) h += 360;
    l = (cmax + cmin) / 2;
    s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
    return [h, +(s * 100).toFixed(1), +(l * 100).toFixed(1)];
}

function HSLToHex(h: number, s: number, l: number) {
    s /= 100; l /= 100;
    let c = (1 - Math.abs(2 * l - 1)) * s, x = c * (1 - Math.abs((h / 60) % 2 - 1)), m = l - c / 2, r = 0, g = 0, b = 0;
    if (0 <= h && h < 60) { r = c; g = x; b = 0; }
    else if (60 <= h && h < 120) { r = x; g = c; b = 0; }
    else if (120 <= h && h < 180) { r = 0; g = c; b = x; }
    else if (180 <= h && h < 240) { r = 0; g = x; b = c; }
    else if (240 <= h && h < 300) { r = x; g = 0; b = c; }
    else if (300 <= h && h <= 360) { r = c; g = 0; b = x; }
    r = Math.round((r + m) * 255); g = Math.round((g + m) * 255); b = Math.round((b + m) * 255);
    return "#" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1).toUpperCase();
}

function calculateHarmoniousTheme(primaryHex: string) {
    const [h, s, l] = hexToHSL(primaryHex);
    // Secondary: Analogous (Shift hue by 30 degrees)
    const secondary = HSLToHex((h + 30) % 360, s, l);
    // Surface: Extremely dark version of primary for subtle card backgrounds (Luminance 8%)
    const surface = HSLToHex(h, Math.min(s, 20), 8);
    return {
        primary: primaryHex,
        secondary,
        surface,
        background: "#050505"
    };
}

// In production, this runs deeply server-side during the route middleware or server component load
// via `await supabase.from('tenants').select('ui_config').eq('domain', hostname)`.
export async function getTenantConfig(hostname: string): Promise<TenantConfig> {

    // MOCK: Simulate DB delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Default Mock Tenant: Lex Master System
    const lexSystemMock: TenantConfig = {
        id: "tenant-lex-001",
        domain: "localhost:3002",
        firmName: "Lex System Law Group",
        logoText: "Lex.",
        colors: calculateHarmoniousTheme("#4338ca"), // Indigo base

        copywriting: {
            heroHeadline: "Fighting for",
            heroAccent: "Absolute Justice.",
            heroSubtitle: "We centralize uncompromising legal support with the precision of the Lex System. Securing your rights, enforcing your legacy.",
            aboutText: "At Lex Law Group, our seasoned attorneys bring decades of ruthless expertise to high-stakes litigation. We navigate complex commercial disputes, intellectual property defense, and enterprise-level risk mitigation with an unwavering, results-driven approach."
        },
        team: [
            { name: "Robert Harrison", role: "Senior Partner, Corporate", imageUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800&auto=format&fit=crop" },
            { name: "Elena Rostova", role: "Head of Intellectual Property", imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop" },
            { name: "Marcus Thorne", role: "Lead Litigation Counsel", imageUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=800&auto=format&fit=crop" }
        ],
        testimonials: [
            { quote: "Their strategic acumen saved our company from a crippling hostile takeover. Unequivocally the best.", client: "CEO, TechNova Solutions" },
            { quote: "Unwavering dedication. They dismantled the opposing arguments with surgical precision.", client: "Board Director, Apex Global" }
        ]
    };

    // MOCK: Secondary Tenant (e.g. Arunika & Co) to prove White-Label dynamic swap works
    const arunikaMock: TenantConfig = {
        id: "tenant-aru-002",
        domain: "arunika.com",
        firmName: "Arunika & Co",
        logoText: "Arunika",
        colors: calculateHarmoniousTheme("#991b1b"), // Crimson base

        copywriting: {
            heroHeadline: "Safeguarding",
            heroAccent: "Your Rights.",
            heroSubtitle: "Dedicated to transparent, ethical, and relentless advocacy for our clients across the nation.",
            aboutText: "Arunika & Co stands by your side in every step toward legal certainty. We guide individuals and businesses through complex legal matters, ensuring clarity and protection for their rights."
        },
        team: [
            // Different team
            { name: "Sarah Jenkins", role: "Founding Partner", imageUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=800&auto=format&fit=crop" }
        ],
        testimonials: [
            { quote: "A beacon of hope during our darkest hour.", client: "Private Client" }
        ]
    };

    // Switch logic based on domain
    if (hostname.includes('arunika')) {
        return arunikaMock;
    }

    return lexSystemMock;
}
