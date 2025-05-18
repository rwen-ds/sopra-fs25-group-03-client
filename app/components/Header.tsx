"use client";

import Link from "next/link";

const Header: React.FC = () => {

    return (
        <header className="navbar shadow-2xs">
            <div className="navbar-start ml-6">
                <Link href="/" className="btn btn-neutral">Home</Link>
            </div>
        </header>
    );
};

export default Header;
