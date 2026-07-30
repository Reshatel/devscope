import { ProfileSearch } from "@/components/ProfileSearch";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <h1 className="text-center text-3xl font-bold text-gray-900">
        DevScope
      </h1>
      <p className="text-center text-gray-500 mt-2">
        Аналізуй GitHub-профілі за секунди
      </p>
      <ProfileSearch />
    </main>
  );
}