import { Head, usePage, Link } from '@inertiajs/react';
import { dashboard } from '@/routes';
import Toast from '@/components/toast';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';

type Team = {
    id: number;
    name: string;
    description: string | null;
    logo: string | null;
    invite_code: string;
    status: string;
    captain: { id: number; name: string };
    sport_type: { id: number; name: string };
    members: { id: number; name: string }[];
};

type PageProps = {
    team: Team;
    isCaptain: boolean;
    isMember: boolean;
    flash: {
        success?: string;
        error?: string;
    };
};

export default function ShowTeam() {
    const { team, isCaptain, isMember, flash } = usePage<PageProps>().props;

    return (
        <>
            <Head title={team.name} />

            {flash?.success && (
                <Toast message={flash.success} variant="success" />
            )}

            <div className="w-full space-y-6 p-8">

                {/* Team Card */}
                <div className="rounded-xl border bg-background shadow-sm">

                    {/* Top Divider */}
                    <div className="relative h-24 border-b">

                        <div className="absolute left-8 top-12">
                            {team.logo ? (
                                <img
                                    src={`/storage/${team.logo}`}
                                    alt={team.name}
                                    className="h-24 w-24 rounded-full border-2 bg-background object-cover"
                                />
                            ) : (
                                <div className="flex h-24 w-24 items-center justify-center rounded-full border-2 bg-background text-sm font-bold">
                                    LOGO
                                </div>
                            )}
                        </div>

                        {isCaptain && (
                            <div className="absolute right-8 top-6">
                                <Button asChild size="sm" variant="outline">
                                    <Link href={`/teams/${team.id}/edit`}>
                                        <Pencil className="mr-2 h-4 w-4" />
                                        Edit Team
                                    </Link>
                                </Button>
                            </div>
                        )}

                    </div>

                    <div className="px-8 pb-8 pt-14">

                        <div className="ml-2">
                            <h1 className="text-4xl font-bold">
                                {team.name}
                            </h1>

                            <p className="text-muted-foreground">
                                {team.sport_type.name}
                            </p>
                        </div>

                        <hr className="my-8" />

                        <div className="space-y-4">

                            <p className="leading-7 text-muted-foreground">
                                {team.description || "No description available."}
                            </p>

                            <div className="grid grid-cols-3 gap-6 pt-2">

                                <div>
                                    <p className="text-xs uppercase text-muted-foreground">
                                        Captain
                                    </p>

                                    <p className="font-medium">
                                        {team.captain.name}
                                    </p>
                                </div>

                                {isMember && (
                                    <div>
                                        <p className="text-xs uppercase text-muted-foreground">Invite Code</p>
                                        <p className="font-mono">{team.invite_code}</p>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                navigator.clipboard.writeText(
                                                    `${window.location.origin}/teams/join/${team.invite_code}`,
                                                )
                                            }
                                            className="text-xs text-blue-600 hover:underline mt-1"
                                        >
                                            Copy invite link
                                        </button>
                                    </div>
                                )}

                                <div>
                                    <p className="text-xs uppercase text-muted-foreground">
                                        Members
                                    </p>

                                    <p>{team.members.length}</p>
                                </div>

                            </div>

                        </div>

                    </div>

                </div>

                {/* Members Card */}
                <div className="rounded-xl border bg-background p-8 shadow-sm">

                    <h2 className="mb-8 text-lg font-semibold">
                        Team Members
                    </h2>

                    <div className="flex flex-wrap gap-8">

                        {team.members.map((member) => (
                            <div
                                key={member.id}
                                className="flex w-24 flex-col items-center"
                            >
                                <div className="flex h-20 w-20 items-center justify-center rounded-full border text-xl font-semibold">
                                    {member.name.charAt(0).toUpperCase()}
                                </div>

                                <p className="mt-3 text-center text-sm font-medium">
                                    {member.name}
                                </p>
                            </div>
                        ))}

                    </div>

                </div>

            </div>
        </>
    );
}

ShowTeam.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Team', href: '#' },
    ],
};