import Link from "next/link";

export default function ErrorPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold text-primary">Something went wrong!</h1>
      <p className="mt-4 text-gray-700">We are unable to load the data at the moment.</p>
      <Link href="/" className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        Go back to Home
      </Link>
    </div>
  );
}
