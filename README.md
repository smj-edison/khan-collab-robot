# Bors khan

Note: This is not affiliated with Khan Academy in any way.

This is a robot that manages projects on Khan Academy. It will be able to manage contributors, merging, and hopefully more!

To run locally (hopefully will get cleaner):
1. Get a new khanacademy account for the bot.
2. Put the username and password in a .env file (check out example.env for referance)
5. Create a program on the bot account where commands will be posted (I called mine Bot endpoint)
6. Make a post in tips and thanks where commands will be posted (hopefully this will get more simple)
7. Get the post's kaencrypted id (use the Network tab in the browser debugger when it's created or loaded)
8. Set the COMMAND_COMMENT to the post's id
9. Set BOT_KAID to the account's KAID (On chrome do Ctrl + U on the homepage, and search for KAID in the source code)
