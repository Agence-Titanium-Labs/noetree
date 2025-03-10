import Link from "next/link";

export default function Notes() {
  return (
    <div className="w-full h-screen flex flex-col justify-center items-center gap-8">
      <h1 className="text-8xl font-bold">Notes</h1>
      <Link href="/dashboard/notes/0">Note test</Link>
    </div>
  );
}
