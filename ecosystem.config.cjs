module.exports = {
  apps: [
    {
      name: "mindflow",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3001",
      cwd: "/root/workspace/mindflow",
      env: {
        NODE_ENV: "production",
        WECHAT_APPID: "wxf002766015869b87",
        WECHAT_SECRET: "97e41ff96ea438e0d950d420d1c9d126",
        ADMIN_USERNAME: "admin",
        ADMIN_PASSWORD: "admin123",
        JWT_SECRET: "mindflow_wechat_jwt_secret_key_2024",
      },
    },
  ],
}
