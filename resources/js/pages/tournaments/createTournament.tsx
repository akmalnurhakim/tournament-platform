import { Head, usePage } from '@inertiajs/react';
import { dashboard } from '@/routes';
import { TournamentForm } from '@/components/tournament-form';

type PageProps = {
    flash: { success?: string; error?: string };
};

export default function CreateTournament() {
    const { flash } = usePage<PageProps>().props;

    return (
        <>
            <Head title="Create Tournament" />
            <TournamentForm flashSuccess={flash?.success} />
        </>
    );
}

CreateTournament.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Create Tournament', href: '/tournaments/create' },
    ],
};