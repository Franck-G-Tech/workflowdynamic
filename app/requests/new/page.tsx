import { currentUser } from "@clerk/nextjs/server";
import { client } from "@/lib/sanity";
import VacationRequestForm from "@/components/VacationRequestForm";
import { redirect } from "next/navigation";

export default async function NewRequestPage() {
    const user = await currentUser();

    if (!user) {
        redirect("/sign-in");
    }

    // Buscar el usuario en Sanity usando el Clerk ID
    const sanityUser = await client.fetch(
        `*[_type == "user" && clerk_id == $clerkId][0]`,
        { clerkId: user.id }
    );

    if (!sanityUser) {
        return (
            <div className="p-8 text-center">
                <h1 className="text-2xl font-bold text-red-600">Usuario no encontrado</h1>
                <p>No se encontró un perfil de usuario en el sistema vinculado a tu cuenta.</p>
                <p className="text-sm text-gray-500 mt-2">Clerk ID: {user.id}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="text-center text-3xl font-extrabold text-gray-900">
                    Solicitar Vacaciones
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Hola, {sanityUser.name}. Completa el formulario para solicitar tus días.
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <VacationRequestForm sanityUserId={sanityUser._id} />
            </div>
        </div>
    );
}
