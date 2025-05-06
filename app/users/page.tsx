"use client"

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const UsersPage = () => {
    const router = useRouter();

    useEffect(() => {
        router.push('/404');
    }, [router]);

    return null;
};

export default UsersPage;
