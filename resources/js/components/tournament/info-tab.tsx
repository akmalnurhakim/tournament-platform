import { Tournament } from '@/types/tournament';

export function InfoTab({ tournament }: { tournament: Tournament }) {
    const isTeamBased = tournament.sport_type?.is_team_based ?? false;

    return (
        <div className="border rounded-xl p-6 shadow space-y-5">
            <div>
                <h2 className="font-semibold text-lg mb-2">About this tournament</h2>
                <p className="text-gray-700 whitespace-pre-line">
                    {tournament.description ?? 'No description provided.'}
                </p>
            </div>
            <div>
                <p className="text-sm text-gray-600">
                    {tournament.sport_type?.name}
                    {isTeamBased && ` · ${tournament.sport_type?.players_on_field} per team`}
                </p>
            </div>
        </div>
    );
}