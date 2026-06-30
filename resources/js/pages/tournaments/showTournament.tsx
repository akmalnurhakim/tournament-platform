import { Head, Link, usePage } from '@inertiajs/react';
import { dashboard } from '@/routes';
import { TournamentRegistration } from '@/components/tournament-registration';

type SportType = {
    id: number;
    name: string;
    is_team_based: boolean;
    players_on_field: number;
};

type Tournament = {
    id: number;
    name: string;
    description: string | null;
    status: string;
    start_date: string;
    end_date: string;
    organizer?: { name: string };
    sport_type?: SportType;
    matches?: { id: number; scheduled_at: string; status: string }[];
};

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

type PageProps = {
    tournament: Tournament;
    eligibleTeams: EligibleTeam[];
    myRegistration: Registration | null;
    isOrganizer: boolean;
};


export default function ShowTournament() {
    const { tournament, eligibleTeams, myRegistration, isOrganizer } = usePage<PageProps>().props;

    const isTeamBased = tournament.sport_type?.is_team_based ?? false;

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString(
            'en-MY',
            {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            }
        );
    };

    return (
        <>
            <Head title={tournament.name} />

            <div className="max-w-5xl mx-auto p-6 space-y-6">

                <div className="border rounded-xl p-6 shadow space-y-5">
                    {/* Header */}
                    <div>
                        <h1 className="text-3xl font-bold">
                            {tournament.name}
                        </h1>
                        <p className="text-gray-600 mt-2">
                            Hosted by:
                            {' '}
                            {tournament.organizer?.name}
                        </p>
                        {isOrganizer && (
                            <Link
                                href={`/tournaments/${tournament.id}/registrations`}
                                className="text-sm text-blue-600 hover:underline"
                            >
                                Manage Registrations
                            </Link>
                        )}
                    </div>


                    {/* Sport */}
                    <div>
                        <p>
                            {tournament.sport_type?.name}
                        </p>
                        {
                            isTeamBased && (

                                <p className="text-sm text-gray-600">

                                    Players:
                                    {' '}
                                    {
                                    tournament.sport_type?.players_on_field
                                    }

                                    {' '}
                                    per team
                                </p>
                            )
                        }
                    </div>

                    {/* Description */}
                    <div>
                        <h2 className="font-semibold text-lg">
                            Description
                        </h2>
                        <p className="text-gray-700">
                            {
                            tournament.description ??
                            'No description provided.'
                            }
                        </p>
                    </div>

                    {/* Date */}
                    <div>
                        <h2 className="font-semibold text-lg">
                            Tournament Date
                        </h2>
                        <p>
                            {formatDate(tournament.start_date)}

                            {' → '}

                            {formatDate(tournament.end_date)}
                        </p>
                    </div>
                </div>

                {/* Registration */}
                <TournamentRegistration
                    tournamentId={tournament.id}
                    isTeamBased={isTeamBased}
                    eligibleTeams={eligibleTeams}
                    myRegistration={myRegistration}
                />

                {/* Matches */}
                {
                    tournament.matches && tournament.matches.length > 0 && (
                    <div className="mt-8">
                        <h2 className="text-xl font-bold mb-4">
                            Matches
                        </h2>
                        <div className="space-y-3">
                        {
                        tournament.matches.map((match) => (
                            <div key={match.id} className=" border rounded-lg p-4">
                                <p>
                                    {formatDate(match.scheduled_at)}
                                </p>
                                <p className="text-sm text-gray-500">
                                    {match.status}
                                </p>
                            </div>
                        ))
                        }
                        </div>
                    </div>
                    )
                }
            </div>
        </>
    );
}

ShowTournament.layout = {

    breadcrumbs:[
        {
            title:'Dashboard',
            href:dashboard()
        },
        {
            title:'Tournament',
            href:'/tournaments'
        }
    ]

};