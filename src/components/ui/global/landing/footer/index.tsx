"use client";

import React from 'react';
import { FiArrowUpRight } from 'react-icons/fi';

export const Footer = () => {
    return (
        <footer className="bg-[#f5f5f0] dark:bg-zinc-950 px-6 sm:px-12 lg:px-20 py-12 flex flex-col">



            {/* Middle Section - Contact Info */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12 mb-12 mt-16">
                <div className="flex-1"></div>

                <div className="flex flex-col gap-8 text-black dark:text-white">
                    <div>
                        <h3 className="font-semibold mb-3 text-sm">Address</h3>
                        <p className="text-base leading-relaxed">
                            India
                        </p>
                    </div>

                    <div className="flex flex-col gap-2">
                        <a
                            href="https://www.linkedin.com/in/j-harsh"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-base hover:opacity-60 transition-opacity"
                        >
                            LinkedIn
                        </a>
                        <a
                            href="https://github.com/j-harsh"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-base hover:opacity-60 transition-opacity"
                        >
                            GitHub
                        </a>
                    </div>


                </div>
            </div>

            {/* Bottom Section - CTA */}
            <div className="mt-auto">
                <p className="text-black dark:text-white text-sm mb-6 tracking-wide">
                    Got A Project In Mind?
                </p>

                <a
                    href="https://jharsh.me"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-8 hover:gap-12 transition-all"
                >
                    <h2 className="text-7xl sm:text-8xl md:text-9xl lg:text-[180px] font-bold text-black dark:text-white leading-none tracking-tight transition-all duration-300 group-hover:bg-gradient-to-r group-hover:from-emerald-400 group-hover:via-emerald-500 group-hover:to-green-600 group-hover:bg-clip-text group-hover:text-transparent">
                        LET&apos;S TALK
                    </h2>
                    <FiArrowUpRight className="size-16 sm:size-20 md:size-24 lg:size-32 text-black dark:text-white group-hover:rotate-45 transition-transform duration-300" />
                </a>
            </div>
        </footer>
    );
};

