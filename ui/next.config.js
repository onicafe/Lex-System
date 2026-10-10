/** @type {import('next').NextConfig} */
const nextConfig = {
    async headers() {
        return [
            {
                source: "/(.*)",
                headers: [
                    {
                        key: "X-DNS-Prefetch-Control",
                        value: "on",
                    },
                    {
                        key: "Strict-Transport-Security",
                        value: "max-age=63072000; includeSubDomains; preload",
                    },
                    {
                        // Enforce HTTPS and prevent framing
                        key: "X-Frame-Options",
                        value: "DENY",
                    },
                    {
                        // Prevent MIME type sniffing
                        key: "X-Content-Type-Options",
                        value: "nosniff",
                    },
                    {
                        // Block XSS attacks in older browsers
                        key: "X-XSS-Protection",
                        value: "1; mode=block",
                    },
                    {
                        // Referrer policy for maximum privacy
                        key: "Referrer-Policy",
                        value: "strict-origin-when-cross-origin",
                    },
                ],
            },
        ];
    },
    // We disable powered-by to obscure our technology stack dynamically
    poweredByHeader: false,
};

module.exports = nextConfig;
