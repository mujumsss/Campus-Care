import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import db from "@/lib/db";
import MainHeader from "@/components/main-header/main-header";
import NavAdmin from "@/components/left-nav/left-nav-admin";
import PageWrapper from "@/components/layout/page-wrapper";

export const metadata = {
  title: "Campus Care",
  description: "Your thoughts count",
};

export default async function AdminLayout({ children }) {
  const token = (await cookies()).get('session')?.value;

  if (!token) redirect('/login');

  const session = db.prepare('SELECT * FROM sessions WHERE token = ?').get(token);
  if (!session) redirect('/login');

  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(session.user_id);
  if (user.role !== 'admin') redirect('/anonymous');

  return (
    <>
      <MainHeader />
      <NavAdmin />
      <PageWrapper>
        {children}
      </PageWrapper>
    </>
  );
}
