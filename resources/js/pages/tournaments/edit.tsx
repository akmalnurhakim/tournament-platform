import { Head, usePage } from '@inertiajs/react';
import { dashboard } from '@/routes';
import { TournamentForm, TournamentFormData } from '@/components/tournament-form';

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
    flash: { success?: string; error?: string };
};

export default function EditTournament() {
    const { tournament, sportTypes, flash } = usePage<PageProps>().props;

    return (
        <>
            <Head title={`Edit ${tournament.name}`} />
            <TournamentForm tournament={tournament} sportTypes={sportTypes} flashSuccess={flash?.success} />
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