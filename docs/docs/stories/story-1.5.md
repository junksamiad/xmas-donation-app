# Story 1.5: Real-time Gamification & Polish

## Overview
Bring the app to life with real-time department leaderboard updates, progress animations, and final polish. This is where we "10X" the experience.

## Acceptance Criteria
- [ ] Department leaderboard auto-updates every 5-10 seconds
- [ ] Animated progress bars showing donation counts
- [ ] Department rankings with smooth position changes
- [ ] "New donation" toast notifications
- [ ] Live count of available children
- [ ] Percentage completion indicator
- [ ] Smooth number counting animations
- [ ] Mobile-optimized leaderboard view

## Technical Approach
1. **Real-time Updates**
   - SWR with 5-second refresh interval
   - Optimistic updates for immediate feedback
   - Smooth data transitions (no jarring updates)
   - Background refetch on focus

2. **Leaderboard Component**
   - Animated bar charts (Framer Motion)
   - Department badges/colors
   - Trophy icons for top 3
   - Relative and absolute metrics
   - Expandable for detail view

3. **Visual Feedback**
   - Toast notifications for new donations
   - Pulse animation on updates
   - Number count-up animations
   - Celebration effects for milestones

4. **Performance**
   - Debounced updates
   - Request deduplication
   - Efficient re-renders
   - Skeleton states during loading

## Dependencies
- Story 1.4 completion (API endpoints ready)
- Story 1.2 completion (UI components ready)

## Testing Strategy
- **When to Test**: Continuous during development
- **Test Types**: Performance testing, visual testing
- **Quality Gates**: Smooth animations at 60fps
- **Notes**: Test with simulated high-frequency updates