const { spawn } = require("child_process");

const proc = spawn("npm", ["run", "dev"], {
  stdio: "inherit",
  shell: true
});

proc.on("close", (code) => {
  console.log("Dev server exited:", code);
});
