const path = require("path")
const Bree = require("bree")

const bree = new Bree({
  jobs: [
    {
      name: "worker-1",
      interval: "every second",
    },
  ],
}) // start all jobs (this is the equivalent of reloading a crontab):
;(async () => {
  await bree.start()
})()
