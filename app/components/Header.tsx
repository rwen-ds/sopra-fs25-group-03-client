"use client";

import Link from "next/link";

const Header: React.FC = () => {

    return (
        <header className="navbar shadow-2xs">
            <div className="navbar-start ml-6">
                <span className="text-2xl font-semibold text-base-content">KindBridge</span>
            </div>
            <div className="navbar-end space-x-5 mr-6" >
                <Link href="/" className="btn btn-neutral">Home</Link>
            </div>
        </header>
    );
};

export default Header;
