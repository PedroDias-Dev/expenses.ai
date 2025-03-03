import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-zinc-900 text-white">
      {/* Navigation */}
      <nav className="w-full bg-zinc-800 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-[#5c55df] rounded-md flex items-center justify-center">
              <span className="text-white font-bold">e</span>
            </div>
            <h1 className="text-xl font-bold">expenses.ai</h1>
          </div>
          <Link
            href="/login"
            className="px-4 py-2 bg-[#4a43de] hover:bg-blue-700 rounded-md transition-colors"
          >
            Login
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto py-20 px-4 flex flex-col items-center text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          Manage Expenses <span className="text-[#5c55df]">Smarter</span>
        </h1>
        <p className="text-xl text-zinc-300 max-w-2xl mb-10">
          Let AI handle your expense tracking. Save time, reduce errors, and
          gain insights into your spending with expenses.ai.
        </p>
        <Link
          href="/login"
          className="px-8 py-4 bg-[#4a43de] hover:bg-blue-700 rounded-lg text-xl font-bold transition-all hover:scale-105 shadow-lg"
        >
          Get Started Free
        </Link>
      </section>

      {/* Features Section */}
      <section className="container mx-auto py-16 px-4 bg-zinc-800 rounded-xl">
        <h2 className="text-3xl font-bold text-center mb-12">Smart Features</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "AI Receipt Scanning",
              description:
                "Instantly extract data from receipts with our advanced AI technology.",
            },
            {
              title: "Spending Insights",
              description:
                "Get personalized insights and recommendations to optimize your spending.",
            },
            {
              title: "Easy Integration",
              description:
                "Connect with your favorite accounting software and banking apps.",
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="p-6 bg-zinc-700 rounded-lg hover:bg-zinc-600 transition-colors"
            >
              <div className="w-12 h-12 bg-[#5c55df] rounded-full mb-4 flex items-center justify-center">
                <span className="text-2xl">✓</span>
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-zinc-300">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto py-20 px-4 text-center">
        <h2 className="text-4xl font-bold mb-6">
          Ready to simplify your expenses?
        </h2>
        <p className="text-xl text-zinc-300 max-w-2xl mx-auto mb-10">
          Join thousands of users who save time and money with expenses.ai
        </p>
        <Link
          href="/login"
          className="px-8 py-4 bg-[#4a43de] hover:bg-blue-700 rounded-lg text-xl font-bold transition-all hover:scale-105 shadow-lg"
        >
          Start Now
        </Link>
      </section>

      {/* Footer */}
      <footer className="w-full bg-zinc-800 py-8 px-4">
        <div className="container mx-auto text-center text-zinc-400">
          <p>© 2023 expenses.ai - AI-powered expense management</p>
        </div>
      </footer>
    </main>
  );
}
