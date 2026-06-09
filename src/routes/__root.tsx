import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Bulgarian Trainer B1 — Learn real-life & technical Bulgarian" },
      { name: "description", content: "Reach B1 Bulgarian with vocabulary, verbs, quizzes, listening, speaking, reading, and a full evaluation system." },
      { property: "og:title", content: "Bulgarian Trainer B1 — Learn real-life & technical Bulgarian" },
      { property: "og:description", content: "Reach B1 Bulgarian with vocabulary, verbs, quizzes, listening, speaking, reading, and a full evaluation system." },
      { property: "og:type", content: "website" },
      { name: "theme-color", content: "#2f6b3a" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "default" },
      { name: "apple-mobile-web-app-title", content: "БГ Trainer" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "Bulgarian Trainer B1 — Learn real-life & technical Bulgarian" },
      { name: "twitter:description", content: "Reach B1 Bulgarian with vocabulary, verbs, quizzes, listening, speaking, reading, and a full evaluation system." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/43aa8449-0677-49bc-8658-d83987d2932b/id-preview-1418d7fc--ce02234b-5056-4f16-ab09-28865c57b06e.lovable.app-1776525686241.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/43aa8449-0677-49bc-8658-d83987d2932b/id-preview-1418d7fc--ce02234b-5056-4f16-ab09-28865c57b06e.lovable.app-1776525686241.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/manifest.webmanifest" },
      { rel: "icon", href: "/icon-512.PNG", type: "image/png" },
      { rel: "apple-touch-icon", href: "/icon-512.PNG" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{ __html: `
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    window.deferredPrompt = e;
    window.dispatchEvent(new CustomEvent('pwa-installable'));
  });
` }} />
        <HeadContent />
        <script
          async
          src="https://cloud.umami.is/script.js"
          data-website-id="bff4d430-2078-4a1e-bc86-803930542c56"
        />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}
const SW_REGISTER = `
(function () {
  if (!('serviceWorker' in navigator)) return;
  try {
    var inIframe = window.self !== window.top;
    var host = window.location.hostname;
    var isPreview =
      host.indexOf('id-preview--') !== -1 ||
      host.indexOf('lovableproject.com') !== -1 ||
      host.indexOf('lovable.app') !== -1 && host.indexOf('id-preview--') !== -1;
    if (inIframe || isPreview) {
      navigator.serviceWorker.getRegistrations().then(function (rs) {
        rs.forEach(function (r) { r.unregister(); });
      });
      return;
    }
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('/sw.js').catch(function () {});
    });
  } catch (e) {}
})();
`;

const UMAMI_ID = import.meta.env.VITE_UMAMI_WEBSITE_ID ?? "bff4d430-2078-4a1e-bc86-803930542c56";
const UMAMI_URL = import.meta.env.VITE_UMAMI_URL ?? "https://cloud.umami.is/script.js";

function RootComponent() {
  return (
    <>
      <Layout />
      <script dangerouslySetInnerHTML={{ __html: SW_REGISTER }} />
      {UMAMI_ID && UMAMI_URL && (
        <script
          defer
          src={UMAMI_URL}
          data-website-id={UMAMI_ID}
        />
      )}
    </>
  );
}
