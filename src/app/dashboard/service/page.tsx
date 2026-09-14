const CLOUD_REGISTRY_UI_BASE_URL =
  process.env.CLOUD_REGISTRY_UI_BASE_URL?.replace(/\/$/, '') ||
  'https://elixir-on.cloud';

const loginUrl = `${CLOUD_REGISTRY_UI_BASE_URL}/auth/login`;
const servicesUrl = `${CLOUD_REGISTRY_UI_BASE_URL}/dashboard/services`;

export default function DashboardServiceLoginPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-20">
      <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-semibold text-slate-900">Cloud Registry Access</h1>
        <p className="mt-4 text-slate-600">
          Sign in here to access the Cloud Registry services dashboard.
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
          <a
            href={loginUrl}
            className="rounded-lg bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700"
          >
            Sign In to Cloud Registry
          </a>
          <a
            href={servicesUrl}
            className="rounded-lg border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Open Services Dashboard
          </a>
        </div>
      </section>
    </main>
  );
}
