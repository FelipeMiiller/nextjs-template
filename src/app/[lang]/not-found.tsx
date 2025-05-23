import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col justify-center items-center pt-24 md:mt-24 md:flex-row md:items-center md:justify-center md:space-x-6">
      <div className="pt-24 pb-8 space-x-2 md:space-y-5">
        <h1 className="text-6xl font-extrabold tracking-tight leading-9 text-gray-900 dark:text-gray-100 md:border-r-2 md:px-6 md:text-8xl md:leading-14">
          404
        </h1>
      </div>
      <div className="max-w-md">
        <p className="mb-4 text-xl font-bold leading-normal md:text-2xl">
          Sorry we couldn&apos;t find this page
        </p>
        <p className="mb-8">But dont worry, you can find plenty of other things on our homepage.</p>
        <Link
          href="/"
          className="inline px-4 py-2 text-sm font-medium leading-5 rounded-lg border border-transparent shadow transition-colors duration-150 focus:shadow-outline-blue bg-foreground text-secondary hover:bg-primary focus:outline-none"
        >
          Back to homepage
        </Link>
      </div>
    </div>
  );
}
