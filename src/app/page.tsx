import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-900">Class Marks Entry System</h1>
          <p className="mt-2 text-gray-600">Secure platform for students to rate classmates and view their scores</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="card p-6 text-center">
            <div className="flex justify-center mb-3">
              <div className="h-12 w-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-2xl">🧑</div>
            </div>
            <h2 className="text-lg font-semibold">Student Login</h2>
            <p className="card-subtle mt-1">Access your dashboard to rate classmates and view your scores</p>
            <div className="mt-4 space-y-3">
              <Link href="/student/login" className="button-primary w-full text-center">Student Login</Link>
              <Link href="/student/register" className="button-outline w-full text-center">New Student Registration</Link>
            </div>
          </div>

          <div className="card p-6 text-center">
            <div className="flex justify-center mb-3">
              <div className="h-12 w-12 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-2xl">🛡️</div>
            </div>
            <h2 className="text-lg font-semibold">Admin Login</h2>
            <p className="card-subtle mt-1">Manage classes and view all marks entries with timestamps</p>
            <div className="mt-4">
              <Link href="/admin/login" className="inline-flex items-center justify-center rounded-md bg-green-600 text-white px-4 py-2 text-sm font-medium shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 w-full text-center">Admin Login</Link>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="card-header mb-4">System Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="mx-auto h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xl">⭐</div>
              <div className="mt-2 font-medium">Rate Classmates</div>
              <div className="card-subtle">Give marks to fellow students using roll numbers</div>
            </div>
            <div>
              <div className="mx-auto h-10 w-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-xl">📊</div>
              <div className="mt-2 font-medium">View Your Score</div>
              <div className="card-subtle">See total marks received from classmates</div>
            </div>
            <div>
              <div className="mx-auto h-10 w-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-xl">🔒</div>
              <div className="mt-2 font-medium">Secure Access</div>
              <div className="card-subtle">One-time marking with timestamp tracking</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
