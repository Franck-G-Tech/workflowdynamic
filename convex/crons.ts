import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.cron(
  "Actualizar vacaciones anuales",
  "0 0 1 1 *", // Cron syntax: Minuto 0, Hora 0, Día 1, Mes 1, Cualquier día semana
  internal.Users.updateAllUsersVacations
);

export default crons;