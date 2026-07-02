# SEO API Setup Guide

This guide is for the EquiSaaS BD project owner.

Goal:
- connect Bing Webmaster
- connect Google Search Console
- connect PageSpeed Insights
- optionally connect GA4 later

This guide avoids the confusing Search Console service-account path.
For this project, the easiest setup is:
- Bing API key
- Google API key for PageSpeed
- Google OAuth login with your own Google account for Search Console and GA4

If you already created a Google service account:
- do not delete it
- keep the JSON file as a backup
- but do not use it for the current Search Console setup path
- for now, the active setup should use your own Google account through OAuth

Important clarification:
- you do NOT need a new Google Cloud project
- keep using the same Google Cloud project you already created
- keep the PageSpeed API you already enabled
- keep the service account you already created as backup only
- the only additional Google item you still need from that SAME project is an OAuth Desktop App JSON

## 1. IndexNow

IndexNow is already set up for this project.

Current live key file:
- `https://equisaas-bd.com/equisaas-bd-20260406-seo.txt`

Current file content:
- `equisaas-bd-20260406-seo`

You do not need to change anything right now.

If Bing later gives you a new key and you want to rotate it, we can do that later.

## 2. What you need to collect now

Collect these first:

1. Bing Webmaster API key
2. Google Cloud project
3. Google PageSpeed Insights API key
4. Google OAuth Desktop App credentials JSON

Optional later:

5. GA4 property ID

## 3. Bing Webmaster API key

Open:
- `https://www.bing.com/webmasters/about`

Steps:

1. Sign in
2. Make sure `equisaas-bd.com` is already added and verified
3. Top-right `Settings`
4. Open `API Access`
5. Click `Generate API Key`
6. Copy the key

Save it in a temporary text file for now. Do not paste it in chat.

## 4. Google Cloud project

Open:
- `https://console.cloud.google.com/`

Steps:

1. Click the top project selector
2. Click `New Project`
3. Project name: `EquiSaaS SEO`
4. Click `Create`

## 5. Enable Search Console API

Open:
- `https://console.cloud.google.com/apis/library/searchconsole.googleapis.com`

Steps:

1. Make sure the correct project is selected
2. Click `Enable`

## 6. Enable PageSpeed Insights API

Open:
- `https://console.cloud.google.com/apis/library/pagespeedonline.googleapis.com`

Steps:

1. Make sure the same project is selected
2. Click `Enable`

## 7. Create PageSpeed API key

Open:
- `https://console.cloud.google.com/apis/credentials`

Steps:

1. Click `Create Credentials`
2. Click `API key`
3. Copy the key

You can restrict it later. For now, just create it.

## 8. Create Google OAuth Desktop App credentials

We will use your own Google account login for Search Console and GA4.
This is easier than using a service account.

Open:
- `https://console.cloud.google.com/apis/credentials`

If Google asks for an OAuth consent screen first:

1. Click `OAuth consent screen`
2. Choose `External`
3. App name: `EquiSaaS SEO Local`
4. User support email: your Gmail
5. Developer contact email: your Gmail
6. Save and continue until finished

Then create OAuth credentials:

1. Go back to `Credentials`
2. Click `Create Credentials`
3. Click `OAuth client ID`
4. Application type: `Desktop app`
5. Name: `EquiSaaS SEO Desktop`
6. Click `Create`
7. Click `Download JSON`

Save the downloaded file here:
- `D:\projects\EquiSaaS BD\artifacts\secrets\google-seo-oauth-client.json`

## 8.1 Add yourself as a Google OAuth test user

If Google shows:
- `Access blocked`
- `app has not completed the Google verification process`

That is normal for a local app in testing mode.

Open:
- `https://console.cloud.google.com/auth/audience`

Steps:

1. Make sure the same Google Cloud project is selected
2. Keep publishing status as `Testing`
3. Find `Test users`
4. Click `Add users`
5. Add:
   - `kholifaahmadalamin@gmail.com`
6. Save

Wait 1 to 3 minutes, then run the login command again.

## 9. Confirm Search Console property access

Open:
- `https://search.google.com/search-console`

Confirm that:
- `equisaas-bd.com` property exists
- you can open it normally with your Gmail account

Important:
- do not add the service account email anymore
- we will authenticate using your normal Google account during local login

## 10. Optional: GA4 property ID

Open:
- `https://analytics.google.com/`

If GA4 is already configured:

1. Open `Admin`
2. Find the property for EquiSaaS BD
3. Copy the `Property ID`

If GA4 is not configured yet, leave this for later.

## 11. Local file you must create

Create this file:
- `D:\projects\EquiSaaS BD\.env.seo.local`

Put this inside:

```env
BING_WEBMASTER_API_KEY=
GOOGLE_PAGESPEED_API_KEY=
GOOGLE_OAUTH_CLIENT_JSON=D:\projects\EquiSaaS BD\artifacts\secrets\google-seo-oauth-client.json
GA4_PROPERTY_ID=
```

Then fill:
- `BING_WEBMASTER_API_KEY` with your Bing key
- `GOOGLE_PAGESPEED_API_KEY` with your PageSpeed key
- `GOOGLE_OAUTH_CLIENT_JSON` with the exact JSON path
- `GA4_PROPERTY_ID` only if you already have one

If you already downloaded a service-account JSON file, store it here as backup:
- `D:\projects\EquiSaaS BD\artifacts\secrets\google-seo-service-account.json`

You do not need to reference that service-account JSON in `.env.seo.local` for the current setup.

## 12. What not to send in chat

Do not paste:
- Bing API key
- Google API key
- OAuth client JSON content
- any secret token

Only tell the agent:
- `seo done`

## 13. What happens after you say "seo done"

The agent will:

1. Verify the local files exist
2. Add the SEO connector scripts
3. Connect Search Console using OAuth login
4. Connect PageSpeed API
5. Connect Bing Webmaster API
6. Prepare automated reports and submission flows
7. Optionally connect GA4 if the property ID is available

## 14. If something fails

If Search Console says access denied:
- make sure you are signed in with the same Google account that owns the property

If Bing API key is missing:
- revisit `Settings > API Access`

If Google asks for an OAuth consent screen:
- create it once and continue

If GA4 is confusing:
- skip it for now and continue with Bing + Search Console + PageSpeed first
