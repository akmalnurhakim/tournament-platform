import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { X } from 'lucide-react';
import { dashboard } from '@/routes';
import Toast from '@/components/toast';

type TeamDetail = {
    id: number;
    name: string;
    logo: string | null;
    description: string | null;
    invite_code?: string;
    captain: { id: number; name: string };
    sport_type: { id: number; name: string };
    members: { id: number; name: string }[];
};

type Registration = {
    id: number;
    status: 'pending' | 'accepted' | 'rejected';
    created_at: string;
    team: TeamDetail | null;
    user: { id: number; name: string } | null;
};

type PageProps = {
    tournament: { id: number; name: string };
    registrations: Registration[];
    flash: { success?: string; error?: string };
};

const statusStyles: Record<Registration['status'], string> = {
    pending: 'bg-yellow-500/15 text-yellow-700 dark:text-yellow-400 border-yellow-500/30',
    accepted: 'bg-green-500/15 text-green-700 dark:text-green-400 border-green-500/30',
    rejected: 'bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/30',
};

function TeamPreviewModal({
    team,
    onClose,
}: {
    team: TeamDetail;
    onClose: () => void;
}) {
    return (
        <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div
                className="bg-card text-card-foreground border rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden max-h-[85vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="relative border-b px-6 pt-6 pb-5">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-muted-foreground hover:text-foreground hover:bg-accent rounded-full p-1.5 transition-colors"
                        aria-label="Close"
                    >
                        <X className="h-5 w-5" />
                    </button>

                    <div className="flex items-center gap-4">
                        {team.logo ? (
                            <img
                                src={`/storage/${team.logo}`}
                                alt={team.name}
                                className="h-16 w-16 rounded-full border object-cover"
                            />
                        ) : (
                            <div className="h-16 w-16 rounded-full border flex items-center justify-center text-lg font-bold">
                                {team.name.charAt(0).toUpperCase()}
                            </div>
                        )}
                        <div>
                            <h2 className="text-xl font-bold pr-8">{team.name}</h2>
                            <p className="text-sm text-muted-foreground">
                                {team.sport_type.name}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Body */}
                <div className="px-6 py-5 space-y-4">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        {team.description ?? 'No description available.'}
                    </p>

                    <div>
                        <p className="text-xs uppercase text-muted-foreground mb-1">
                            Captain
                        </p>
                        <p className="text-sm font-medium">{team.captain.name}</p>
                    </div>

                    <div>
                        <p className="text-xs uppercase text-muted-foreground mb-2">
                            Roster ({team.members.length})
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {team.members.map((member) => (
                                <span
                                    key={member.id}
                                    className="text-xs bg-muted border rounded-full px-3 py-1"
                                >
                                    {member.name}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-muted/50 flex justify-between items-center">
                    <Link
                        href={`/teams/${team.id}`}
                        className="text-sm text-primary hover:underline"
                    >
                        Open full team page →
                    </Link>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-accent rounded-lg transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

export function ManageRegistrations() {
    const { tournament, registrations, flash } = usePage<PageProps>().props;
    const [processingId, setProcessingId] = useState<number | null>(null);
    const [selectedTeam, setSelectedTeam] = useState<TeamDetail | null>(null);

    const act = (registrationId: number, action: 'accept' | 'reject') => {
        setProcessingId(registrationId);

        router.patch(
            `/registrations/${registrationId}/${action}`,
            {},
            {
                preserveScroll: true,
                onFinish: () => setProcessingId(null),
            },
        );
    };

    const pending = registrations.filter((r) => r.status === 'pending');
    const decided = registrations.filter((r) => r.status !== 'pending');

    const renderRow = (registration: Registration, showActions: boolean) => {
        const label = registration.team?.name ?? registration.user?.name;

        return (
            <div key={registration.id} className="border rounded-lg p-4 flex items-center justify-between bg-card">
                <div>
                    <p className="font-medium">{label}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                        {registration.team && (
                            <button
                                onClick={() => setSelectedTeam(registration.team)}
                                className="text-xs text-gray-500 hover:underline"
                            >
                                View Team
                            </button>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {showActions ? (
                        <>
                            <button
                                onClick={() => act(registration.id, 'accept')}
                                disabled={processingId === registration.id}
                                className="px-4 py-1.5 text-sm bg-green-600 text-white rounded disabled:opacity-50 hover:bg-green-700 transition-colors"
                            >
                                Accept
                            </button>
                            <button
                                onClick={() => act(registration.id, 'reject')}
                                disabled={processingId === registration.id}
                                className="px-4 py-1.5 text-sm bg-red-600 text-white rounded disabled:opacity-50 hover:bg-red-700 transition-colors"
                            >
                                Reject
                            </button>
                        </>
                    ) : (
                        <span
                            className={`inline-block rounded-full border px-3 py-1 text-xs font-medium capitalize ${statusStyles[registration.status]}`}
                        >
                            {registration.status}
                        </span>
                    )}
                </div>
            </div>
        );
    };

    return (
        <>
            <Head title={`Registrations — ${tournament.name}`} />

            {flash?.success && (
                <Toast message={flash.success} variant="success" />
            )}

            <div className="w-full p-6 space-y-8">

                <div>
                    <Link
                        href={`/tournaments/${tournament.id}`}
                        className="text-sm text-primary hover:underline"
                    >
                        ← Back to {tournament.name}
                    </Link>
                    <h1 className="text-2xl font-bold mt-2">
                        Manage Registrations
                    </h1>
                </div>

                {registrations.length === 0 && (
                    <p className="text-muted-foreground">
                        No registrations yet.
                    </p>
                )}

                {pending.length > 0 && (
                    <div>
                        <h2 className="font-semibold mb-3">
                            Pending ({pending.length})
                        </h2>
                        <div className="space-y-3">
                            {pending.map((registration) => renderRow(registration, true))}
                        </div>
                    </div>
                )}

                {decided.length > 0 && (
                    <div>
                        <h2 className="font-semibold mb-3">
                            Decided ({decided.length})
                        </h2>
                        <div className="space-y-3">
                            {decided.map((registration) => renderRow(registration, false))}
                        </div>
                    </div>
                )}

            </div>

            {selectedTeam && (
                <TeamPreviewModal
                    team={selectedTeam}
                    onClose={() => setSelectedTeam(null)}
                />
            )}
        </>
    );
}

export default ManageRegistrations;

ManageRegistrations.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Tournaments', href: '/tournaments' },
        { title: 'Manage Registrations', href: '#' },
    ],
};