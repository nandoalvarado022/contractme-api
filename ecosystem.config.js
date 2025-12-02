module.exports = {
  apps: [
    {
      name: "contractme-api",
      script: "./dist/main.js",
      instances: "max",
      exec_mode: "cluster",
      env_production: {
        NODE_ENV: "prod",
        DD_LOGS_INJECTION: "true",
      },
      // Logging
      error_file: "./logs/pm2-error.log",
      out_file: "./logs/pm2-out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      merge_logs: true,

      // Restart behavior
      autorestart: true,
      max_restarts: 10,
      min_uptime: "10s",
      max_memory_restart: "1G",

      // Advanced features
      watch: false,
      ignore_watch: ["node_modules", "logs", ".git"],

      // Graceful shutdown
      kill_timeout: 5000,
      wait_ready: true,
      listen_timeout: 10000,
    },
  ],
};
