import { Head, Link, useForm, usePage, router } from '@inertiajs/react';
import { dashboard } from '@/routes';

type Stage = {
    id: number;
    stage_type: string;
    name: string;
    stage_order: number;
};

type Tournament = {
    id: number;
    name: string;
    status: string;
    sport_type?: { name: string };
    stages: Stage[];
};

type PageProps = {
    tournament: Tournament;
    stagesLocked: boolean;
    registrationCounts: { pending: number; approved: number; rejected: number };
    nextStatuses: string[];
    flash: { success?: string; error?: string };
    maxParticipants: number | null;
    readyForBracketGeneration: boolean;
};

const statusLabels: Record<string, string> = {
    draft: 'Draft',
    open: 'Open for Registration',
    closed: 'Registration Closed',
    in_progress: 'In Progress',
    completed: 'Completed',
};

const statusBadgeStyles: Record<string, string> = {
    draft: 'bg-gray-100 text-gray-700 border-gray-300',
    open: 'bg-green-100 text-green-800 border-green-300',
    closed: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    in_progress: 'bg-blue-100 text-blue-800 border-blue-300',
    completed: 'bg-purple-100 text-purple-800 border-purple-300',
};

export default function ManageTournament() {
    const { tournament, stagesLocked, registrationCounts, nextStatuses, flash, maxParticipants, readyForBracketGeneration } =
        usePage<PageProps>().props;

    return (
        <>
            <Head title={`Manage — ${tournament.name}`} />

            <div className="w-auto p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between flex-wrap gap-3">
                    <div>
                        <h1 className="text-2xl font-bold">{tournament.name}</h1>
                        <span
                            className={`inline-block mt-1 rounded-full border px-3 py-1 text-xs font-medium ${statusBadgeStyles[tournament.status] ?? ''}`}
                        >
                            {statusLabels[tournament.status] ?? tournament.status}
                        </span>
                    </div>
                    <div className="flex gap-3 text-sm">
                        <Link href={`/tournaments/${tournament.id}`} className="text-gray-700 hover:underline">
                            View public page
                        </Link>
                        <Link href={`/tournaments/${tournament.id}/edit`} className="text-blue-600 hover:underline">
                            Edit details
                        </Link>
                    </div>
                </div>

                {flash?.success && (
                    <div className="rounded-lg bg-green-50 border border-green-200 text-green-800 text-sm p-3">
                        {flash.success}
                    </div>
                )}

                {/* Status control */}
                <StatusControl tournament={tournament} nextStatuses={nextStatuses} />

                {/* Registration stats */}
                <div className="border rounded-xl p-6 shadow">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-semibold text-lg">Registrations</h2>
                        <Link
                            href={`/tournaments/${tournament.id}/registrations`}
                            className="text-sm text-blue-600 hover:underline"
                        >
                            Manage registrations →
                        </Link>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-4">
                            <p className="text-2xl font-bold text-yellow-800">{registrationCounts.pending}</p>
                            <p className="text-xs text-yellow-700 mt-1">Pending</p>
                        </div>
                        <div className="rounded-lg bg-green-50 border border-green-200 p-4">
                            <p className="text-2xl font-bold text-green-800">{registrationCounts.approved}</p>
                            <p className="text-xs text-green-700 mt-1">Approved</p>
                        </div>
                        <div className="rounded-lg bg-red-50 border border-red-200 p-4">
                            <p className="text-2xl font-bold text-red-800">{registrationCounts.rejected}</p>
                            <p className="text-xs text-red-700 mt-1">Rejected</p>
                        </div>
                    </div>
                </div>
                {maxParticipants && (
                    <div className="border rounded-xl p-6 shadow">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="font-semibold text-lg">Bracket Readiness</h2>
                            <span className="text-sm text-gray-500">
                                {registrationCounts.approved} / {maxParticipants} approved
                            </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                            <div
                                className="bg-blue-600 h-2 rounded-full transition-all"
                                style={{
                                    width: `${Math.min(100, (registrationCounts.approved / maxParticipants) * 100)}%`,
                                }}
                            />
                        </div>
                        {readyForBracketGeneration && (
                            <p className="text-sm text-green-700 mt-2">
                                Ready to generate the bracket.
                            </p>
                        )}
                    </div>
                )}

                {/* Stages */}
                <StagesPanel tournament={tournament} stagesLocked={stagesLocked} />
            </div>
        </>
    );
}

function StatusControl({ tournament, nextStatuses }: { tournament: Tournament; nextStatuses: string[] }) {
    if (nextStatuses.length === 0) {
        return (
            <div className="border rounded-xl p-6 shadow text-sm text-gray-500">
                No further status changes available for this tournament.
            </div>
        );
    }

    const changeStatus = (status: string) => {
        router.patch(
            `/tournaments/${tournament.id}/status`,
            { status },
            { preserveScroll: true }
        );
    };

    return (
        <div className="border rounded-xl p-6 shadow">
            <h2 className="font-semibold text-lg mb-3">Change status</h2>
            <div className="flex gap-3 flex-wrap">
                {nextStatuses.map((status) => (
                    <button
                        key={status}
                        onClick={() => changeStatus(status)}
                        className="border rounded-lg px-4 py-2 text-sm hover:bg-muted"
                    >
                        Move to {statusLabels[status] ?? status}
                    </button>
                ))}
            </div>
        </div>
    );
}

function StagesPanel({ tournament, stagesLocked }: { tournament: Tournament; stagesLocked: boolean }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        stage_type: 'knockout',
        name: '',
        stage_order: tournament.stages.length + 1,
        group_count: '',
        advance_count: '',
    });

    const addStage = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/tournaments/${tournament.id}/stages`, {
            preserveScroll: true,
            onSuccess: () => reset('name'),
        });
    };

    const removeStage = (stageId: number) => {
        if (!confirm('Remove this stage?')) return;
        router.delete(`/tournaments/${tournament.id}/stages/${stageId}`, {
            preserveScroll: true,
        });
    };

    return (
        <div className="border rounded-xl p-6 shadow space-y-4">
            <h2 className="font-semibold text-lg">Stages</h2>

            {tournament.stages.length === 0 ? (
                <p className="text-sm text-gray-500">No stages configured yet.</p>
            ) : (
                <div className="space-y-2">
                    {tournament.stages
                        .sort((a, b) => a.stage_order - b.stage_order)
                        .map((stage) => (
                            <div
                                key={stage.id}
                                className="flex items-center justify-between border rounded-lg p-3 text-sm"
                            >
                                <span>
                                    {stage.stage_order}. {stage.name}{' '}
                                    <span className="text-gray-400">({stage.stage_type})</span>
                                </span>
                                {!stagesLocked && (
                                    <button
                                        onClick={() => removeStage(stage.id)}
                                        className="text-red-600 hover:underline text-xs"
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                        ))}
                </div>
            )}

            {!stagesLocked ? (
                <form onSubmit={addStage} className="border-t pt-4 space-y-3">
                    <p className="text-sm font-medium">Add a stage</p>
                    <div className="grid md:grid-cols-2 gap-3">
                        <div>
                            <input
                                placeholder="Stage name (e.g. Quarterfinals)"
                                className="w-full border rounded p-2 text-sm"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                            />
                            {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
                        </div>
                        <select
                            className="w-full border rounded p-2 text-sm"
                            value={data.stage_type}
                            onChange={(e) => setData('stage_type', e.target.value)}
                        >
                            <option value="knockout">Knockout</option>
                            <option value="group">Group</option>
                            <option value="round_robin">Round Robin</option>
                        </select>
                    </div>
                    <button
                        type="submit"
                        disabled={processing}
                        className="bg-blue-600 text-white px-4 py-2 rounded text-sm disabled:opacity-50"
                    >
                        Add Stage
                    </button>
                </form>
            ) : (
                <p className="text-xs text-gray-400 border-t pt-4">
                    Stages are locked because matches have already been generated for this tournament.
                </p>
            )}
        </div>
    );
}

ManageTournament.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'My Tournaments', href: '/my-tournaments' },
        { title: 'Manage', href: '#' },
    ],
};