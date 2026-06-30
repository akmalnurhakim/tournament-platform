// resources/js/pages/teams/joinPreview.tsx
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { dashboard } from '@/routes';

type Team = {
    id: number;
    name: string;
    logo: string | null;
    description: string | null;
    captain: { name: string };
    sport_type: { name: string; max_players: number };
};

type PageProps = {
    team: Team;
    memberCount: number;
    inviteCode: string;
};

export default function JoinPreview() {
    const { team, memberCount, inviteCode } = usePage<PageProps>().props;
    const [joining, setJoining] = useState(false);
    const [error, setError] = useState<string | undefined>();

    const isFull = memberCount >= team.sport_type.max_players;

    const handleJoin = () => {
        setJoining(true);
        setError(undefined);

        router.post(
            `/teams/join/${inviteCode}`,
            {},
            {
                onError: (errs) => setError(errs.invite_code ?? 'Could not join team.'),
                onFinish: () => setJoining(false),
            },
        );
    };

    return (
        <>
            <Head title={`Join ${team.name}`} />

            <div className="max-w-md mx-auto p-6">
                <div className="rounded-xl border bg-background p-8 shadow-sm text-center">

                    {team.logo ? (
                        <img
                            src={`/storage/${team.logo}`}
                            alt={team.name}
                            className="h-20 w-20 rounded-full border mx-auto object-cover"
                        />
                    ) : (
                        <div className="h-20 w-20 rounded-full border mx-auto flex items-center justify-center text-xl font-bold">
                            {team.name.charAt(0).toUpperCase()}
                        </div>
                    )}

                    <h1 className="text-2xl font-bold mt-4">{team.name}</h1>
                    <p className="text-muted-foreground">{team.sport_type.name}</p>

                    <p className="text-sm text-muted-foreground mt-2">
                        Captain: {team.captain.name}
                    </p>

                    <p className="text-sm text-muted-foreground">
                        {memberCount} / {team.sport_type.max_players} members
                    </p>

                    {team.description && (
                        <p className="text-sm text-muted-foreground mt-4">
                            {team.description}
                        </p>
                    )}

                    {error && (
                        <p className="text-sm text-red-600 mt-4">{error}</p>
                    )}

                    <button
                        onClick={handleJoin}
                        disabled={joining || isFull}
                        className="mt-6 bg-blue-600 text-white px-6 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isFull
                            ? 'Team Full'
                            : joining
                            ? 'Joining…'
                            : `Join ${team.name}`}
                    </button>

                </div>
            </div>
        </>
    );
}

JoinPreview.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Join Team', href: '#' },
    ],
};