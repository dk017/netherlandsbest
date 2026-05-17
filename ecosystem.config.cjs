module.exports = {
  apps: [
    {
      name: "netherlandsbest",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3002",
      cwd: __dirname,
      env: {
        NODE_ENV: "production"
      }
    }
  ]
};
