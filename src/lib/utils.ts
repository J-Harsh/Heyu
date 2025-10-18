import { clsx, type ClassValue } from "clsx";
import { intervalToDuration } from "date-fns";
import { twMerge } from "tailwind-merge";
import { Doc } from "../../convex/_generated/dataModel";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type Interview = Doc<"interviews">;
type User = Doc<"users">;

export const groupInterviews = (interviews: Interview[]) => {
  if (!interviews) return {};

  return interviews.reduce((acc: Record<string, Interview[]>, interview: Interview) => {
    const status = interview.status;

    // Group by stored status
    if (status === "scheduled") {
      acc.scheduled = [...(acc.scheduled || []), interview];
    } else if (status === "ongoing") {
      acc.ongoing = [...(acc.ongoing || []), interview];
    } else if (status === "completed") {
      // Further categorize completed interviews by result
      if (interview.result === "pass" || interview.result === "fail") {
        acc.reviewed = [...(acc.reviewed || []), interview];
      } else {
        acc.pending_review = [...(acc.pending_review || []), interview];
      }
    }

    return acc;
  }, {});
};

export const getCandidateInfo = (users: User[], candidateId?: string) => {
  if (!candidateId) {
    return {
      name: "No candidate assigned",
      image: "",
      initials: "NC",
    };
  }
  const candidate = users?.find((user) => user.clerkId === candidateId);
  return {
    name: candidate?.name || "Unknown Candidate",
    image: candidate?.image || "",
    initials:
      candidate?.name
        ?.split(" ")
        .map((n) => n[0])
        .join("") || "UC",
  };
};

export const getInterviewerInfo = (users: User[], interviewerId: string) => {
  const interviewer = users?.find((user) => user.clerkId === interviewerId);
  return {
    name: interviewer?.name || "Unknown Interviewer",
    image: interviewer?.image,
    initials:
      interviewer?.name
        ?.split(" ")
        .map((n) => n[0])
        .join("") || "UI",
  };
};

export const getUserInfo = (users: User[], userId: string) => {
  const user = users?.find((u) => u.clerkId === userId);
  return {
    name: user?.name || "Unknown User",
    image: user?.image,
    initials:
      user?.name
        ?.split(" ")
        .map((n) => n[0])
        .join("") || "U",
  };
};

export const calculateRecordingDuration = (startTime: string, endTime: string) => {
  const start = new Date(startTime);
  const end = new Date(endTime);

  const duration = intervalToDuration({ start, end });

  if (duration.hours && duration.hours > 0) {
    return `${duration.hours}:${String(duration.minutes).padStart(2, "0")}:${String(
      duration.seconds
    ).padStart(2, "0")}`;
  }

  if (duration.minutes && duration.minutes > 0) {
    return `${duration.minutes}:${String(duration.seconds).padStart(2, "0")}`;
  }

  return `${duration.seconds} seconds`;
};

export const getMeetingStatus = (interview: Interview) => {
  // Use the stored status from the database
  const status = interview.status;

  // Map stored status to UI status
  if (status === "scheduled") {
    return "scheduled";
  } else if (status === "ongoing") {
    return "ongoing";
  } else if (status === "completed") {
    // Check if it's been reviewed (result is set)
    if (interview.result === "pass" || interview.result === "fail") {
      return "reviewed";
    }
    // If completed but no result, it's pending review
    return "pending_review";
  }

  // Fallback: treat any other status as pending review
  return "pending_review";
};