"use client";

import Link from "next/link";

const Header: React.FC = () => {

    return (
        <header className="navbar shadow-sm">
            <div className="navbar-start ml-6">
                <span className="text-3xl font-semibold text-primary-content">KindBridge</span>
            </div>
            <div className="navbar-end space-x-5 mr-6" >
                <Link href="/logged-in" className="btn btn-primary">Home</Link>
            </div>
        </header>
    );
};

export default Header;
