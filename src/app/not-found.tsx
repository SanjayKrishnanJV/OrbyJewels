import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-ivory-warm flex items-center justify-center px-4">
      <div className="text-center">
        <p className="font-playfair text-9xl text-champagne-200 font-bold">404</p>
        <div className="w-16 h-px bg-gold-500 mx-auto my-6" />
        <h1 className="font-playfair text-3xl text-chocolate-950 mb-4">Page Not Found</h1>
        <p className="text-nude-500 mb-8 max-w-sm mx-auto">
          The page you&apos;re looking for seems to have wandered away like a piece of jewellery.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-10 py-4 bg-chocolate-950 text-champagne-100 text-sm font-medium tracking-widest uppercase hover:bg-chocolate-800 transition-colors"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
