import { Head, usePage } from '@inertiajs/react';
import { dashboard } from '@/routes';
import { TournamentForm, TournamentFormData } from '@/components/tournament-form';

type PageProps = {
    tournament: TournamentFormData;
    flash: { success?: string; error?: string };
};

export default function EditTournament() {
    const { tournament, flash } = usePage<PageProps>().props;

    return (
        <>
            <Head title={`Edit ${tournament.name}`} />
            <TournamentForm tournament={tournament} flashSuccess={flash?.success} />
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