import { Tournament, participantName } from '@/types/tournament';

export function MyTeamTab({ tournament }: { tournament: Tournament }) {
    if (tournament.registrations.length === 0) {
        return (
            <div className="border rounded-xl p-6 shadow text-sm text-gray-500">
                No participants have registered yet.
            </div>
        );
    }

    return (
        <div className="border rounded-xl p-6 shadow">
            <h2 className="font-semibold text-lg mb-4">
                Registered Participants ({tournament.registrations.length})
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
                {tournament.registrations.map((reg) => (
                    <div key={reg.id} className="border rounded-lg p-3 flex items-center gap-3">
                        {reg.participant.team?.logo ? (
                            <img
                                src={`/storage/${reg.participant.team.logo}`}
                                alt=""
                                className="w-10 h-10 rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-xs text-gray-500">
                                {participantName(reg.participant).slice(0, 2).toUpperCase()}
                            </div>
                        )}
                        <div>
                            <p className="text-sm font-medium">{participantName(reg.participant)}</p>
                            <p className="text-xs text-gray-400 capitalize">{reg.participant.participant_type}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}