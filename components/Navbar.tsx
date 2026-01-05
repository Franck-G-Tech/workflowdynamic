"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import UserAccount from './UserAccount';

export default function Navbar() {
  const pathname = usePathname();
  const hideUserAccount = pathname.startsWith('/studio');

  return (
    <>
      <Link 
        href="/" 
        className="absolute top-6 left-6 z-50 text-2xl font-bold tracking-tighter hover:opacity-80 transition-opacity"
      >
        Work<span className="text-blue-500">Flow</span>
      </Link>
      {!hideUserAccount && (
        <div className="absolute top-6 right-6 z-50">
          <UserAccount />
        </div>
      )}
    </>
  );
}