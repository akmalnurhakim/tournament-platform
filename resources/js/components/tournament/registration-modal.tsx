import { useForm } from '@inertiajs/react';
import { Modal } from '@/components/ui/modal';

type Team = { id: number; name: string };

type RegistrationModalProps = {
    open: boolean;
    onClose: () => void;
    tournamentId: number;
    isTeamBased: boolean;
    eligibleTeams: Team[];
};

export function RegistrationModal({
    open,
    onClose,
    tournamentId,
    isTeamBased,
    eligibleTeams,
}: RegistrationModalProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        team_id: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/tournaments/${tournamentId}/registrations`, {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    return (
        <Modal open={open} onClose={onClose} title="Register for this tournament">
            {isTeamBased && eligibleTeams.length === 0 ? (
                <p className="text-sm text-gray-500">
                    You don't have a team matching this tournament's sport. Create one first to register.
                </p>
            ) : (
                <form onSubmit={submit} className="space-y-4">
                    {isTeamBased && (
                        <div>
                            <label className="text-sm font-medium">Select your team</label>
                            <select
                                className="w-full border rounded p-2 mt-1"
                                value={data.team_id}
                                onChange={(e) => setData('team_id', e.target.value)}
                            >
                                <option value="">Choose a team</option>
                                {eligibleTeams.map((team) => (
                                    <option key={team.id} value={team.id}>
                                        {team.name}
                                    </option>
                                ))}
                            </select>
                            {errors.team_id && (
                                <p className="text-xs text-red-600 mt-1">{errors.team_id}</p>
                            )}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={processing || (isTeamBased && !data.team_id)}
                        className="w-full bg-blue-600 text-white rounded-lg py-2.5 font-medium disabled:opacity-50"
                    >
                        {processing ? 'Registering…' : 'Confirm Registration'}
                    </button>
                </form>
            )}
        </Modal>
    );
}