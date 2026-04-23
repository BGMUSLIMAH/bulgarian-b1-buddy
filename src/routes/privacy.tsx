import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({
  component: PrivacyPage,
  ssr: false,
  head: () => ({
    meta: [
      { title: "Privacy Policy — Bulgarian Trainer" },
      { name: "description", content: "How Bulgarian Trainer handles your data: anonymized analytics, optional accounts, GDPR-compliant." },
    ],
  }),
});

function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl space-y-4">
      <h1 className="font-display text-4xl font-bold">Privacy Policy</h1>
      <p className="text-sm text-muted-foreground">Last updated: April 2026</p>

      <Section title="What we collect">
        <ul className="list-inside list-disc space-y-1">
          <li><strong>Anonymized usage analytics</strong> — page views and feature usage events via Umami. No cookies, no IP storage, no personal identifiers.</li>
          <li><strong>Account email</strong> — only if you choose to create an account, used solely to sign you in and recover your password.</li>
          <li><strong>Learning progress</strong> — only if you are signed in, your quiz answers and CEFR test results are saved so you can continue across devices. As a guest, your progress stays in your browser's localStorage on this device only.</li>
        </ul>
      </Section>

      <Section title="How it's stored">
        Account and progress data are stored in our managed Supabase database, hosted in the EU region. Connections use HTTPS. Row-level security ensures you can only read and write your own data.
      </Section>

      <Section title="Cookies & local storage">
        The App does not use tracking cookies. We use your browser's localStorage to remember your settings (theme, dismissed banners) and your offline learning progress when you are not signed in. Analytics are cookieless.
      </Section>

      <Section title="Sharing">
        We do <strong>not</strong> sell, rent, or share your personal data with third parties. The only sub-processors involved are: Supabase (database & authentication, EU), Umami (anonymous analytics), and Cloudflare (hosting / CDN).
      </Section>

      <Section title="Your rights (GDPR)">
        You can request a copy of your data, correction of inaccurate data, or full deletion of your account and all associated learning history at any time. Email us and we'll process the request within 30 days.
      </Section>

      <Section title="Children">
        The App is not directed at children under 13. We do not knowingly collect data from children under 13.
      </Section>

      <Section title="Contact">
        For data requests, deletion, or any privacy questions, email: <a href="mailto:amrani.amine.aero@gmail.com" className="text-primary underline">amrani.amine.aero@gmail.com</a>
      </Section>
    </article>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-2">
      <h2 className="text-xl font-semibold text-foreground">{title}</h2>
      <div className="text-sm leading-relaxed text-muted-foreground">{children}</div>
    </section>
  );
}
