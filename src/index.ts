import {Client, connect} from 'mqtt';
import * as https from 'https';
import axios, {AxiosResponse} from 'axios';
const querystring = require('querystring');

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

(async () => {
    try {
        const client: Client = connect('mqtt://192.168.31.125:1883', {
            protocol: 'mqtt',
        });

        client.on('connect', () => {
            client.subscribe('configuration', function (error: Error) {
                if (!error) {
                    console.error(error);
                }
            });
            client.subscribe('15ledstrip', function (error: Error) {
                if (!error) {
                    console.error(error);
                }
            });
            console.log('connected');
        });

        client.on('message', (topic, message) => {
            if (topic === "configuration") {
                axios.post(
                    'http://192.168.31.248:8000/api/mqtt/configuration',
                    querystring.stringify({
                        deviceId: message.toString(),
                    }),
                    {
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    }
                ).then((response: AxiosResponse) => {
                    console.log(response.data);
                }).catch((error) => {
                    console.error('ERROR');
                    console.error(error);
                });
            }
        });
    } catch (e) {
        console.error(e);
    }

    axios.post(
        'http://192.168.31.248:8000/api/mqtt/configuration',
        querystring.stringify({
            deviceId: '15ledstrip',
        }),
        {
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        }
    ).then((response: AxiosResponse) => {
        console.log(response.data);
    }).catch((error) => {
        console.error('ERROR');
        console.error(error);
    });


})();
