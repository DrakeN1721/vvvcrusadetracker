Project Requirements for VVV.net Crusade Tracker Webapp
1. Project Overview
A mobile-friendly web application to help @vvvdotnet crusade participants track and share progress in events like fitness crusades (e.g., bench press, deadlifts, overhead press) and meal accountability, inspired by posts from @draken1721, @SunshineladyXd, @Luka710O, and @MantukasVeteran on X. The app will allow users to log in with Discord, select crusades, input progress, and generate X posts with photos, mimicking the gold and black high-quality theme of https://chips.vvv.net/. The app will be built using Claude-generated code in the Windsurf environment and deployed via Cloudflare.
2. Functional Requirements
2.1 Authentication

Discord Login: Users must log in using their Discord account via OAuth2 for secure authentication.
X Account Integration: Users must connect their X account to enable posting progress updates directly to X.
Session Management: Maintain user sessions securely, with logout functionality.

2.2 Crusade Selection

Crusade List: Display available crusades (e.g., Fitness Crusades, Meal Accountability, Daily Workout) fetched from a predefined or admin-managed list.
Selection Interface: Allow users to select one or multiple crusades to participate in or track progress for.
Progress Dashboard: Show a dashboard with selected crusades and their current progress (e.g., latest reps, meals logged).

2.3 Progress Tracking

Input Fields: Provide forms for users to log progress based on crusade type:
Fitness Crusades: Fields for exercise type (e.g., bench press, deadlift, overhead press), weight (e.g., 67.5kg), reps (e.g., 12), and notes (e.g., "form felt smooth").
Meal Accountability: Fields for meal type (e.g., breakfast, lunch), calorie count (e.g., 450 kcal), and food items (e.g., "eggs with bacon, zucchini").
Daily Workout: Fields for workout details (e.g., type, duration, notes).


Photo Upload: Allow users to upload photos from their mobile device or desktop to attach to progress updates (e.g., meal photos, workout videos).
Progress History: Store and display a history of user progress entries for each crusade, with timestamps and details.

2.4 X Post Generation

Automated Post Creation: Generate an X post based on user input, formatted similarly to existing posts (e.g., "Bench press challenge from @vvvdotnet fitness crusades. $V 67.5kg x 12 Best set so far.").
Photo Attachment: Include uploaded photos in the X post.
Post Preview: Allow users to preview the generated post before publishing.
Direct Posting: Post to X using the user’s connected X account via X API.
Post Link: Provide a link to the published X post for user reference.

2.5 Chips Leaderboard Integration

Leaderboard Display: Show a Chips leaderboard reflecting user rankings based on crusade participation and progress, styled to match https://chips.vvv.net/.[](https://assets.hahwul.com/wl-cts-100000.txt)
$V Airdrop Tracking: Display user eligibility or status for $V airdrops tied to crusade activities, if applicable (based on X posts mentioning $V).
Dynamic Updates: Fetch leaderboard data from an API or admin-managed source, updating in real-time or on refresh.

3. Non-Functional Requirements
3.1 User Interface

Theme: Mimic the gold and black high-quality aesthetic of https://chips.vvv.net/, including fonts, colors, and layout for a premium feel.
Mobile-Friendly: Fully responsive design optimized for mobile devices (iOS and Android) and desktops, ensuring usability on small screens.
Accessibility: Follow WCAG 2.1 guidelines for accessibility (e.g., keyboard navigation, screen reader support).

3.2 Performance

Load Time: Pages should load within 2 seconds on a standard 4G connection.
Scalability: Support up to 1,000 concurrent users without performance degradation.
Caching: Use Cloudflare caching to optimize load times and reduce server load.

3.3 Security

Data Protection: Encrypt user data (e.g., progress entries, photos) in transit (HTTPS) and at rest.
Authentication Security: Secure Discord and X API integrations with OAuth2 tokens stored securely.
Input Validation: Sanitize and validate all user inputs to prevent XSS and SQL injection attacks.
Cloudflare Security: Leverage Cloudflare’s WAF and DDoS protection for deployment.

3.4 Deployment

Platform: Deploy the webapp on Cloudflare Pages or Workers for fast, scalable hosting.
CI/CD: Set up a CI/CD pipeline for automated testing and deployment using Claude-generated code in Windsurf.
Domain: Host on a custom domain (e.g., crusade.vvv.net) with Cloudflare DNS management.

4. Technical Requirements
4.1 Frontend

Framework: React with JSX for a dynamic, component-based UI, using CDN-hosted React (e.g., cdn.jsdelivr.net).
Styling: Tailwind CSS for responsive, theme-consistent styling (gold and black color scheme).
Photo Upload: HTML5 File API for mobile and desktop photo uploads, with client-side validation (e.g., max 5MB, JPEG/PNG formats).
Mobile Optimization: Use responsive design with media queries and touch-friendly controls.

4.2 Backend

Environment: Windsurf for Claude-generated backend code (e.g., Node.js or Python).
API: RESTful API for:
User authentication (Discord, X).
Crusade selection and progress storage.
Leaderboard data retrieval.
X post generation and publishing.


Database: Cloudflare D1 or SQLite for lightweight storage of user data, progress, and crusade details.
File Storage: Cloudflare R2 for storing uploaded photos securely.

4.3 Integrations

Discord OAuth2: For user login, using Discord’s API.
X API: For connecting X accounts and posting updates with text and photos.
Cloudflare: For deployment, caching, WAF, and DNS management.
Claude in Windsurf: For generating backend and frontend code iteratively.

5. User Stories

As a crusade participant, I want to log in with Discord so I can securely access the app.
As a user, I want to connect my X account so I can share progress posts directly.
As a participant, I want to select a crusade (e.g., bench press, meal accountability) so I can track my progress.
As a fitness enthusiast, I want to log my bench press reps and weight with notes so I can monitor improvement.
As a user, I want to upload a meal photo and calorie details so I can share my meal accountability on X.
As a participant, I want to see the Chips leaderboard so I can compare my progress with others.
As a mobile user, I want a responsive app so I can use it easily on my phone.
As a user, I want the app to look like chips.vvv.net so it feels premium and consistent.

6. Constraints

Budget: Minimize costs by using Cloudflare’s free tier for Pages, Workers, and R2 where possible.
Timeline: Develop and deploy MVP within 6 weeks.
Browser Compatibility: Support latest versions of Chrome, Safari, Firefox, and Edge.
Photo Upload Limits: Max 5MB per photo, 2 photos per post.

7. Assumptions

Users have active Discord and X accounts.
@vvvdotnet will provide or approve a list of crusades and leaderboard data.
Claude in Windsurf can generate functional code for React, Node.js, and Cloudflare integrations.
Cloudflare’s free tier is sufficient for initial deployment and scaling.

8. Out of Scope

Native mobile app development (webapp only).
Real-time chat or messaging features.
Advanced analytics beyond leaderboard display.
Support for non-Discord or non-X authentication methods.

9. Deliverables

Fully functional webapp deployed on Cloudflare.
Source code repository with Claude-generated code (React, Node.js, Tailwind CSS).
Documentation for setup, deployment, and API usage.
User guide for crusade participants.

10. Success Criteria

90% of users can log in, select a crusade, log progress, and post to X without errors.
App matches the gold and black theme of https://chips.vvv.net/ visually.
Mobile users report no usability issues on iOS/Android.
Leaderboard updates accurately reflect user progress.
Deployment on Cloudflare is stable with <1% downtime.


