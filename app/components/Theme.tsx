"use client";

import Link from "next/link";

const Header: React.FC = () => {
    return (
        <header className="navbar shadow-sm h-16">
            <div className="navbar-start ml-6">
                <span className="text-2xl font-semibold text-primary-content">KindBridge</span>
            </div>
            <div className="navbar-end space-x-5">
                <Link href="/logged-in" className="btn btn-primary text-sm">
                    Home
                </Link>

                {/* Theme Dropdown */}
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn m-1">
                        Theme
                        <svg
                            width="12px"
                            height="12px"
                            className="inline-block h-2 w-2 fill-current opacity-60"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 2048 2048"
                        >
                            <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path>
                        </svg>
                    </div>
                    <ul className="dropdown-content bg-base-300 rounded-box z-50 w-52 p-2 shadow-2xl">
                        <li>
                            <input
                                type="radio"
                                name="theme-dropdown"
                                className="theme-controller w-full btn btn-sm btn-block btn-ghost justify-start"
                                aria-label="Default"
                                value="default"
                            />
                        </li>
                        <li>
                            <input
                                type="radio"
                                name="theme-dropdown"
                                className="theme-controller w-full btn btn-sm btn-block btn-ghost justify-start"
                                aria-label="Pastel"
                                value="pastel"
                            />
                        </li>
                        <li>
                            <input
                                type="radio"
                                name="theme-dropdown"
                                className="theme-controller w-full btn btn-sm btn-block btn-ghost justify-start"
                                aria-label="Cyberpunk"
                                value="cyberpunk"
                            />
                        </li>
                        <li>
                            <input
                                type="radio"
                                name="theme-dropdown"
                                className="theme-controller w-full btn btn-sm btn-block btn-ghost justify-start"
                                aria-label="Valentine"
                                value="valentine"
                            />
                        </li>
                        <li>
                            <input
                                type="radio"
                                name="theme-dropdown"
                                className="theme-controller w-full btn btn-sm btn-block btn-ghost justify-start"
                                aria-label="Aqua"
                                value="aqua"
                            />
                        </li>
                    </ul>
                </div>
            </div>
        </header>
    );
};

export default Header;
