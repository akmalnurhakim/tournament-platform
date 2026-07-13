import { Head, usePage } from '@inertiajs/react';
import type { TeamFormTeam } from '@/components/team-form';
import { TeamForm } from '@/components/team-form';
import { dashboard } from '@/routes';

type PageProps = {
    team: TeamFormTeam;
    flash: { success?: string; error?: string };
};

export default function EditTeam() {
    const { team, flash } = usePage<PageProps>().props;

    return (
        <>
            <Head title={`Edit ${team.name}`} />
            <TeamForm team={team} flashSuccess={flash?.success} />
        </>
    );
}

EditTeam.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Teams', href: '/teams' },
        { title: 'Edit Team', href: '#' },
    ],
};