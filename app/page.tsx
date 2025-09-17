import LeadsConsole from "./components/leads/leads-console";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50/20 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Modern header with gradient text */}
        <header className="text-center mb-12 animate-fade-in">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gradient mb-4">
              Mini Seller Console
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto">
              Streamline your sales process with our modern lead management platform. 
              Track, convert, and grow your business effortlessly.
            </p>
            <div className="mt-6 h-1 w-24 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full mx-auto"></div>
          </div>
        </header>
        
        {/* Main content with enhanced spacing */}
        <div className="animate-slide-up">
          <LeadsConsole />
        </div>
      </main>
      
      {/* Background decorative elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-primary-100 dark:bg-primary-900/20 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-purple-100 dark:bg-purple-900/20 rounded-full opacity-20 blur-3xl"></div>
      </div>
    </div>
  );
}
