---
layout: policy
locale: en
kind: privacy
permalink: /privacy-policy/en/
---
# folino Privacy Policy

Last updated: October 11, 2026

This Privacy Policy describes how folino, the sheet-music app provided by Harmolo (hereinafter referred to as “we” or “our”), handles information on iPhone, iPad, Mac and Android. Harmolo's other apps are covered by the [Harmolo Privacy Policy](https://harmolo.com/privacy-policy/en/).

folino works without an account. Reading, playing, editing and annotating scores need no sign-in, and your scores stay on your device unless you sign in. What is described under “Account, Sync and Shared Groups” below happens only if you choose to sign in.

## Information We Collect and Purpose of Use

1. **Crash and Diagnostic Data**
   folino collects crash and diagnostic information — such as crash stack traces, a short log of the steps before a problem, and standard device details (device model, OS version, app version) — through a crash-reporting service (Firebase Crashlytics) to improve stability and fix bugs. The service software may also send technical diagnostic signals about its own operation. You can turn crash reporting off in Settings → Privacy. This data is not linked to your identity.

2. **Usage Data**
   folino collects usage data, such as screen views, the features used and counts of items, through an analytics service (Google Analytics for Firebase) to improve functionality. The analytics service also records standard context — app and OS version, device model, language, session start and length — together with an identifier for the app installation, and derives an approximate (city-level) location from the network address. No names, e-mail addresses, account identifiers or content (such as titles or files) are sent to the analytics service, and this data is not linked to your identity. You can turn usage analytics off in Settings → Privacy.

3. **Microphone** (Mac)
   On the Mac, the pitch bar uses the microphone to show the pitch of your voice or instrument in real time. This audio is processed solely on your device. It is never recorded, stored, or transmitted to us or any third party.

4. **Account, Sync and Shared Groups** (only if you sign in)
   Signing in is optional and is what enables syncing your library between your devices and sharing with a group. If you sign in, we collect the following, and it is linked to your account:

   - **Account information.** You can sign in with Apple, with Google, or with a sign-in link sent to your e-mail address. We receive an account identifier, your e-mail address (with Sign in with Apple's “Hide My Email”, a relay address) and, if the sign-in service provides one or you enter one, your name. When you ask for a sign-in link, your e-mail address is sent to our server, which creates the link and sends the e-mail through our e-mail delivery provider; we keep one-way hashes of the address and of the network address the request came from, with the times of the requests, only to limit repeated requests, and delete them automatically once a day has passed since the last request.
   - **Profile.** The display name you choose and, if you add one, a profile photo. Photos are resized and stripped of location and camera metadata before upload. Your profile is shown to the members of groups you belong to, and other signed-in folino users who know your account identifier can look it up.
   - **Your scores and annotations.** When sync is on (you can turn it off at any time in Settings), the score files in your library, their details (such as title, composer, file size and whether they are favorites), your annotations, and a history of the note edits you make (including which device made them) are stored in the cloud so that your other devices receive them.
   - **Shared groups.** Groups are invite-only. What you add to a group — scores, the annotations you mark as shared, the group's name and picture — is visible to the group's members, along with your display name and profile photo. Annotations you mark as private are stored with the group but are not shown to other members; the group's administrator has technical access to them so that deleting a group can remove them, and folino never displays them to the administrator.
   - **Activity on shared and synced scores.** While you have a synced or shared score open, your other devices and the members of that group can see that you are viewing or editing it and where your cursor is. This information is removed when you close the score or go offline. While you edit a synced score, a short-lived edit lock carrying your display name is kept so that two people do not edit at the same time.
   - **Device identifier.** A random identifier created for each installation of the app is stored with the activity, edit lock and edit history above, so that your own devices can be told apart. It is not used for advertising or tracking.
   - **Subscriptions.** Buying folino plus or folino pro is optional and needs a signed-in account; the plan belongs to that account, and creating and editing scores stays free. The App Store (iPhone, iPad, Mac) or Google Play (Android) processes the purchase, and we never receive your payment card or billing details. To apply the plan, the app sends the store’s signed transaction information to our server, which verifies it with the store and keeps a subscription record (the store, the product — plan and period — the subscription’s state, the purchase and expiry dates, and the store’s transaction identifier) together with a purchase token that links the purchase to your account; only the resulting plan (for example “plus”) is written to the account itself, and the app reads only that. The store (Apple) notifies our server of renewals, cancellations and refunds, and our server also checks the subscription’s status with the store periodically, to keep the record current. This data is used only to provide your plan, not for advertising or tracking.
   - **Reports and feedback.** If you report a member or a group, or send feedback, your own e-mail app opens a message to us containing the identifiers needed to act on it (for example the group, the member and your account identifier) and your app version, OS version and device model. Nothing is sent unless you send that e-mail.

   We use this information only to provide these features: signing in, syncing, sharing with your groups, applying a subscription plan, and handling reports. The data is stored with our cloud provider and is not end-to-end encrypted, so it is accessible to us as the operator of the service; we access it only when needed to operate the service, respond to a report, or comply with the law.

folino shows no ads. We do not sell personal information, and we do not use it for tracking across other companies' apps or websites.

## Service Providers and Sharing of Personal Information

We do not share personal information with third parties, except as described in this policy or as required by law. The following providers process data on our behalf:

- **Google (Firebase)** — account sign-in (Firebase Authentication), cloud storage of synced and shared data (Cloud Firestore, Cloud Storage, Realtime Database), server functions, app integrity checks (Firebase App Check), configuration, crash reporting (Firebase Crashlytics) and usage analytics (Google Analytics for Firebase).
- **Resend** — delivery of sign-in e-mails.
- **Apple and Google** — when you choose Sign in with Apple or Sign in with Google, that service handles your sign-in under its own privacy policy. When you buy a subscription, the App Store or Google Play also processes the payment under its own terms and privacy policy.
- **GitHub** — folino downloads additional instrument sounds from GitHub, which receives standard request information such as your network address.

Content you add to a shared group is, by design, shared with that group's members.

Your data may be stored and processed in countries other than your own, including Japan, Singapore and the United States.

## Data Retention and Deletion

- **Crash and diagnostic data** is retained by the crash-reporting service for a limited period and then deleted. Firebase Crashlytics keeps crash data for 90 days before it begins removing it from its live and backup systems.
- **Usage data** is retained by the analytics service for the retention period we configure, at most 14 months.
- **Account and synced data** is kept until you delete your account. The history of note edits is deleted automatically about 12 months after each edit. A score you move to Recently Deleted is removed from your other devices, but its server copy is kept until you delete your account.
- **Deleting your account.** Settings → Account → Delete Account… deletes your account together with the scores, annotations, edit history, profile and photos stored for it, and removes you from your groups (a group you were the last member of is deleted). Scores you added to a group that continues to exist remain available to its other members, and copies already downloaded to other members' devices cannot be recalled. Data on your own device is not deleted by deleting your account.
- **Subscription records.** Deleting your folino account does not cancel your subscription with the store; cancel it in the App Store or Google Play subscription settings. When you delete your account, we remove the purchase token and the record’s link to your account. The subscription record itself, without the link to you, is kept as the record of a store purchase, for accounting and refunds and so that Restore Purchases can later re-attach an active subscription to a new account.
- You can also request access to, correction of, or deletion of data associated with your use of folino by contacting us at the e-mail address below.

## Changes to This Policy

We may update this Privacy Policy when necessary. Any changes will take effect once posted on this page.

## Contact

Provider: Harmolo
Email: contact@harmolo.com
