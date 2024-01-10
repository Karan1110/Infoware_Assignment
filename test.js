const { ToadScheduler, SimpleIntervalJob, Task } = require("toad-scheduler")

const scheduler = new ToadScheduler()

const task = new Task(
  "simple task",
  () => {
    console.log("hello world")
  },
  (err) => {
    /* handle error here */
  }
)
const job = new SimpleIntervalJob({ seconds: 5 }, task)

scheduler.addSimpleIntervalJob(job)

// when stopping your app
