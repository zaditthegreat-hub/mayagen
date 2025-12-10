import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';
import Dashboard from '@/app/shared/ecommerce/dashboard';
import TenantDashboard from '@/app/shared/tenant/dashboard/page';
import { metaObject } from '@/config/site.config';

export const metadata = {
  ...metaObject(),
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const userRole = (session?.user as any)?.role;

  if (userRole === 'TENANT') {
    return <TenantDashboard />;
  }

  return <Dashboard />;
}
