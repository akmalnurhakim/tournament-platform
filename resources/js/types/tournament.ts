export type Participant = {
    id: number;
    participant_type: 'individual' | 'team' | 'guest';
    guest_name: string | null;
    team?: { id: number; name: string; logo: string | null } | null;
    user?: { id: number; name: string } | null;
};

export type MyRegistration = { id: number; status: string } | null;

export type Registration = {
    id: number;
    status: string;
    participant: Participant;
};

export type GroupEntry = {
    id: number;
    group_label: string;
    participant: Participant;
};

export type GameMatch = {
    id: number;
    round_number: number | null;
    bracket_position: number | null;
    participant_a: Participant | null;
    participant_b: Participant | null;
    participant_a_score: number | null;
    participant_b_score: number | null;
    status: string;
    scheduled_at: string | null;
};

export type Stage = {
    id: number;
    stage_type: 'group' | 'knockout' | 'round_robin';
    name: string;
    stage_order: number;
    group_entries: GroupEntry[];
    matches: GameMatch[];
};

export type Tournament = {
    id: number;
    name: string;
    description: string | null;
    status: string;
    start_date: string;
    end_date: string;
    venue: string | null;
    location: string | null;
    organizer?: { name: string };
    sport_type?: { id: number; name: string; is_team_based: boolean; players_on_field: number };
    banner_url: string;
    registrations: Registration[];
    stages: Stage[];
};

export function participantName(p: Participant | null): string {
    if (!p) return 'TBD';
    if (p.participant_type === 'team') return p.team?.name ?? 'Unknown team';
    if (p.participant_type === 'guest') return p.guest_name ?? 'Guest';
    return p.user?.name ?? 'Unknown player';
}