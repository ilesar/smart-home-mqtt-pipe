module.exports = {
    apps: [
        {
            name: "MQTT Pipe",
            script: 'dist/index.js',
            watch: './src',
            env: {
                NODE_ENV: "development",
            },
            env_production: {
                NODE_ENV: "production",
            }
        },
    ],

    deploy: {
        production: {
            ssh_options: 'StrictHostKeyChecking=no',
            user: 'ivan',
            host: ['192.168.31.200'],
            ref: 'origin/master',
            repo: 'git@github.com:ilesar/smart-home-mqtt-pipe.git',
            path: '/home/ivan/Servers/smart-home/mqtt-pipe',
            'pre-deploy-local': '',
            'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js --env production',
            'pre-setup': '',
            env: {
                "NODE_ENV": "production"
            }
        }
    }
};
