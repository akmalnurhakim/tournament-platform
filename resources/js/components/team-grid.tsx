import { Link } from '@inertiajs/react';

type Team = {
    id: number;
    name: string;
    description: string | null;
    logo: string | null;
    status: string;
    captain: { id: number; name: string };
    sportType: { id: number; name: string };
    members: { id: number; name: string }[];
};

export function TeamGrid({ teams }: { teams: Team[] }) {
    if (teams.length === 0) {
        return (
            <div className="rounded-xl border p-10 text-center text-muted-foreground">
                No teams found.
            </div>
        );
    }

    return (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {teams.map((team) => (
                <Link
                    key={team.id}
                    href={`/teams/${team.id}`}
                    className="rounded-xl border bg-background p-6 shadow-sm transition hover:shadow-md"
                >
                    <div className="flex items-center gap-4">
                        {team.logo ? (
                            <img
                                src={`/storage/${team.logo}`}
                                alt={team.name}
                                className="h-20 w-20 rounded-full border object-cover"
                            />
                        ) : (
                            <div className="flex h-20 w-20 items-center justify-center rounded-full border text-xl font-bold">
                                {team.name.charAt(0).toUpperCase()}
                            </div>
                        )}

                        <div>
                            <h2 className="font-semibold">{team.name}</h2>
                            <p className="text-sm text-muted-foreground">
                                {team.sportType?.name}
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 space-y-4">
                        <p className="line-clamp-2 text-sm text-muted-foreground">
                            {team.description ?? 'No description available.'}
                        </p>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs uppercase text-muted-foreground">
                                    Members
                                </p>
                                <p className="font-medium">
                                    {team.members?.length ?? 0}
                                </p>
                            </div>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
}