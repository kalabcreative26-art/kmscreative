# KMS Creative contact, messaging, and visual update

## What will change

- Update the public phone number to **0978792495** and keep the Telegram link **t.me/kalabms** in the contact area, footer, and client dashboard.
- Remove the public email button and email address. Visitors will contact KMS Creative only through the website form, phone, or Telegram.
- Require an account before someone can send a website message. Signed-out visitors will see a clear sign-in button instead of the form.
- Turn dashboard messages into a private two-way inbox:
  - Clients can send messages after signing in.
  - You can see the client’s account name and email in a private owner inbox.
  - You reply from the owner inbox.
  - Clients see your replies only inside their website dashboard, not in their email.
- Add service-aware Telegram buttons. Each service opens Telegram with a ready-to-send message naming that service. The general Home/Contact Telegram action first shows a short service list, then prepares the matching message.
- Add a logo-based motion loading screen only when navigation or data is genuinely taking longer than a short delay, so fast visits are never slowed down.
- Refine the existing interface toward a polished Apple-style glass look with smoother glass controls and typography, while keeping the current purple palette and performant animations.
- Remove “Multi-disciplinary creative studio” from the home page.

## Access and privacy

- Add a separate secure roles system for **owner** and **client** accounts; roles will never be stored in a profile or browser storage.
- Assign the owner role to the KMS Creative account and restrict studio settings, all-client messages, and owner replies to that role.
- Clients can only read and send messages in their own conversations.
- Signed-out visitors cannot submit messages or read any inbox content.
- Tighten the existing settings permissions so ordinary client accounts cannot change the studio name, logo, phone, or Telegram link.

## Messaging structure

- Add private conversations and individual messages so sender, recipient, read state, and timestamps are preserved.
- Keep existing client announcements visible and migrate compatible existing message data into the new inbox experience.
- Add an owner conversation list with unread counts, client identity, latest message, and reply controls.
- Add a client conversation view to the existing dashboard with send, loading, empty, error, and read states.

## Email alerts

- Prepare the message flow so a new client message can trigger an alert to **kalabcreative26@gmail.com** without showing that address publicly.
- Email alerts cannot send yet because there is no owned sending domain. The private website inbox will work immediately; alerts can be activated after you buy and verify a domain.

## Pages and finishing checks

- Wire the completed portfolio and authenticated contact sections into Home while preserving all existing pages and service links.
- Update page titles and sharing descriptions on each changed page.
- Test signed-out contact restrictions, client messaging, owner replies, phone/Telegram actions, slow-loading behavior, and desktop/mobile layouts.
- Verify the final build, permissions, and browser behavior before completion.
