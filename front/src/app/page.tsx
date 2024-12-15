import Link from 'next/link';

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
          <div className="flex justify-center space-x-1">
          <span className="text-orange-500 text-4xl font-bold">.</span>
          <span className="text-white text-4xl font-bold">.</span>
          <span className="text-white text-4xl font-bold ">.</span>
          </div>
     

        <div className="flex items-center mt-4">
          <h2 className="text-black text-3xl sm:text-5xl font-bold ">
            Read
          </h2>
          <img
            src="/logo.jpg"
            alt="Logo"
            className=" mx-2 w-20 h-20 sm:w-24 sm:h-24  rounded-[20px]"
          />
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