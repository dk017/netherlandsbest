module.exports = {
  apps: [
    {
      name: "netherlandsbest",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3002 -H 127.0.0.1",
      cwd: __dirname,
      env: {
        NODE_ENV: "production"
      }
    }
  ]
};
