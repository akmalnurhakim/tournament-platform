import { router } from '@inertiajs/react';
import { useState } from 'react';

type EligibleTeam = {
    id: number;
    name: string;
    logo: string | null;
};

type Registration = {
    id: number;
    status: 'pending' | 'accepted' | 'rejected';
    team_id: number | null;
    user_id: number | null;
};

type TournamentRegistrationProps = {
    tournamentId: number;
    isTeamBased: boolean;
    eligibleTeams: EligibleTeam[];
    myRegistration: Registration | null;
};

const statusStyles: Record<Registration['status'], string> = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    accepted: 'bg-green-100 text-green-800 border-green-300',
    rejected: 'bg-red-100 text-red-800 border-red-300',
};

export function TournamentRegistration({
    tournamentId,
    isTeamBased,
    eligibleTeams,
    myRegistration,
}: TournamentRegistrationProps) {
    const [selectedTeamId, setSelectedTeamId] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | undefined>();

    const submit = () => {
        setSubmitting(true);
        setError(undefined);

        const payload = isTeamBased ? { team_id: selectedTeamId } : {};

        router.post(`/tournaments/${tournamentId}/registrations`, payload, {
            onError: (errs) => setError(errs.team_id ?? errs.user_id ?? 'Something went wrong.'),
            onFinish: () => setSubmitting(false),
        });
    };

    // Already registered — show status, nothing else to do here.
    if (myRegistration) {
        return (
            <div className="rounded-xl border bg-background p-6 shadow-sm">
                <p className="text-sm text-muted-foreground mb-2">
                    Your registration status
                </p>
                <span
                    className={`inline-block rounded-full border px-3 py-1 text-xs font-medium capitalize ${statusStyles[myRegistration.status]}`}
                >
                    {myRegistration.status}
                </span>
            </div>
        );
    }

    // Team-based tournament, but the captain has no eligible team.
    if (isTeamBased && eligibleTeams.length === 0) {
        return (
            <div className="rounded-xl border bg-background p-6 shadow-sm text-sm text-muted-foreground">
                You don't have a team matching this tournament's sport. Create
                one to register.
            </div>
        );
    }

    return (
        <div className="rounded-xl border bg-background p-6 shadow-sm space-y-4">
            <h3 className="font-semibold">Register for this tournament</h3>

            {isTeamBased && (
                <div>
                    <label className="font-medium text-sm">Select your team</label>
                    <select
                        className="w-full border rounded p-2 mt-1"
                        value={selectedTeamId}
                        onChange={(e) => setSelectedTeamId(e.target.value)}
                    >
                        <option value="">Choose a team</option>
                        {eligibleTeams.map((team) => (
                            <option key={team.id} value={team.id}>
                                {team.name}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
                onClick={submit}
                disabled={submitting || (isTeamBased && !selectedTeamId)}
                className="bg-blue-600 text-white px-5 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {submitting ? 'Registering…' : 'Register'}
            </button>
        </div>
    );
}