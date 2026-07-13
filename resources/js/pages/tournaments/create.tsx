import { Head, usePage } from '@inertiajs/react';
import { dashboard } from '@/routes';
import { TournamentForm } from '@/components/tournament-form';

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
    flash: { success?: string; error?: string };
};

export default function CreateTournament() {
    const { sportTypes, flash } = usePage<PageProps>().props;

    return (
        <>
            <Head title="Create Tournament" />
            <TournamentForm sportTypes={sportTypes} flashSuccess={flash?.success} />
        </>
    );
}

CreateTournament.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Create Tournament', href: '/tournaments/create' },
    ],
};