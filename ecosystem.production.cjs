module.exports = {
  apps: [
    {
      name: "netherlandsbest",
      script: "server.js",
      cwd: "/opt/netherlandsbest/current",
      env: {
        NODE_ENV: "production",
        PORT: "3002",
        HOSTNAME: "127.0.0.1"
      }
    }
  ]
};
