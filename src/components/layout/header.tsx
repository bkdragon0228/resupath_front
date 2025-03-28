"use client";

import { useThemeStore } from "@/src/providers/themeStoreProvider";
import { useAuthStore } from "@/src/stores/useAuthStore";
import { useLoginModalStore } from "@/src/stores/useLoginModalStore";
import { useRoomStore } from "@/src/stores/useRoomStore";
import { useRouter, usePathname } from "next/navigation";
import React, { FC, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";

/**
 * @author bkdragon
 * @function Header
 **/

const Header: FC = () => {
    const pathname = usePathname();
    const { theme, toggleTheme } = useThemeStore((state) => state);
    const router = useRouter();

    const { setIsOpen } = useLoginModalStore();
    const { checkLogin, clearAuth, user } = useAuthStore((state) => state);
    const { asyncListRooms } = useRoomStore((state) => state);

    const isLogin = checkLogin();

    useEffect(() => {
        document.documentElement.classList.toggle("dark", theme === "dark");
        document.cookie = `theme=${theme}; path=/; max-age=31536000; SameSite=Strict`;
    }, [theme]);

    if (pathname === "/login") {
        return null;
    }

    return (
        <header className="w-full bg-background text-text border-b border-solid border-gray-300 dark:border-gray-600">
            <div className="flex flex-row-reverse items-center gap-4 px-8 py-4 w-full">
                {isLogin && (
                    <Menu as="div" className="relative">
                        <Menu.Button className="flex gap-2 items-center hover:opacity-80 transition-opacity">
                            <FaUserCircle className="text-4xl" />
                            <span className="text-sm text-gray-500 dark:text-gray-600">{user?.name}님 환영해요!</span>
                        </Menu.Button>
                        <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                        >
                            <Menu.Items className="z-50 absolute right-0 mt-2 w-48 origin-top-right bg-white dark:bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                <div className="px-1 py-1">
                                    <Menu.Item>
                                        {({ active }) => (
                                            <button
                                                onClick={() => router.push("/mypage")}
                                                className={`${
                                                    active ? "bg-gray-100 dark:bg-gray-700" : ""
                                                } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                            >
                                                마이페이지
                                            </button>
                                        )}
                                    </Menu.Item>
                                    <Menu.Item>
                                        {({ active }) => (
                                            <button
                                                onClick={async () => {
                                                    clearAuth();
                                                    await asyncListRooms();
                                                    router.push("/");
                                                }}
                                                className={`${
                                                    active ? "bg-gray-100 dark:bg-gray-700" : ""
                                                } group flex w-full items-center rounded-md px-2 py-2 text-sm text-red-600 dark:text-red-400`}
                                            >
                                                로그아웃
                                            </button>
                                        )}
                                    </Menu.Item>
                                </div>
                            </Menu.Items>
                        </Transition>
                    </Menu>
                )}
                <button
                    onClick={toggleTheme}
                    className="p-2 transition-colors rounded-lg text-primary hover:bg-gray-200 dark:hover:bg-gray-700"
                    aria-label="테마 변경"
                >
                    {theme === "light" ? <MoonIcon /> : <SunIcon />}
                </button>
                {!isLogin && (
                    <button
                        onClick={() => setIsOpen(true)}
                        className="px-8 py-2 transition-colors rounded-lg text-primary border border-primary hover:bg-gray-200 dark:hover:bg-gray-700"
                    >
                        로그인
                    </button>
                )}
            </div>
        </header>
    );
};

export default Header;

function SunIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
            />
        </svg>
    );
}

function MoonIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
            />
        </svg>
    );
}
