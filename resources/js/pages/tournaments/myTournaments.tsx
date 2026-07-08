import { Head, Link, router, usePage } from '@inertiajs/react';
import { dashboard } from '@/routes';
import Toast from '@/components/toast';

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

type PageProps = {
    tournaments: Tournament[];
    statusLabels: Record<string, string>;
    flash: { success?: string; error?: string };
};

const statusColors: Record<string, string> = {
    draft:       'bg-gray-500/15 text-gray-600 dark:text-gray-400 border-gray-500/30',
    open:        'bg-green-500/15 text-green-700 dark:text-green-400 border-green-500/30',
    closed:      'bg-yellow-500/15 text-yellow-700 dark:text-yellow-400 border-yellow-500/30',
    in_progress: 'bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30',
    completed:   'bg-purple-500/15 text-purple-700 dark:text-purple-400 border-purple-500/30',
};

export default function MyTournaments() {
    const { tournaments, statusLabels, flash } = usePage<PageProps>().props;

    const formatDate = (date: string) =>
        new Date(date).toLocaleDateString('en-MY', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });

    return (
        <>
            <Head title="My Tournaments" />

            {flash?.success && (
                <Toast message={flash.success} variant="success" />
            )}

            <div className="w-full space-y-6 p-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">My Tournaments</h1>
                        <p className="text-muted-foreground">
                            Tournaments you are organizing
                        </p>
                    </div>
                    <Link
                        href="/tournaments/create"
                        className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                    >
                        + New Tournament
                    </Link>
                </div>

                {tournaments.length === 0 && (
                    <div className="rounded-xl border p-10 text-center text-muted-foreground">
                        You haven't created any tournaments yet.
                    </div>
                )}

                <div className="space-y-3">
                    {tournaments.map((tournament) => (
                        <div
                            key={tournament.id}
                            className="rounded-xl border bg-card p-5 flex items-center justify-between gap-4"
                        >
                            {/* Left — info */}
                            <div className="space-y-1 min-w-0">
                                <p className="font-semibold truncate">
                                    {tournament.name}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {tournament.sport_type?.name}
                                    {' · '}
                                    {formatDate(tournament.start_date)}
                                    {' → '}
                                    {formatDate(tournament.end_date)}
                                </p>
                            </div>

                            {/* Right — status + actions */}
                            <div className="flex items-center gap-2 shrink-0">
                                <span
                                    className={`inline-block rounded-full border px-3 py-1 text-xs font-medium ${statusColors[tournament.status]}`}
                                >
                                    {statusLabels[tournament.status] ?? tournament.status}
                                </span>

                                <Link
                                    href={`/tournaments/${tournament.id}`}
                                    className="px-3 py-1.5 text-sm border rounded-lg hover:bg-accent transition-colors"
                                >
                                    View
                                </Link>

                                <Link
                                    href={`/tournaments/${tournament.id}/registrations`}
                                    className="px-3 py-1.5 text-sm border rounded-lg hover:bg-accent transition-colors"
                                >
                                    Registrations
                                </Link>
                                <Link
                                    href={`/tournaments/${tournament.id}/edit`}
                                    className="px-3 py-1.5 text-sm border rounded-lg hover:bg-accent transition-colors"
                                >
                                    Edit
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

MyTournaments.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'My Tournaments', href: '#' },
    ],
};