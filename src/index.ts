import {Client, connect} from 'mqtt';
import * as https from 'https';
import axios, {AxiosResponse} from 'axios';

const querystring = require('querystring');

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

(async () => {
    try {
        const client: Client = connect('mqtt://mqtt-broker.smarthome.lan:1883', {
            protocol: 'mqtt',
        });

        client.on('connect', () => {
            client.subscribe('#', function (error: Error) {
                if (error) {
                    console.error(error);
                }
            });
            console.log('connected');
        });

        client.on('message', (topic, message) => {
            console.log('message');
            console.log('TOPIC', topic);
            console.log('MESSAGE', message.toString());
            if (topic === "configuration") {
                console.log(topic);
                const jsonPayload = JSON.parse(message.toString());
                console.log(jsonPayload);
                axios.post(
                    'http://backend.smarthome.lan:8000/api/mqtt/configuration',
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
    //     'http://backend.smarthome.lan:8000/api/mqtt/configuration',
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
