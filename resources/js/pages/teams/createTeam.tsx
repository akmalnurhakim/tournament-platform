import { Head, usePage } from '@inertiajs/react';
import { dashboard } from '@/routes';
import { TeamForm } from '@/components/team-form';

type PageProps = {
    flash: { success?: string; error?: string };
};

export default function CreateTeam() {
    const { flash } = usePage<PageProps>().props;

    return (
        <>
            <Head title="Create Team" />
            <TeamForm flashSuccess={flash?.success} />
        </>
    );
}

CreateTeam.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Create Team', href: '/teams/create' },
    ],
};