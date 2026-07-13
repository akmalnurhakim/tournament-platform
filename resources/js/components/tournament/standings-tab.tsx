import type { Stage} from '@/types/tournament';
import { participantName } from '@/types/tournament';

export function StandingsTab({ stages }: { stages: Stage[] }) {
    if (stages.length === 0) {
        return (
            <div className="border rounded-xl p-6 shadow text-sm text-gray-500">
                Standings will appear once the tournament has stages configured.
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {stages
                .sort((a, b) => a.stage_order - b.stage_order)
                .map((stage) => (
                    <div key={stage.id} className="border rounded-xl p-6 shadow">
                        <h2 className="font-semibold text-lg mb-4">{stage.name}</h2>

                        {stage.stage_type === 'group' ? (
                            <GroupTable stage={stage} />
                        ) : (
                            <BracketView stage={stage} />
                        )}
                    </div>
                ))}
        </div>
    );
}

function GroupTable({ stage }: { stage: Stage }) {
    if (stage.group_entries.length === 0) {
        return <p className="text-sm text-gray-500">No participants assigned to groups yet.</p>;
    }

    const groups = Array.from(new Set(stage.group_entries.map((e) => e.group_label)));

    return (
        <div className="space-y-4">
            {groups.map((label) => (
                <div key={label}>
                    <p className="text-sm font-medium text-gray-500 mb-2">Group {label}</p>
                    <table className="w-full text-sm">
                        <tbody>
                            {stage.group_entries
                                .filter((e) => e.group_label === label)
                                .map((entry) => (
                                    <tr key={entry.id} className="border-b last:border-0">
                                        <td className="py-2">{participantName(entry.participant)}</td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            ))}
        </div>
    );
}

function BracketView({ stage }: { stage: Stage }) {
    if (stage.matches.length === 0) {
        return <p className="text-sm text-gray-500">Bracket not generated yet.</p>;
    }

    const rounds = Array.from(new Set(stage.matches.map((m) => m.round_number ?? 0))).sort((a, b) => a - b);

    return (
        <div className="flex gap-6 overflow-x-auto pb-2">
            {rounds.map((round) => (
                <div key={round} className="min-w-[220px] space-y-3">
                    <p className="text-xs font-medium text-gray-400">Round {round}</p>
                    {stage.matches
                        .filter((m) => (m.round_number ?? 0) === round)
                        .map((match) => (
                            <div key={match.id} className="border rounded-lg p-3 text-sm space-y-1">
                                <div className="flex justify-between">
                                    <span>{participantName(match.participant_a)}</span>
                                    <span className="text-gray-400">{match.participant_a_score ?? '-'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>{participantName(match.participant_b)}</span>
                                    <span className="text-gray-400">{match.participant_b_score ?? '-'}</span>
                                </div>
                            </div>
                        ))}
                </div>
            ))}
        </div>
    );
}