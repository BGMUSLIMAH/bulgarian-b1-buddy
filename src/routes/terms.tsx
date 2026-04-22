import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/terms")({
  component: TermsPage,
  head: () => ({
    meta: [
      { title: "Terms of Service — Bulgarian Trainer" },
      { name: "description", content: "Terms of service for the Bulgarian Trainer learning app." },
    ],
  }),
});

function TermsPage() {
  return (
    <article className="prose prose-invert mx-auto max-w-3xl space-y-4">
      <h1 className="font-display text-4xl font-bold">Terms of Service</h1>
      <p className="text-sm text-muted-foreground">Last updated: April 2026</p>

      <Section title="1. Acceptance">
        By using Български Trainer (the "App") you agree to these Terms. If you don't agree, please don't use the App.
      </Section>

      <Section title="2. Educational use only">
        The App is provided <em>as-is</em> for personal educational purposes. It is a learning aid and does not constitute, replace, or guarantee any official language certification (CEFR, university placement, or otherwise). Results shown inside the App are estimates only.
      </Section>

      <Section title="3. Your account">
        Accounts are optional. If you create one, you are responsible for safeguarding your credentials and for all activity under your account. Notify us immediately of any unauthorized use.
      </Section>

      <Section title="4. Acceptable use">
        Don't attempt to disrupt the service, scrape large portions of the content, reverse-engineer the App, or use it to harm others. The vocabulary, sentences, and exercises are provided for individual learning, not for redistribution.
      </Section>

      <Section title="5. Future paid tiers">
        The App is currently free. The developer reserves the right to introduce paid tiers, premium features, or subscriptions in the future. Existing free features will remain available in some form, and any changes will be announced in advance.
      </Section>

      <Section title="6. No warranty">
        The App is provided without any warranty of any kind, express or implied. The developer is not liable for any direct or indirect damages arising from use of the App, to the extent permitted by applicable law.
      </Section>

      <Section title="7. Changes to these Terms">
        These Terms may be updated occasionally. Material changes will be highlighted on the home page. Continuing to use the App after changes constitutes acceptance.
      </Section>

      <Section title="8. Governing law">
        These Terms are governed by the laws of the Republic of Bulgaria. Any disputes shall be resolved by the competent courts in Bulgaria.
      </Section>

      <Section title="9. Contact">
        Questions or concerns? See the contact details in our <Link to="/privacy" className="text-primary underline">Privacy Policy</Link>.
      </Section>
    </article>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-2">
      <h2 className="text-xl font-semibold text-foreground">{title}</h2>
      <p className="text-sm leading-relaxed text-muted-foreground">{children}</p>
    </section>
  );
}
