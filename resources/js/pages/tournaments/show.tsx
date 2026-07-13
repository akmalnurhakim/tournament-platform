import { Head, Link, usePage } from '@inertiajs/react';
import { dashboard } from '@/routes';
import { useState } from 'react';
import { Trophy, Users, ListOrdered, Calendar, UserPlus, MapPin, Settings } from 'lucide-react';
import { Tournament } from '@/types/tournament';
import { InfoTab } from '@/components/tournament/info-tab';
import { MyTeamTab } from '@/components/tournament/my-team-tab';
import { StandingsTab } from '@/components/tournament/standings-tab';
import { ScheduleTab } from '@/components/tournament/schedule-tab';
import { RegistrationModal } from '@/components/tournament/registration-modal';
import { MyRegistration } from '@/types/tournament';

type PageProps = {
    tournament: Tournament;
    isOrganizer: boolean;
    eligibleTeams: { id: number; name: string }[];
    myRegistration: MyRegistration;
    canRegister: boolean;
};

type TabKey = 'info' | 'my-team' | 'standings' | 'schedule';

const statusBadgeStyles: Record<string, string> = {
    draft: 'bg-gray-100 text-gray-700 border-gray-300',
    open: 'bg-green-100 text-green-800 border-green-300',
    closed: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    in_progress: 'bg-blue-100 text-blue-800 border-blue-300',
    completed: 'bg-purple-100 text-purple-800 border-purple-300',
};

export default function ShowTournament() {
    const { tournament, isOrganizer, eligibleTeams, myRegistration, canRegister } =
        usePage<PageProps>().props;
    const [activeTab, setActiveTab] = useState<TabKey>('info');
    const [showRegisterModal, setShowRegisterModal] = useState(false);

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-MY', {
            weekday: 'long',
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        });
    };

    const navItems: { key: TabKey; label: string; icon: typeof Trophy }[] = [
        { key: 'info', label: 'Info', icon: Trophy },
        { key: 'my-team', label: 'My Team', icon: Users },
        { key: 'standings', label: 'Standings', icon: ListOrdered },
        { key: 'schedule', label: 'Schedule', icon: Calendar },
    ];

    return (
        <>
            <Head title={tournament.name} />

            <div>
                {/* Hero banner */}
                <div className="relative h-80 w-full overflow-hidden">
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${tournament.banner_url})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />

                    <div className="relative h-full flex flex-col items-center justify-center text-center px-6 space-y-3">
                        <div className="flex items-center gap-3">
                            <h1 className="text-4xl font-bold text-white drop-shadow">{tournament.name}</h1>
                            <span
                                className={`inline-block rounded-full border px-3 py-1 text-xs font-medium ${statusBadgeStyles[tournament.status] ?? ''}`}
                            >
                                {tournament.status}
                            </span>
                        </div>
                        <p className="text-white/90 text-sm">Hosted by {tournament.organizer?.name}</p>
                        <p className="text-white/80 text-sm">
                            {formatDate(tournament.start_date)} {' – '} {formatDate(tournament.end_date)}
                        </p>
                    </div>
                </div>

                {/* Tab nav bar — local state, no navigation */}
                <div className="bg-black">
                    <div className="max-w-6xl mx-auto flex flex-wrap justify-center">
                        {navItems.map(({ key, label, icon: Icon }) => (
                            <button
                                key={key}
                                onClick={() => setActiveTab(key)}
                                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition ${
                                    activeTab === key ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white/70'
                                }`}
                            >
                                <Icon size={16} />
                                {label.toUpperCase()}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="max-w-6xl mx-auto p-6 grid md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-6">
                        {activeTab === 'info' && <InfoTab tournament={tournament} />}
                        {activeTab === 'my-team' && <MyTeamTab tournament={tournament} />}
                        {activeTab === 'standings' && <StandingsTab stages={tournament.stages} />}
                        {activeTab === 'schedule' && <ScheduleTab stages={tournament.stages} />}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {(tournament.venue || tournament.location) && (
                            <div className="border rounded-xl overflow-hidden shadow">
                                <div className="bg-muted/50 px-4 py-2 flex items-center gap-2 text-sm font-medium">
                                    <MapPin size={16} />
                                    PLACE
                                </div>
                                <div className="p-4 text-sm text-gray-700">
                                    {tournament.venue}
                                    {tournament.venue && tournament.location && ', '}
                                    {tournament.location}
                                </div>
                            </div>
                        )}

                        {myRegistration ? (
                            <div className="text-center border rounded-lg py-3">
                                <p className="text-xs text-gray-500 mb-1">Your registration</p>
                                <span className="inline-block rounded-full border px-3 py-1 text-xs font-medium capitalize">
                                    {myRegistration.status}
                                </span>
                            </div>
                        ) : canRegister ? (
                            <button
                                onClick={() => setShowRegisterModal(true)}
                                className="block w-full text-center bg-black text-white rounded-lg py-3 font-medium hover:bg-black/90"
                            >
                                SIGN UP
                            </button>
                        ) : null}

                        {isOrganizer && (
                            <Link
                                href={`/tournaments/${tournament.id}/manage`}
                                className="flex items-center justify-center gap-2 border bg-gray-800 text-white rounded-lg py-3 font-medium hover:bg-gray-900"
                            >
                                <Settings size={16} />
                                MANAGE
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            <RegistrationModal
                open={showRegisterModal}
                onClose={() => setShowRegisterModal(false)}
                tournamentId={tournament.id}
                isTeamBased={tournament.sport_type?.is_team_based ?? false}
                eligibleTeams={eligibleTeams}
            />
        </>
    );
}

ShowTournament.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Tournament', href: '/tournaments' },
    ],
};