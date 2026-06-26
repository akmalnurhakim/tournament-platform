import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { dashboard } from '@/routes';

export default function Dashboard() {
    const [stats, setStats] = useState({
        tournaments: 0,
        teams: 0,
        players: 0,
        matches: 0,
    });

    useEffect(() => {
        fetch('/api/dashboard-stats')
            .then(res => res.json())
            .then(data => setStats(data))
            .catch(err => console.error(err));
    }, []);

    return (
        <>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border p-4">
                        <p className="text-md font-semibold">Tournaments</p>
                        <p className="text-2xl">{stats.tournaments}</p>
                    </div>
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border p-4">
                        <p className="text-md font-semibold">Teams</p>
                        <p className="text-2xl">{stats.teams}</p>
                    </div>
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border p-4">
                        <p className="text-md font-semibold">Players</p>
                        <p className="text-2xl">{stats.players}</p>
                    </div>
                </div>
                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border p-4">
                    <p className="text-md font-semibold">Upcoming Matches</p>
                    <p className="text-2xl">{stats.matches}</p>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
