import { getGrievances } from "@/lib/grievance";

export async function GET() {
    const grievances = getGrievances();
    return Response.json(grievances);
}