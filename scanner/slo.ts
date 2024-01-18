import { Temporal } from "@js-temporal/polyfill";
import { SloType } from '@lib/repo-summaries.js';
import type { IssueOrPr, Repository } from "./github.js";

export const PRIORITY_URGENT = "Priority: Urgent";
export const PRIORITY_IMPORTANT = "Priority: Important";
export const PRIORITY_EVENTUALLY = "Priority: Eventually";
export const NEEDS_REPORTER_FEEDBACK = "Needs Reporter Feedback";

export function hasLabels(repo: Pick<Repository, 'labels'>): boolean {
  return [PRIORITY_URGENT, PRIORITY_IMPORTANT, PRIORITY_EVENTUALLY].every(label =>
    repo.labels.nodes.some(labelNode => labelNode.name === label));
}

export function whichSlo(issue: Pick<IssueOrPr, 'labels' | 'isDraft'>): SloType {
  const labels: string[] = issue.labels.nodes.map(label => label.name);
  if (issue.isDraft || labels.includes(PRIORITY_EVENTUALLY) || labels.includes(NEEDS_REPORTER_FEEDBACK)) {
    return "none";
  }
  if (labels.includes(PRIORITY_URGENT)) {
    return "urgent";
  }
  if (labels.includes(PRIORITY_IMPORTANT)) {
    return "important";
  }
  return "triage";
}

export function countSloTime(
  issue: Pick<IssueOrPr, 'createdAt' | 'author' | 'timelineItems'>,
  now: Temporal.Instant
): Temporal.Duration {
  let timeUsed = Temporal.Duration.from({ seconds: 0 });
  type PauseReason = "draft" | "need-feedback" | "closed";
  let pauseReason = new Set<PauseReason>();
  let draftChanged = false;
  let sloStartTime = Temporal.Instant.from(issue.createdAt);

  for (const timelineItem of issue.timelineItems.nodes) {
    function pause(reason: PauseReason) {
      if (pauseReason.size === 0) {
        timeUsed = timeUsed.add(sloStartTime.until(timelineItem.createdAt!));
      }
      pauseReason.add(reason);
    }
    function unpause(reason: PauseReason) {
      const deleted = pauseReason.delete(reason);
      if (pauseReason.size === 0 && deleted) {
        sloStartTime = Temporal.Instant.from(timelineItem.createdAt!);
      }
    }
    switch (timelineItem.__typename) {
      case 'ReadyForReviewEvent':
        if (!draftChanged) {
          // If the first change in draft status is to become ready for review, then the SLO must
          // have been paused for all previous events.
          timeUsed = Temporal.Duration.from({ seconds: 0 });
          draftChanged = true;
        }
        unpause("draft");
        break;
      case 'ConvertToDraftEvent':
        draftChanged = true;
        pause("draft");
        break;
      case 'LabeledEvent':
        if (timelineItem.label.name === NEEDS_REPORTER_FEEDBACK) {
          pause("need-feedback");
        }
        break;
      case 'UnlabeledEvent':
        if (timelineItem.label.name === NEEDS_REPORTER_FEEDBACK) {
          unpause("need-feedback");
        }
        break;
      case 'ClosedEvent':
        pause("closed");
        break;
      case 'ReopenedEvent':
        unpause("closed");
        break;
      case 'IssueComment':
      case 'PullRequestReview':
      case 'PullRequestReviewThread':
        if (timelineItem.author?.login !== issue.author?.login) {
          unpause("need-feedback");
        }
        break;
    }
  }
  if (pauseReason.size === 0) {
    timeUsed = timeUsed.add(sloStartTime.until(now));
  }
  return timeUsed.round({ largestUnit: 'days' });
}