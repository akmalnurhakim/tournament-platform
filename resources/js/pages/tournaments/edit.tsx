import { Head, usePage } from '@inertiajs/react';
import type { TournamentFormData } from '@/components/tournament-form';
import { TournamentForm } from '@/components/tournament-form';
import { dashboard } from '@/routes';

type SportType = {
    id: number;
    name: string;
    is_team_based: boolean;
    active_players: number;
    min_players: number;
    max_players: number;
};

type PageProps = {
    tournament: TournamentFormData;
    sportTypes: SportType[];
};

export default function EditTournament() {
    const { tournament, sportTypes} = usePage<PageProps>().props;

    return (
        <>
            <Head title={`Edit ${tournament.name}`} />
            <TournamentForm tournament={tournament} sportTypes={sportTypes} />
        </>
    );
}

EditTournament.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'My Tournaments', href: '/my-tournaments' },
        { title: 'Edit Tournament', href: '#' },
    ],
};