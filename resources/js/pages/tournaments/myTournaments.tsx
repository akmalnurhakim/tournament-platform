import { Head, Link, usePage } from '@inertiajs/react';
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
    sport_type?: SportType;
};

type PaginatedTournaments = {
    data: Tournament[];
    links: { url: string | null; label: string; active: boolean }[];
};

type PageProps = {
    tournaments: PaginatedTournaments;
};

const statusBadgeStyles: Record<string, string> = {
    draft: 'bg-gray-100 text-gray-700 border-gray-300',
    open: 'bg-green-100 text-green-800 border-green-300',
    closed: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    in_progress: 'bg-blue-100 text-blue-800 border-blue-300',
    completed: 'bg-purple-100 text-purple-800 border-purple-300',
};

export default function MyTournaments() {
    const { tournaments } = usePage<PageProps>().props;

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-MY', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });
    };

    return (
        <>
            <Head title="My Tournaments" />

            <div className="max-w-6xl mx-auto p-6">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold">My Tournaments</h1>
                    <Link
                        href="/tournaments/create"
                        className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
                    >
                        + Create Tournament
                    </Link>
                </div>

                {tournaments.data.length === 0 ? (
                    <div className="border rounded-xl p-8 text-center text-gray-500">
                        <p>You haven't organized any tournaments yet.</p>
                        <Link
                            href="/tournaments/create"
                            className="text-blue-600 hover:underline mt-2 inline-block"
                        >
                            Create your first tournament
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {tournaments.data.map((tournament) => (
                            <div
                                key={tournament.id}
                                className="border rounded-lg p-4 shadow-sm flex items-center justify-between flex-wrap gap-3"
                            >
                                <div>
                                    <div className="flex items-center gap-3">
                                        <h2 className="text-lg font-semibold">{tournament.name}</h2>
                                        <span
                                            className={`inline-block rounded-full border px-3 py-1 text-xs font-medium ${statusBadgeStyles[tournament.status] ?? ''}`}
                                        >
                                            {tournament.status}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1">
                                        {tournament.sport_type?.name} · {formatDate(tournament.start_date)}
                                        {' → '}
                                        {formatDate(tournament.end_date)}
                                    </p>
                                </div>

                                <div className="flex gap-4 text-sm">
                                    <Link
                                        href={`/tournaments/${tournament.id}`}
                                        className="text-gray-700 hover:underline"
                                    >
                                        View
                                    </Link>
                                    <Link
                                        href={`/tournaments/${tournament.id}/edit`}
                                        className="text-blue-600 hover:underline"
                                    >
                                        Edit
                                    </Link>
                                    <Link
                                        href={`/tournaments/${tournament.id}/registrations`}
                                        className="text-blue-600 hover:underline"
                                    >
                                        Registrations
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {tournaments.links.length > 3 && (
                    <div className="mt-8 flex gap-2 flex-wrap">
                        {tournaments.links.map((link, i) => (
                            <Link
                                key={i}
                                href={link.url ?? '#'}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                className={`px-3 py-1 border rounded text-sm ${
                                    link.active ? 'bg-blue-600 text-white' : 'text-gray-700'
                                } ${!link.url ? 'pointer-events-none opacity-50' : ''}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

MyTournaments.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'My Tournaments', href: '/my-tournaments' },
    ],
};