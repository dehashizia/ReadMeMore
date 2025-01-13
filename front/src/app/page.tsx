import Link from 'next/link';
export const metadata = {
  title: 'ReadMeMore - Your Favorite Book App',
  description: 'Discover and share your favorite books with ReadMeMore. Build your library, track your readings, and connect with other readers.',
  keywords: 'books, library, reading, app, ReadMeMore, favorite books',
  robots: 'index, follow',
  openGraph: {
    title: 'ReadMeMore - Your Favorite Book App',
    description: 'Discover and share your favorite books with ReadMeMore. Build your library, track your readings, and connect with other readers.',
    images: ['/logo.jpg'],
    url: 'https://www.readmemoreapp.com',
  },
};


export default function Home() {
  return (
    <main className="relative min-h-screen p-4 flex flex-col items-center justify-between">
      <div className="absolute top-0 right-0 h-full w-1/3">
        <div
          className="absolute top-0 right-0 w-full h-1/2 rounded-bl-full"
          style={{
            background: 'linear-gradient(to bottom, #6048b2, #18122f)',
            clipPath: 'ellipse(70% 100% at 100% 0%)',
          }}
        />
        <div
          className="absolute top-1/2 right-0 w-full h-1/2"
          style={{
            background: 'linear-gradient(to top, #a57f60, #6e5b54)',
            clipPath: 'ellipse(70% 100% at 100% 100%)',
          }}
        />
      </div>

      <div className="flex flex-col items-center justify-center flex-grow text-center">
        <h1 className="text-black text-2xl sm:text-4xl font-bold mb-4"> 
          Welcome to app
          </h1>
          <div className="flex items-center mt-4">
          <h2 className="text-black text-3xl sm:text-5xl font-bold ">
            Read
          </h2>
          <picture>
            <source srcSet="/logo.webp" type="image/webp" />
            <img
              src="/logo.jpg"
              alt="Logo"
              className="mx-2 w-20 h-20 sm:w-24 sm:h-24 rounded-[20px]"
            />
          </picture>
          <h2 className="text-black text-3xl sm:text-5xl font-bold ">
            eMore
          </h2>
        </div>
      </div>

      <Link href="/get-started"> {/* Utilisation de la balise Link pour la navigation */}
        <button 
          type="button" 
          className="mb-4 px-8 py-3 bg-[#964e25] text-black font-bold rounded-full hover:bg-[#884924] transition duration-300"
        >
          Get Started
        </button>
      </Link>
    </main>
  );
}