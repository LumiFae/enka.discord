# enka.discord

enka.discord is a free and simple to use Discord bot for getting your builds / characters from [enka.network](https://enka.network) into your Discord server.

Invite Link: https://discord.com/oauth2/authorize?client_id=1296584939583701044

## Features

- Get builds from an enka.network account or UID from both Genshin Impact and Honkai: Star Rail
- Connect your enka.network account to access your builds easily
- Uses [enka.cards](https://github.com/JayXTQ/enka.cards) to generate and display cards
- Find a users profile on enka.network and get their name, avatar and bio.

## Commands

- `/help` - Get a list of commands
- `/build` - Get your builds, if your account is connected
  - `/build uid:<uid>` - Get a users builds by their UID
  - `/build name:<name>` - Get a users builds by their name
- `/profile` - Get your enka.network profile, if connected
    - `/profile name:<name>` - Get a users profile by their name
- `/connect name:<name>` - Connect your enka.network account to your Discord account
- `/disconnect` - Disconnect your enka.network account from your Discord account
- `/invite` - Get the invite link for the bot

## Privacy

All information saved within enka.discord is public information and can be easily changed by the user.

Only data that is saved is the user's enka.network account if they choose to connect it, we will only store the name of this account but when you connect we require you confirm it is you via certain means like putting a code in an editable field on the profile.

Other data like language selection may be selectable in future but right now the only data saved is a linked enka.network account.

## Terms of use

Do not use this bot to overload enka.cards or enka.network, if you are found to be doing so we can remove your permissions from triggering any of the commands we have on the bot and also limit you from using enka.cards, then enka.network can block you if needed.

You should only use this bot to showcase builds and see other users builds, you can also use it to look at profiles, connect/disconnect an enka account to your Discord account.
