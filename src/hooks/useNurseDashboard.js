'use client';

import useSWR from 'swr';

const fetcher = async (url) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`http://localhost:5000/api/v1${url}`, {
        headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) {
        const error = new Error('An error occurred while fetching the data.');
        error.info = await res.json();
        error.status = res.status;
        throw error;
    }

    const { data } = await res.json();
    return data;
};

const useNurseDashboard = (refreshKey = 0) => {
    const { data, error, mutate } = useSWR(['/nurse/dashboard-data', refreshKey], ([url]) => fetcher(url));

    return {
        data,
        isLoading: !error && !data,
        isError: error,
        refresh: mutate
    };
};

export default useNurseDashboard;
