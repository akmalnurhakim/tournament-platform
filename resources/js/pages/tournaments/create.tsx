import { Head, usePage } from '@inertiajs/react';
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
    sportTypes: SportType[];
};

export default function CreateTournament() {
    const { sportTypes} = usePage<PageProps>().props;

    return (
        <>
            <Head title="Create Tournament" />
            <TournamentForm sportTypes={sportTypes} />
        </>
    );
}

CreateTournament.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Create Tournament', href: '/tournaments/create' },
    ],
};