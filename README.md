# Research App

## What is this all about?

I was looking for an app where I could save links and add notes to it. Nothing on the market seemed to fit my needs, so I decided to build my own. This is the result which I simply named 'Research'. 
I don't plan on hosting a public version on it, but if you want to self-host it, I won't be stopping you.

## What features does it have?

- Add new links on homepage
- Browse existing ones on accessible `/links` page
- Update and delete them via easy-to-use interface
- Import existing labels in bulk using `/import` page

## How do I set it up?

1. Fill-in `.env` with credentials for your database and GitHub OAuth app
   - If you want to use other login method than GitHub, modify the `/pages/api/auth/[...nextauth].js` file
2. Install dependencies using your favourite package manager
3. Deploy to your platform of choice (I recommend Vercel)

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
