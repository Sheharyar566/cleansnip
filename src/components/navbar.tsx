import Link from "next/link";
import Image from "next/image";

const Navbar = () => {
  return (
    <div className="w-full">
      <nav className="container relative flex flex-wrap items-center justify-between p-8 mx-auto lg:justify-between xl:px-0">
        <Link href="/">
          <span className="flex items-center space-x-2 text-2xl font-bold text-primary dark:text-gray-100">
            <span>
              <Image
                src="/img/logo.png"
                alt="Logo"
                width={100}
                height={100}
                className="w-10"
              />
            </span>
            <span>CleanSnip</span>
          </span>
        </Link>

        <Link
          href="/"
          className="px-6 py-2 text-white bg-primary rounded-md md:ml-5"
        >
          Get Started
        </Link>
      </nav>
    </div>
  );
};

export default Navbar;
