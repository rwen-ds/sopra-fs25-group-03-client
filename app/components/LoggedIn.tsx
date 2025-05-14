"use client";

import Link from "next/link";

const Header: React.FC = () => {

    return (
        <header className="navbar">
            <div className="navbar-start ml-6">
                <Link href="/logged-in" className="btn btn-neutral">Home</Link>
            </div>
        </header>
    );
};

export default Header;
