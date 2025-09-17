import LeadsConsole from "./components/leads/leads-console";

export default function HomePage() {
  return (
    <main className="container mx-auto p-4 sm:p-6 lg:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Mini Seller Console</h1>
        <p className="text-slate-500 mt-1">Manage your leads and opportunities with ease.</p>
      </header>
      
      {/* The client component will handle fetching and all logic */}
      <LeadsConsole />
    </main>
  );
}
