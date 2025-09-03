
import Link from "next/link";

const HeroSection = () => {
  return (
    <section className="relative h-[36rem] flex items-center  justify-center ">

      {/* Top gradient blob */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 -translate-y-1/2 blur-3xl"
      >
        <div
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
          className="w-[50rem] aspect-[1155/678] bg-gradient-to-tr from-[#ffff] to-[#000000] opacity-40"
        ></div>
      </div>

      {/* Hero Content */}
      <div className="container mx-auto px-4 text-center relative">
        <div className="mb-10 inline-flex text-xs rounded-lg border border-white py-1 px-4 font-medium text-white">
          Exciting News! Introducing our latest innovation
        </div>
        <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6">
          Experience a new level of{" "}
          <span className="text-yellow-200">performance</span> and{" "}
          <span className="text-yellow-200">functionality</span>.
        </h1>
        <p className="text-lg text-white mb-8">
          The time is now for it to be okay to be great. For being a bright
          color. For standing out.
        </p>
        
<button className="px-6 py-2 rounded-lg font-semibold 
  border-2 border-green-400 text-green-300 
  hover:bg-green-400 hover:text-black 
  transition duration-300">
  Get Started
</button>
      </div>

      {/* Bottom gradient blob */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 right-0 -translate-y-0  blur-3xl"
      >
        <div
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
          className="w-[50rem] aspect-[1155/678] bg-gradient-to-tr from-[#000000] to-[#fff] opacity-40"
        ></div>
      </div>
    </section>
  );
};

export default HeroSection;

