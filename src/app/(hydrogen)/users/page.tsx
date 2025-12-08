import UserList from '@/app/shared/ecommerce/dashboard/user-list';
import { metaObject } from '@/config/site.config';

export const metadata = {
    ...metaObject('Users'),
};

export default function UsersPage() {
    return <UserList />;
}
