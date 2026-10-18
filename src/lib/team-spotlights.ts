import type { TeamMember } from '@/app/api/team/route';

/** Recognition is assigned to these people, never inferred from a mutable role name. */
export const TEAM_SPOTLIGHTS = [
  {
    key: 'founder',
    id: '1143387904064888942',
    title: 'Owner · Nhà sáng lập',
    eyebrow: 'Người khởi nguồn',
    description: 'Người đặt nền móng và dẫn dắt hành trình của MIMI.',
  },
  {
    key: 'developer',
    id: '1138315103821889566',
    title: 'Developer · Phát triển dự án',
    eyebrow: 'Người kiến tạo',
    description: 'Người đứng sau mã nguồn và trải nghiệm của dự án MIMI.',
  },
] as const;

export type TeamSpotlightKind = (typeof TEAM_SPOTLIGHTS)[number]['key'];

export interface FeaturedTeamMember {
  kind: TeamSpotlightKind;
  member: TeamMember;
}

/** Only feature real members returned by Discord; missing people remain absent. */
export function partitionTeamMembers(team: readonly TeamMember[]): {
  featured: FeaturedTeamMember[];
  remaining: TeamMember[];
} {
  const membersById = new Map<string, TeamMember>();
  for (const member of team) {
    if (!membersById.has(member.id)) membersById.set(member.id, member);
  }

  const featured: FeaturedTeamMember[] = [];
  const featuredIds = new Set<string>();
  for (const spotlight of TEAM_SPOTLIGHTS) {
    const member = membersById.get(spotlight.id);
    if (!member) continue;
    featured.push({ kind: spotlight.key, member });
    featuredIds.add(member.id);
  }

  return {
    featured,
    remaining: [...membersById.values()].filter(
      member => member.group !== 'partner' && !featuredIds.has(member.id),
    ),
  };
}
