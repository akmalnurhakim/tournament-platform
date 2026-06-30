import { Head, usePage } from '@inertiajs/react';
import { dashboard } from '@/routes';
import { TeamGrid } from '@/components/team-grid';

type PageProps = {
    teams: { data: any[] };
    heading: string;
    subheading: string;
};

export default function TeamsIndex() {
    const { teams, heading, subheading } = usePage<PageProps>().props;

    return (
        <>
            <Head title={heading} />

            <div className="w-full space-y-6 p-8">
                <div>
                    <h1 className="text-2xl font-bold">{heading}</h1>
                    <p className="text-muted-foreground">{subheading}</p>
                </div>

                <TeamGrid teams={teams?.data ?? []} />
            </div>
        </>
    );
}

TeamsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Teams', href: '#' },
    ],
};