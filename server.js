const { exec } = require("child_process");

console.log("Starting Next.js dev server on Vercel...");

const dev = exec("next dev -p 3000");

dev.stdout.on("data", (data) => {
  console.log(data.toString());
});

dev.stderr.on("data", (data) => {
  console.error(data.toString());
});
