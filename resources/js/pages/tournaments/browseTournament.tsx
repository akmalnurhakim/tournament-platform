import { Head, Link } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
import { dashboard } from '@/routes';

type SportType = {
    id: number;
    name: string;
};

type Tournament = {
    id: number;
    name: string;
    status: string;
    start_date: string;
    end_date: string;
    sport_type_id: number;
    sport_type?: SportType;
};

export default function TournamentIndex() {
    const [tournaments, setTournaments] = useState<Tournament[]>([]);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [sportFilter, setSportFilter] = useState('');

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString(
            'en-MY',
            {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            }
        );
    };

    useEffect(() => {
        fetch('/api/tournaments')
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    setTournaments(data);
                } else {
                    setTournaments([]);
                }
            })
            .catch((err) => console.error(err));
    }, []);

    const sportTypes = useMemo(() => {
        return tournaments
            .map(t => t.sport_type)
            .filter((s): s is SportType => Boolean(s))
            .filter(
                (sport, index, self) =>
                    index === self.findIndex(
                        s => s.id === sport.id
                    )
            );
    }, [tournaments]);

    const statuses = useMemo(() => {
        return [...new Set(tournaments.map((t) => t.status))];
    }, [tournaments]);

    const filteredTournaments = useMemo(() => {
        return tournaments.filter((tournament) => {
            const matchesSearch = tournament.name
                ?.toLowerCase()
                .includes(search.toLowerCase());

            const matchesStatus =
                !statusFilter || tournament.status === statusFilter;

            const matchesSport =
                !sportFilter ||
                String(tournament.sport_type_id) === sportFilter;

            return matchesSearch && matchesStatus && matchesSport;
        });
    }, [tournaments, search, statusFilter, sportFilter]);

    return (
        <>
            <Head title="Browse Tournaments" />

            <div className="max-w-6xl mx-auto p-6">
                <h1 className="text-2xl font-bold mb-6">
                    Browse Tournaments
                </h1>

                {/* Search & Filters */}
                <div className="mb-6 grid gap-4 md:grid-cols-3">
                    <input
                        type="text"
                        placeholder="Search tournament..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="border rounded-lg px-4 py-2"
                    />

                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="border rounded-lg px-4 py-2"
                    >
                        <option value="">All Statuses</option>

                        {statuses.map((status) => (
                            <option key={status} value={status}>
                                {status}
                            </option>
                        ))}
                    </select>

                    <select
                        value={sportFilter}
                        onChange={(e) => setSportFilter(e.target.value)}
                        className="border rounded-lg px-4 py-2"
                    >
                        <option value="">All Sports</option>

                        {sportTypes.map((sport) => (
                            <option
                                key={sport.id}
                                value={sport.id}
                            >
                                {sport.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-4 text-sm text-gray-500">
                    {filteredTournaments.length} tournament(s) found
                </div>

                {filteredTournaments.length === 0 ? (
                    <p className="text-gray-500">
                        No tournaments match your search.
                    </p>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2">
                        {filteredTournaments.map((tournament) => (
                            <div
                                key={tournament.id}
                                className="border rounded-lg p-4 shadow hover:shadow-md transition"
                            >
                                <h2 className="text-xl font-semibold">
                                    {tournament.name}
                                </h2>

                                <p className="text-sm text-gray-600">
                                    Sport Type: {tournament.sport_type?.name}
                                </p>

                                <p className="text-sm text-gray-600">
                                    Status: {tournament.status}
                                </p>

                                <p className="text-sm text-gray-600">
                                    {formatDate(tournament.start_date)}
                                    {' → '}
                                    {formatDate(tournament.end_date)}
                                </p>

                                <Link
                                    href={`/tournaments/${tournament.id}`}
                                    className="mt-3 inline-block text-blue-600 hover:underline"
                                >
                                    View Details
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

TournamentIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Browse Tournaments', href: '/tournaments' },
    ],
};