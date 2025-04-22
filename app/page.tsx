import Link from 'next/link';
import './styles/globals.css';
import Image from 'next/image';
import "@ant-design/v5-patch-for-react-19";

export default function Home() {
  return (
    <main className="main-container">
      <header className="header">
        <div className="left-side">
          <div className="brand-name">
            <h1>KindBridge</h1>
          </div>
          <nav className="nav-links">
            <Link href="/requests">Requests</Link>
          </nav>
        </div>
        <div className="right-side">
          <nav className="nav-links">
            <Link href="/login">Login</Link>
            <Link href="/register">Register</Link>
          </nav>
        </div>
      </header>

      <section className="main-content">
        <section className="hero-text">
          <h2>A community-driven platform designed to connect students who need help with those willing to lend a hand.</h2>
        </section>

        <section className="image-text-container">
          <div className="image-container">
            <Image
              src="/cat.png"
              alt="Cat"
              className="motivation-image"
              width={470}
              height={265}
              layout="intrinsic"
            />
          </div>
          <div className="text-container">
            <p>
              Our motivation is to provide a transparent, efficient, and user-friendly platform that bridges the gap between those who need help and those who can offer it, promoting kindness and support within the student community.
            </p>
          </div>
        </section>
      </section>

      <section className="request-list">
        {/* Add your request cards here */}
      </section>
    </main>
  );
}
