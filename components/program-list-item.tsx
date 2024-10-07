import Link from "next/link";

export function ProgramListItem({ id, title }: { id: string; title: string }) {
  return (
    <Link
      href={`/programs/${id}`}
      className="flex items-center justify-center h-full w-full bg-white shadow-md rounded-md p-4 transform transition-transform hover:scale-105"
    >
      <p className="uppercase tracking-wide font-light">{title}</p>
    </Link>
  );
}
