import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';
import ProfileHeader from '@/app/shared/profile/profile-header';
import ProfileDetails from '@/app/shared/profile/profile-details';
import { metaObject } from '@/config/site.config';

export const metadata = {
  ...metaObject('Profile'),
};

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  let userData = null;

  if ((session as any)?.accessToken) {
    try {
      const res = await fetch(`${apiUrl}/api/v1/admin/users/me`, {
        headers: {
          Authorization: `Bearer ${(session as any).accessToken}`,
        },
        cache: 'no-store', // Ensure fresh data
      });

      if (res.ok) {
        userData = await res.json();
      } else {
        console.error('Failed to fetch user profile:', res.status, res.statusText);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  }

  return (
    <div className="@container">
      <ProfileHeader user={userData} />
      <ProfileDetails />
    </div>
  );
}
