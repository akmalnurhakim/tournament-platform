import { Head, usePage, router } from '@inertiajs/react';
import { useState } from 'react';
import { dashboard } from '@/routes';
import type { Participant} from '@/types/tournament';
import { participantName } from '@/types/tournament';

type Registration = {
    id: number;
    status: string;
    participant: Participant;
};

type Tournament = {
    id: number;
    name: string;
    max_participants: number | null;
};

type PageProps = {
    tournament: Tournament;
    pending: Registration[];
    approved: Registration[];
    rejected: Registration[];
    canAddGuest: boolean;
    flash: { success?: string; error?: string };
};

export default function ManageRegistrations() {
    const { tournament, pending, approved, rejected, canAddGuest, flash } = usePage<PageProps>().props;

    const accept = (id: number) => {
        router.patch(`/registrations/${id}/accept`, {}, { preserveScroll: true });
    };

    const reject = (id: number) => {
        router.patch(`/registrations/${id}/reject`, {}, { preserveScroll: true });
    };

    return (
        <>
            <Head title={`Registrations — ${tournament.name}`} />

            <div className="max-w-4xl mx-auto p-6 space-y-6">
                <div>
                    <h1 className="text-2xl font-bold">{tournament.name}</h1>
                    <p className="text-sm text-gray-500">
                        {approved.length}
                        {tournament.max_participants ? ` / ${tournament.max_participants}` : ''} approved
                    </p>
                </div>

                {flash?.success && (
                    <div className="rounded-lg bg-green-50 border border-green-200 text-green-800 text-sm p-3">
                        {flash.success}
                    </div>
                )}
                {flash?.error && (
                    <div className="rounded-lg bg-red-50 border border-red-200 text-red-800 text-sm p-3">
                        {flash.error}
                    </div>
                )}

                {/* Pending */}
                <section className="border rounded-xl p-6 shadow space-y-3">
                    <h2 className="font-semibold text-lg">Pending ({pending.length})</h2>
                    {pending.length === 0 ? (
                        <p className="text-sm text-gray-500">No pending registrations.</p>
                    ) : (
                        pending.map((reg) => (
                            <div key={reg.id} className="flex items-center justify-between border rounded-lg p-3">
                                <div>
                                    <p className="text-sm font-medium">{participantName(reg.participant)}</p>
                                    <p className="text-xs text-gray-400 capitalize">
                                        {reg.participant.participant_type}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => accept(reg.id)}
                                        className="text-sm bg-green-600 text-white px-3 py-1.5 rounded hover:bg-green-700"
                                    >
                                        Accept
                                    </button>
                                    <button
                                        onClick={() => reject(reg.id)}
                                        className="text-sm border border-red-300 text-red-700 px-3 py-1.5 rounded hover:bg-red-50"
                                    >
                                        Reject
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </section>

                {/* Add guest */}
                {canAddGuest && <AddGuestForm tournamentId={tournament.id} />}

                {/* Approved */}
                <section className="border rounded-xl p-6 shadow space-y-3">
                    <h2 className="font-semibold text-lg">Approved ({approved.length})</h2>
                    {approved.length === 0 ? (
                        <p className="text-sm text-gray-500">No approved participants yet.</p>
                    ) : (
                        <div className="space-y-2">
                            {approved.map((reg) => (
                                <div
                                    key={reg.id}
                                    className="flex items-center justify-between border rounded-lg p-3 text-sm"
                                >
                                    <span>{participantName(reg.participant)}</span>
                                    <span className="text-xs text-gray-400 capitalize">
                                        {reg.participant.participant_type}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* Rejected */}
                {rejected.length > 0 && (
                    <section className="border rounded-xl p-6 shadow space-y-3">
                        <h2 className="font-semibold text-lg">Rejected ({rejected.length})</h2>
                        <div className="space-y-2">
                            {rejected.map((reg) => (
                                <div
                                    key={reg.id}
                                    className="flex items-center justify-between border rounded-lg p-3 text-sm text-gray-500"
                                >
                                    <span>{participantName(reg.participant)}</span>
                                    <span className="text-xs capitalize">{reg.participant.participant_type}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </>
    );
}

function AddGuestForm({ tournamentId }: { tournamentId: number }) {
    const [name, setName] = useState('');
    const [contact, setContact] = useState('');
    const [error, setError] = useState<string | undefined>();
    const [submitting, setSubmitting] = useState(false);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        router.post(
            `/tournaments/${tournamentId}/guests`,
            { guest_name: name, guest_contact: contact },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setName('');
                    setContact('');
                },
                onError: (errs: any) => setError(errs.guest_name ?? 'Something went wrong.'),
                onFinish: () => setSubmitting(false),
            }
        );
    };

    return (
        <section className="border rounded-xl p-6 shadow space-y-3">
            <h2 className="font-semibold text-lg">Add Guest Participant</h2>
            <p className="text-xs text-gray-500">
                Manually add someone who isn't a registered user. They'll be approved immediately.
            </p>
            <form onSubmit={submit} className="flex gap-3 flex-wrap items-start">
                <div className="flex-1 min-w-[160px]">
                    <input
                        placeholder="Guest name"
                        className="w-full border rounded p-2 text-sm"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
                </div>
                <input
                    placeholder="Contact (optional)"
                    className="flex-1 min-w-[160px] border rounded p-2 text-sm"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                />
                <button
                    type="submit"
                    disabled={submitting || !name}
                    className="bg-blue-600 text-white px-4 py-2 rounded text-sm disabled:opacity-50"
                >
                    Add Guest
                </button>
            </form>
        </section>
    );
}

ManageRegistrations.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'My Tournaments', href: '/my-tournaments' },
        { title: 'Registrations', href: '#' },
    ],
};