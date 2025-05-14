import Link from 'next/link';
import Image from 'next/image';
import "@ant-design/v5-patch-for-react-19";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="navbar shadow-2xs">
        <div className="navbar-start ml-6">
          <span className="text-2xl font-semibold text-base-content">KindBridge</span>
        </div>
        <div className="navbar-end space-x-5 mr-6" >
          <Link href="/login" className="btn btn-ghost">Login</Link>
          <Link href="/register" className="btn btn-neutral">Register</Link>
        </div>
      </header>

      {/* Left Section */}
      <section className="min-h-[calc(100vh-4rem)]">
        <div className="flex flex-col md:flex-row items-center justify-center gap-10 p-10 w-full">
          {/* Left Section */}
          <div className="max-w-xl flex items-center ml-40">
            <h2 className="text-4xl font-semibold text-base-content mb-4 leading-relaxed">
              A community-driven platform designed to connect students who need help with those willing to lend a hand
            </h2>
          </div>

          {/* Right Section */}
          <div className="flex flex-col max-w-lg items-center justify-center gap-10 p-10">
            <div className="relative rounded-box overflow-hidden w-full h-[300px]">
              <Image
                src="/cat.jpg"
                alt="Cat"
                fill
                style={{ objectFit: "cover", objectPosition: "top" }}
              />
            </div>
            <div className="max-w-xl text-lg leading-relaxed text-base-content/30">
              <p>
                Our motivation is to provide a transparent, efficient, and user-friendly platform that bridges the gap between those who need help and those who can offer it, promoting kindness and support within the student community.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
