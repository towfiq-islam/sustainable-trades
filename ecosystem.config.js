module.exports = {
  apps: [
    {
      name: "sustainable-trades",
      script: "npm",
      args: "start",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
  ],
};
