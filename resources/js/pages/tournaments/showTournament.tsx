import { Head } from '@inertiajs/react';
import { dashboard } from '@/routes';


export default function ShowTournament({
    tournament
}: {
    tournament:any
}) {


    const formatDate = (date:string) => {
        return new Date(date).toLocaleDateString(
            'en-MY',
            {
                day:'2-digit',
                month:'short',
                year:'numeric'
            }
        );

    };



    return (
        <>
            <Head title={tournament.name} />

            <div className="max-w-5xl mx-auto p-6">

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
                    </div>

                    {/* Status */}
                    <div className="flex gap-3">
                        <span className="px-3 py-1 rounded bg-gray-100">
                            {tournament.status}
                        </span>
                        <span className="px-3 py-1 rounded bg-gray-100">
                            {
                                tournament.is_team_based
                                ? 'Team Tournament'
                                : 'Individual Tournament'
                            }
                        </span>
                    </div>

                    {/* Sport */}
                    <div>
                        <h2 className="font-semibold text-lg">
                            Sport
                        </h2>
                        <p>
                            {tournament.sport_type?.name}
                        </p>
                        {
                            tournament.is_team_based && (

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

                    {/* Action */}
                    <div className="pt-4">
                        <button
                            className="
                            bg-blue-600
                            text-white
                            px-6
                            py-2
                            rounded-lg
                            "
                        >

                            Register Tournament

                        </button>
                    </div>
                </div>

                {/* Matches */}
                {
                    tournament.matches?.length > 0 && (
                    <div className="mt-8">
                        <h2 className="text-xl font-bold mb-4">
                            Matches
                        </h2>
                        <div className="space-y-3">
                        {
                        tournament.matches.map((match:any)=>(
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