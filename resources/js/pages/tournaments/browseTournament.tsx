import { Head } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
import { dashboard } from '@/routes';

export default function TournamentIndex() {
    const [tournaments, setTournaments] = useState<any[]>([]);
    const [selectedTournament, setSelectedTournament] = useState<any>(null);
    const [showModal, setShowModal] = useState(false);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [sportFilter, setSportFilter] = useState('');
    const formatDate = (date:string) => {
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
            .filter(Boolean)
            .filter(
                (sport,index,self) =>
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

    const openDetails = async (id:number) => {
        try {

            const response = await fetch(
                `/api/tournaments/${id}`
            );

            const data = await response.json();

            setSelectedTournament(data);
            setShowModal(true);

        } catch(error) {

            console.error(error);

        }

    };
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

                                <button
                                    onClick={() => openDetails(tournament.id)}
                                    className="mt-3 text-blue-600 hover:underline"
                                >
                                    View Details
                                </button>
                            </div>
                        ))}
                    </div>
                )}
                {showModal && selectedTournament && (
                    <div
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200"
                        onClick={() => setShowModal(false)}
                    >
                        <div
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header with accent gradient */}
                            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5 relative">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="absolute top-4 right-4 text-white/80 hover:text-white hover:bg-white/10 rounded-full p-1.5 transition-colors"
                                    aria-label="Close"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>

                                <h2 className="text-2xl font-bold text-white pr-8">
                                    {selectedTournament.name}
                                </h2>

                                <span className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 text-white backdrop-blur-sm">
                                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                                    {selectedTournament.status}
                                </span>
                            </div>

                            {/* Body */}
                            <div className="px-6 py-5 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">
                                            Sport
                                        </p>
                                        <p className="text-sm font-semibold text-gray-900">
                                            {selectedTournament.sport_type?.name ?? '—'}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">
                                            Organizer
                                        </p>
                                        <p className="text-sm font-semibold text-gray-900">
                                            {selectedTournament.organizer?.name ?? '—'}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">
                                        Schedule
                                    </p>
                                    <p className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                                        {formatDate(selectedTournament.start_date)}
                                        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                        {formatDate(selectedTournament.end_date)}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">
                                        Description
                                    </p>
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        {selectedTournament.description ?? 'No description provided.'}
                                    </p>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button className="px-4 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm transition-colors">
                                    Register
                                </button>
                            </div>
                        </div>
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