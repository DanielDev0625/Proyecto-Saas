// Configuración de PM2 para el servidor (AWS): mantiene MartGo encendido
// y lo reinicia si se cae. Uso: pm2 start ecosystem.config.js
module.exports = {
  apps: [
    {
      name: "martgo",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3000",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
