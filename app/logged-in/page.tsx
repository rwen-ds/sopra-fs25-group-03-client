import "@ant-design/v5-patch-for-react-19";
import Link from 'next/link';
import '@/styles/globals.css';
import { Button } from 'antd';

export default function LoggedIn() {
  return (
    <main className="logged-container">
      <header className="header">
        <div className="left-side">
          <div className="brand-name">
            <h1>KindBridge</h1>
          </div>
          <nav className="nav-links">
            <Link href="/requests">Requests</Link>
          </nav>
        </div>
      </header>

      <section className="logged-buttons">
        <Link href="/profile">
          <Button type="primary" size="large">My Page</Button>
        </Link>
        <Link href="requests/my-requests">
          <Button type="primary" size="large">My Requests</Button>
        </Link>
        <Link href="requests/post-request">
          <Button type="primary" size="large">Post Request</Button>
        </Link>
      </section>
    </main>
  );
}
