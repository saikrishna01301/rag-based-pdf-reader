import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold text-zinc-800 dark:text-zinc-200">
          Welcome to MyPDF Reader!
        </h1>
        <p className="mb-8 text-zinc-600 dark:text-zinc-400">
          Your AI-powered PDF reading companion.
        </p>
        <Image
          src="/assets/ai-pdf-reader-illustration.png"
          alt="AI PDF Reader Illustration"
          width={500}
          height={300}
        />
      </div>
    </div>
  );
}
