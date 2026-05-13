import Image from "next/image";
import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left - decorative */}
      <div className="hidden lg:relative lg:flex flex-col items-center justify-center bg-chocolate-950 px-16">
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=1000&q=80"
            alt="Orby Jewels"
            fill
            className="object-cover opacity-20"
          />
        </div>
        <div className="relative text-center">
          <p className="font-playfair text-6xl font-bold tracking-[0.15em] text-champagne-100 mb-2">
            ORBY
          </p>
          <p className="text-sm tracking-[0.5em] text-gold-400 uppercase mb-1">JEWELS</p>
          <p className="text-xs tracking-[0.3em] text-chocolate-400 mb-10">UNDER NERA GROUPS</p>
          <div className="w-px h-16 bg-gradient-to-b from-gold-500/0 via-gold-500 to-gold-500/0 mx-auto mb-10" />
          <p className="font-cormorant text-3xl text-champagne-200 italic">
            &ldquo;Where Elegance Meets Artistry&rdquo;
          </p>
          <div className="mt-12 grid grid-cols-3 gap-8 text-center">
            {[
              { number: "10K+", label: "Happy Customers" },
              { number: "500+", label: "Unique Designs" },
              { number: "4.9★", label: "Rating" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="font-playfair text-2xl text-gold-400">{stat.number}</p>
                <p className="text-[10px] tracking-widest uppercase text-champagne-400 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right - form */}
      <div className="flex flex-col min-h-screen bg-ivory-warm">
        <div className="flex items-center justify-between p-6 lg:p-8">
          <Link href="/" className="lg:hidden">
            <p className="font-playfair text-xl font-bold text-chocolate-950 tracking-widest">ORBY JEWELS</p>
          </Link>
          <Link href="/" className="hidden lg:block text-xs text-nude-500 hover:text-chocolate-950 transition-colors tracking-wider">
            ← Back to Store
          </Link>
        </div>
        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>
    </div>
  );
}
