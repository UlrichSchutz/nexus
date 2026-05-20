import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [],
  },
  async redirects() {
    return [
      { source: "/index.html", destination: "/de", permanent: true },
      { source: "/55index.html", destination: "/de", permanent: true },
      { source: "/about.html", destination: "/de/about", permanent: true },
      { source: "/services.html", destination: "/de/services", permanent: true },
      { source: "/contact.php", destination: "/de/contact", permanent: true },
      { source: "/impressum.html", destination: "/de/impressum", permanent: true },
      { source: "/datenschutz.html", destination: "/de/datenschutz", permanent: true },
      { source: "/danke.html", destination: "/de/thank-you", permanent: true },
      { source: "/submit.php", destination: "/de/thank-you", permanent: true },
    ];
  },
};

export default withNextIntl(nextConfig);
