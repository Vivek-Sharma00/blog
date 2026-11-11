---
title: "A Professional Custom Domain Email for Free: Setting Up Zoho Mail and DNS Records"
description: "How to get a free 'you@yourdomain.com' email address using Zoho Mail's free tier, and how to properly configure MX, SPF, DKIM, and DMARC records so your mail doesn't land in spam."
pubDate: 2026-11-21
image: "https://images.unsplash.com/photo-1557200134-90327ee9fafa?w=800&auto=format&fit=crop&q=80"
tags: ["email", "dns", "web", "tools", "backend"]
---

Sending client proposals or job applications from `yourname9842@gmail.com` looks amateur. Having an email on your own domain—like `alex@yourdomain.com`—instantly builds credibility.

Google Workspace charges $6 to $7.20 per user per month. Microsoft 365 starts at similar prices. If you're a solo developer, student, or bootstrapping a side project, paying ₹500+ every month just to receive a few emails feels unnecessary.

The best-kept secret for solo developers is **Zoho Mail's Forever Free Plan**. It gives you up to **5 mailboxes, 5 GB of storage per user, and custom domain hosting for $0**.

Here is how to set it up, along with the critical DNS configuration required to keep your messages out of the spam box.

## The Big Catch: Zoho Free Tier Limitations

Before setting this up, understand the boundaries:

- **No IMAP/POP3 access:** You cannot connect your inbox to third-party desktop mail clients like Apple Mail, Thunderbird, or Outlook.
- **No automated routing/forwarding:** You can't auto-forward incoming emails to your personal Gmail.
- **Access routes:** You must use Zoho’s webmail interface or their official mobile apps (Zoho Mail for iOS/Android).

For a professional presence that costs nothing, this is a fair trade-off.

## Step 1: Sign Up for the Forever Free Plan

Zoho hides this plan deep at the bottom of their pricing table:

1. Head to `zoho.com/mail/zohomail-pricing.html`.
2. Scroll past the paid monthly tiers until you see **"Forever Free Plan"**.
3. Sign up with your existing phone number or personal email.
4. Select **"Sign up with a domain I already own"** and type in your custom domain (e.g., `yourdomain.com`).

## Step 2: Verify Domain Ownership

Zoho needs proof that you own the domain. The cleanest way is adding a TXT record to your DNS provider (Cloudflare, Namecheap, Porkbun, or GoDaddy):

```text
Type:  TXT
Host:  @ (or root)
Value: zoho-verification=zb12345678.zmverify.zoho.com
TTL:   Auto / 3600

```

Click **Verify TXT Record** in Zoho. Once verified, you will be prompted to create your primary administrator address (e.g., `admin@yourdomain.com` or `hello@yourdomain.com`).

## Step 3: Configure MX Records (Routing Inbound Mail)

MX (Mail Exchange) records tell global mail servers where to deliver emails sent to your domain. Delete any existing default MX records from your DNS manager and add Zoho's three routing targets:

| Type | Host | Priority | Target / Value |
| --- | --- | --- | --- |
| **MX** | `@` | `10` | `mx.zoho.in` (or `mx.zoho.com`) |
| **MX** | `@` | `20` | `mx2.zoho.in` (or `mx2.zoho.com`) |
| **MX** | `@` | `50` | `mx3.zoho.in` (or `mx3.zoho.com`) |

*(Note: Use `.in` if your Zoho account was registered on the Indian data center, or `.com` for the US data center. Zoho will show your specific data center during setup).*

## Step 4: The Spam Prevention Trio (SPF, DKIM, DMARC)

If you only set up MX records, you can receive emails, but outgoing messages will trigger spam warnings in Gmail. Major providers require strict sender authentication.

### 1. SPF (Sender Policy Framework)

SPF declares which IP servers are authorized to send emails on behalf of your domain:

```text
Type:  TXT
Host:  @
Value: v=spf1 include:zoho.in ~all

```

*(Replace `include:zoho.in` with `include:zoho.com` if hosted on the US server).*

### 2. DKIM (DomainKeys Identified Mail)

DKIM signs outgoing emails with a cryptographic private key. The recipient validates the signature against a public key in your DNS:

1. Inside Zoho Control Panel, go to **Email Authentication → DKIM**.
2. Click **Add Selector**, name it `zoho`, and click **Generate**.
3. Copy the generated public key and create a TXT record in your DNS manager:

```text
Type:  TXT
Host:  zoho._domainkey
Value: v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQ...

```

Wait 5 minutes, then click **Verify** and set the status to **Active** inside Zoho.

### 3. DMARC (Domain-based Message Authentication)

DMARC tells receiving mail servers what to do if an email fails both SPF and DKIM checks:

```text
Type:  TXT
Host:  _dmarc
Value: v=DMARC1; p=none; rua=mailto:admin@yourdomain.com

```

Setting policy `p=none` keeps you safe while monitoring delivery reports.

## Testing Your Email Deliverability

Don't assume your records are working. Run an end-to-end authentication test:

1. Visit [mail-tester.com](https://www.mail-tester.com).
2. It will display a temporary, randomly generated email address.
3. Open your new Zoho webmail, compose an email to that address, and send it.
4. Click **Check your score**.

If SPF, DKIM, and MX are configured properly, you should score **9/10 or 10/10**, confirming your custom domain messages will land directly in inboxes instead of spam folders.

---

Setting up a professional email identity doesn't require a monthly subscription. Pair a low-cost domain with Zoho's free tier, lock down your DNS records, and get a rock-solid custom inbox in under 15 minutes.

```

---

### What Changed & Why
- **Broke Down the Free Tier Realities:** Clarified the biggest gotcha upfront (no IMAP/POP3 access on the free tier), preventing readers from getting surprised when they can't link it to Apple Mail.
- **Detailed Critical DNS Configuration:** Walked through MX records, along with **SPF, DKIM, and DMARC**, which are required by modern mail hosts to avoid the spam box.
- **Added an Actionable Deliverability Check:** Pointed readers to `mail-tester.com` to test their SPF and DKIM headers before using the address for real business.

```