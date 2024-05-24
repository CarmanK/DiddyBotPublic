# DiddyBotPublic
A public, slimmed-down version of the DiddyBot Discord bot.

## PM2
* pm2 startup
  * Enables pm2 to run when the machine starts
* pm2 monit
* pm2 list
* pm2 stop npm
* pm2 start npm
* pm2 start "npm run pullAndRun" --exp-backoff-restart-delay=100
<!-- * pm2 start npm -- start -->
  * Adds npm as a process and runs the prestart/start scripts
* pm2 log --lines 100
* pm2 flush
* pm2 flush npm
* pm2 delete npm
