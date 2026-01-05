import { currentUser } from "@clerk/nextjs/server";
import { client } from "@/lib/sanity";
import VacationRequestForm from "@/components/VacationRequestForm";
import { redirect } from "next/navigation";

export default async function NewRequestPage() {
    const user = await currentUser();

    if (!user) redirect("/sign-in");

    const sanityUser = await client.fetch(
        `*[_type == "user" && clerk_id == $clerkId][0]`,
        { clerkId: user.id }
    );

    if (!sanityUser) {
        return (
            <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6">
                <div className="text-center p-8 bg-[#1e293b] rounded-2xl border border-red-500/20">
                    <h1 className="text-red-500 font-bold text-xl">Usuario no encontrado</h1>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0b0e14] flex flex-col justify-center py-12 px-4">
            <div className="sm:mx-auto sm:w-full sm:max-w-md mb-8 text-center">
                <h2 className="text-3xl font-black text-white tracking-tight">
                    Solicitar Vacaciones
                </h2>
                <p className="mt-3 text-gray-400">
                    Hola, <span className="text-blue-500 font-medium">{sanityUser.name}</span>. 
                    Indica tus fechas de descanso.
                </p>
            </div>

            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <VacationRequestForm sanityUserId={sanityUser._id} clerkUserId={user.id} />
            </div>
        </div>
    );
}