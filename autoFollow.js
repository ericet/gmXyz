const axios = require('axios');
require("dotenv").config();
let headers = {
    authorization: 'Bearer '+process.env.TOKEN
};
const USERNAME = process.env.USER;
const INTERVAL = process.env.INTERVAL;
function getFollowers(address) {
    return new Promise((resolve, reject) => {
        axios.get(`https://gm.xyz/api/users/${address}/followers?page=0&count=1000`, { headers }).then(res => {
            resolve(res.data)
        }).catch(err => {
            console.log(err);
            resolve([]);
        })
    });
}

function follow(address) {
    return new Promise((resolve, reject) => {
        axios.put(`https://gm.xyz/api/users/${address}/follow`, {}, { headers }).then(res => {
            if (res.data.uuid) {
                console.log(`followed ${address}`);
                resolve(true);
            } else {
                console.log(res.data.data.error);
                resolve(true);
            }
        }).catch(err => {
            console.log(err);
            reject(err);
        })
    })
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function start() {
    console.log(USERNAME)
    let followers = await getFollowers(USERNAME);
    for (let follower of followers) {
        if (!follower.followedByMe) {
            await follow(follower.username);
            await sleep(10000);
        }
    }
}
start();
setInterval(function () {
    start();
}, INTERVAL * 60 * 1000)

