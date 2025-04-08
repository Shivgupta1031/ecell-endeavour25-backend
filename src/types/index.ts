interface User {
  slug: string;
  email: string;
  password: string;
  name: string;
  college: string;
  branch: string;
  year: string;
  phone: string;
  libraryId: string;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  profilePicture: string;
  otp?: string | null; // Optional field for OTP verification
  isVerified: boolean; // Added field for email verification status
  otpExpiresAt?: Date | null;
}

export interface UserPayload {
  id: string;
  email: string;
  name: string;
  role?: string;
  rollNo?: string;
  college?: string;
  libId?: string;
  age?: number;
  slug?: string;
  profilePicture?: string;
  gender? : string;
  isAdmin: boolean;
  isSuperAdmin: boolean;
}

interface Event {
  id: string;
  slug: string;
  name: string;
  description: string;
  maxTeamSize: number;
  minTeamSize: number;
  registrationEndDate: Date;
  registrationStartDate: Date;
  eventDate: Date;
  fees: number;
  prize: number;
  teams: Team[];
}

interface Team {
  id: string;
  eventId: string;
  eventSlug: string;
  leaderId: string;
  teamName: string;
  createdAt: Date;
  members: TeamMember[];
  isRegisterd: boolean;
  isVerified: boolean;
}

interface TeamMember {
  id: string;
  teamId: string;
  teamName: string;
  userId: string;
  role: "LEADER" | "MEMBER";
}
