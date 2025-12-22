"use client";

import { useUser, UserButton } from "@clerk/nextjs";

export default function UserAccount() {
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded || !isSignedIn) return null;

  return (
    <div className="flex items-center gap-3 p-2 px-4 rounded-2xl bg-gray-800/50 border border-gray-700 backdrop-blur-sm">
      <div className="flex-shrink-0">
        <UserButton appearance={{ elements: { avatarBox: "w-10 h-10" } }} />
      </div>

      <div className="flex flex-col min-w-0">
        <span className="text-sm font-bold text-white truncate">
          {user.fullName}
        </span>
        <span className="text-[10px] text-gray-400 truncate">
          {user.primaryEmailAddress?.emailAddress}
        </span>
      </div>
    </div>
  );
}