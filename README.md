# Bors khan

Note: This is not affiliated with Khan Academy in any way.

This is a robot that manages projects on Khan Academy. It will be able to manage contributors, merging, and hopefully more!

To run locally (hopefully will get cleaner):
1. Get a new khanacademy account for the bot (make sure to get 5,000 energy points by watching a ton of videos).
2. Put the username and password in a .env file (check out example.env for referance)
3. Create a program on the bot account where commands will be posted (I called mine Bot endpoint)
4. Make a post in tips and thanks where commands will be posted
5. Set BOT_KAID to the account's KAID (On chrome do Ctrl + U on the homepage, and search for KAID in the source code)
6. Source the .env file (`export $(grep -v '^#' .env | xargs)` on linux)
7. Use `npm start` to start it!
