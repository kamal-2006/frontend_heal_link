import useSWR from 'swr';
import { get } from '../utils/api';

// Use centralized API helper and environment-configured base URL.
const fetcher = async (url) => {
    const response = await get(url);
    // get() returns the full API response; return only the `data` payload
    return response?.data;
};

export default function usePatientDashboard(refreshKey = 0) {
    const { data, error, mutate } = useSWR(['/patients/dashboard-data', refreshKey], ([url]) => fetcher(url));

    return {
        data,
        isLoading: !error && !data,
        isError: error,
        refresh: mutate
    };
}
