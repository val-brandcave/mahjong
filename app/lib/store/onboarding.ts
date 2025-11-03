import { create } from "zustand";
import { persist } from "zustand/middleware";

export type AuthMethod = "phone" | "email" | "apple" | "google" | "guest";
export type ExperienceLevel = "never_played" | "basic_rules" | "played_several" | "experienced";

interface OnboardingState {
  // Auth
  authMethod: AuthMethod | null;
  phoneNumber: string;
  countryCode: string;
  email: string;
  password: string;
  pinCode: string;
  
  // Profile
  username: string;
  avatarUrl: string;
  
  // Preferences
  experienceLevel: ExperienceLevel | null;
  tileTheme: string;
  
  // Trial
  acceptedTrial: boolean;
  
  // Actions
  setAuthMethod: (method: AuthMethod) => void;
  setPhoneNumber: (phone: string) => void;
  setCountryCode: (code: string) => void;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setPinCode: (pin: string) => void;
  setUsername: (username: string) => void;
  setAvatarUrl: (url: string) => void;
  setExperienceLevel: (level: ExperienceLevel) => void;
  setTileTheme: (theme: string) => void;
  setAcceptedTrial: (accepted: boolean) => void;
  reset: () => void;
}

const initialState = {
  authMethod: null,
  phoneNumber: "",
  countryCode: "+1",
  email: "",
  password: "",
  pinCode: "",
  username: "",
  avatarUrl: "",
  experienceLevel: null,
  tileTheme: "traditional",
  acceptedTrial: false,
};

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      ...initialState,
      
      setAuthMethod: (method) => set({ authMethod: method }),
      setPhoneNumber: (phone) => set({ phoneNumber: phone }),
      setCountryCode: (code) => set({ countryCode: code }),
      setEmail: (email) => set({ email: email }),
      setPassword: (password) => set({ password: password }),
      setPinCode: (pin) => set({ pinCode: pin }),
      setUsername: (username) => set({ username: username }),
      setAvatarUrl: (url) => set({ avatarUrl: url }),
      setExperienceLevel: (level) => set({ experienceLevel: level }),
      setTileTheme: (theme) => set({ tileTheme: theme }),
      setAcceptedTrial: (accepted) => set({ acceptedTrial: accepted }),
      reset: () => set(initialState),
    }),
    {
      name: "mahjong-onboarding",
    }
  )
);

export interface UserProfile {
  firstName: string;
  lastName: string;
  status: string;
  location: string;
  country: string;
  flair: string;
  language: string;
}

export interface UserProfileState extends UserProfile {
  level: number;
  streak: number;
  setFirstName: (name: string) => void;
  setLastName: (name: string) => void;
  setStatus: (status: string) => void;
  setLocation: (location: string) => void;
  setCountry: (country: string) => void;
  setFlair: (flair: string) => void;
  setLanguage: (language: string) => void;
  setLevel: (level: number) => void;
  setStreak: (streak: number) => void;
  resetProfile: () => void;
}

const initialProfileState: UserProfile = {
  firstName: "",
  lastName: "",
  status: "",
  location: "",
  country: "United States",
  flair: "",
  language: "English",
};

export const useUserProfileStore = create<UserProfileState>()(
  persist(
    (set) => ({
      ...initialProfileState,
      level: 8,
      streak: 12,
      
      setFirstName: (name) => set({ firstName: name }),
      setLastName: (name) => set({ lastName: name }),
      setStatus: (status) => set({ status }),
      setLocation: (location) => set({ location }),
      setCountry: (country) => set({ country }),
      setFlair: (flair) => set({ flair }),
      setLanguage: (language) => set({ language }),
      setLevel: (level) => set({ level }),
      setStreak: (streak) => set({ streak }),
      resetProfile: () => set(initialProfileState),
    }),
    {
      name: "mahjong-user-profile",
    }
  )
);

export interface Friend {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  level: number;
  avatar: string;
  country: string;
}

export interface FriendsState {
  friends: Friend[];
  addFriend: (friend: Friend) => void;
  removeFriend: (id: string) => void;
  resetFriends: () => void;
}

const initialFriendsState: Friend[] = [
  {
    id: "friend1",
    username: "sarahjohn",
    firstName: "Sarah",
    lastName: "Johnson",
    level: 12,
    avatar: "👩‍🦰",
    country: "United States",
  },
  {
    id: "friend2",
    username: "patriciachen",
    firstName: "Patricia",
    lastName: "Chen",
    level: 15,
    avatar: "👩‍🦱",
    country: "United States",
  },
];

export const useFriendsStore = create<FriendsState>()(
  persist(
    (set) => ({
      friends: initialFriendsState,
      addFriend: (friend) =>
        set((state) => ({
          friends: [...state.friends, friend],
        })),
      removeFriend: (id) =>
        set((state) => ({
          friends: state.friends.filter((f) => f.id !== id),
        })),
      resetFriends: () => set({ friends: initialFriendsState }),
    }),
    {
      name: "mahjong-friends",
    }
  )
);

export const SUGGESTED_FRIENDS: Friend[] = [
  {
    id: "user1",
    username: "codymiles512",
    firstName: "Cody",
    lastName: "Miles",
    level: 400,
    avatar: "👤",
    country: "United States",
  },
  {
    id: "user2",
    username: "return_of_n00b",
    firstName: "Return",
    lastName: "NoOb",
    level: 254,
    avatar: "👤",
    country: "United States",
  },
  {
    id: "user3",
    username: "ahsanmazindrani",
    firstName: "Ahsan",
    lastName: "M",
    level: 180,
    avatar: "❓",
    country: "India",
  },
  {
    id: "user4",
    username: "Anup1729",
    firstName: "Anup",
    lastName: "Kumar",
    level: 400,
    avatar: "👤",
    country: "India",
  },
];

export interface LeaderboardUser extends Friend {
  rank: number;
}

export const LEADERBOARD_USERS: LeaderboardUser[] = [
  {
    id: "lb1",
    username: "mahjonggmaster",
    firstName: "Margaret",
    lastName: "Sullivan",
    level: 450,
    avatar: "MS",
    country: "United States",
    rank: 1,
  },
  {
    id: "lb2",
    username: "tilewhisperer",
    firstName: "Victoria",
    lastName: "Chen",
    level: 420,
    avatar: "VC",
    country: "United States",
    rank: 2,
  },
  {
    id: "lb3",
    username: "charlestondreams",
    firstName: "Eleanor",
    lastName: "Thompson",
    level: 410,
    avatar: "ET",
    country: "United States",
    rank: 3,
  },
  {
    id: "lb4",
    username: "phoenixrisingmahj",
    firstName: "Diana",
    lastName: "Martinez",
    level: 395,
    avatar: "DM",
    country: "United States",
    rank: 4,
  },
  {
    id: "lb5",
    username: "windchaser",
    firstName: "Rebecca",
    lastName: "Kim",
    level: 380,
    avatar: "RK",
    country: "United States",
    rank: 5,
  },
  {
    id: "lb6",
    username: "silentstrategy",
    firstName: "Sophia",
    lastName: "Anderson",
    level: 365,
    avatar: "SA",
    country: "United States",
    rank: 6,
  },
  {
    id: "lb7",
    username: "goldenhand",
    firstName: "Jessica",
    lastName: "Williams",
    level: 350,
    avatar: "JW",
    country: "United States",
    rank: 7,
  },
  {
    id: "lb8",
    username: "bamboopath",
    firstName: "Amy",
    lastName: "Zhang",
    level: 335,
    avatar: "AZ",
    country: "United States",
    rank: 8,
  },
];

