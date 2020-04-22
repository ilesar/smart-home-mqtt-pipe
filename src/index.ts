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
            client.subscribe('5ledstrip/config', function (error: Error) {
                if (!error) {
                    console.error(error);
                }
            });
            console.log('connected');
        });

        client.on('message', (topic, message) => {
            if (topic === "configuration") {
                const jsonPayload = JSON.parse(message.toString());
                console.log(jsonPayload);
                axios.post(
                    'http://192.168.31.248:8000/api/mqtt/configuration',
                    querystring.stringify({
                        deviceId: jsonPayload.deviceId,
                        configuration: jsonPayload.configs,
                    }),
                    {
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    }
                ).then((response: AxiosResponse) => {
                    console.log(response.data);
                }).catch((error) => {
                    console.error('ERROR');
                    console.error(error.response);
                });
            }
        });
    } catch (e) {
        console.error(e);
    }


    // const jsonPayload = {
    //     deviceId: '5ledstrip',
    //     configs: [{r: 255, g: 255, b: 255, type: 'color'},
    //         {r: 255, g: 255, b: 255, type: 'color'},
    //         {r: 255, g: 255, b: 255, type: 'color'},
    //         {r: 255, g: 255, b: 255, type: 'color'},
    //         {r: 255, g: 255, b: 255, type: 'color'},
    //         {r: 255, g: 255, b: 255, type: 'color'},
    //         {r: 255, g: 255, b: 255, type: 'color'},
    //         {r: 255, g: 255, b: 255, type: 'color'},
    //         {r: 255, g: 255, b: 255, type: 'color'},
    //         {r: 255, g: 255, b: 255, type: 'color'},
    //         {r: 255, g: 255, b: 255, type: 'color'},
    //         {r: 255, g: 255, b: 255, type: 'color'},
    //         {r: 255, g: 255, b: 255, type: 'color'},
    //         {r: 255, g: 255, b: 255, type: 'color'},
    //         {r: 255, g: 255, b: 255, type: 'color'}],
    // };
    // axios.post(
    //     'http://192.168.31.248:8000/api/mqtt/configuration',
    //     querystring.stringify({
    //         deviceId: jsonPayload.deviceId,
    //         configuration: JSON.stringify(jsonPayload.configs),
    //     }),
    //     {
    //         headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    //     }
    // ).then((response: AxiosResponse) => {
    //     console.log(response.data);
    // }).catch((error) => {
    //     console.error('ERROR');
    //     console.error(error.response);
    // });
})();
