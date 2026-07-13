import type { Stage} from '@/types/tournament';
import { participantName } from '@/types/tournament';

export function ScheduleTab({ stages }: { stages: Stage[] }) {
    const allMatches = stages.flatMap((s) => s.matches.map((m) => ({ ...m, stageName: s.name })));

    if (allMatches.length === 0) {
        return (
            <div className="border rounded-xl p-6 shadow text-sm text-gray-500">
                No matches scheduled yet.
            </div>
        );
    }

    const formatDateTime = (date: string | null) => {
        if (!date) {
return 'TBD';
}

        return new Date(date).toLocaleString('en-MY', {
            day: '2-digit',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="border rounded-xl p-6 shadow">
            <h2 className="font-semibold text-lg mb-4">Match Schedule</h2>
            <div className="space-y-3">
                {allMatches.map((match) => (
                    <div key={match.id} className="border rounded-lg p-4 flex items-center justify-between flex-wrap gap-2">
                        <div>
                            <p className="text-sm font-medium">
                                {participantName(match.participant_a)} vs {participantName(match.participant_b)}
                            </p>
                            <p className="text-xs text-gray-400">{match.stageName}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm">{formatDateTime(match.scheduled_at)}</p>
                            <p className="text-xs text-gray-400 capitalize">{match.status}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}