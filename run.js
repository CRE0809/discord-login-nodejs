const express = require('express');
const request = require('request');

const app = express();

const CLIENT_ID = 'YOUR_CLIENT_ID_HERE';
const CLIENT_SECRET = 'YOUR_CLIENT_SECRET_HERE';
const RETURN_URL = 'https://YOUR.RETURN.URL.HERE';

app.get('/login', (req, res) => {
    res.redirect(`https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${RETURN_URL}&response_type=code&scope=identify guilds`);
});

app.get('/verify', (req, res) => {
    var options = {
        'method': 'POST',
        'url': 'https://discordapp.com/api/oauth2/token',
        'headers': {'Content-Type': 'application/x-www-form-urlencoded'},
        formData: {
            'client_id': CLIENT_ID,
            'client_secret': CLIENT_SECRET,
            'grant_type': 'authorization_code',
            'code': req.query.code,
            'redirect_uri': RETURN_URL
        }
    };
    request(options, function (error, response) {
        if (error) throw new Error(error);
        var getData = JSON.parse(response.body);
        var options = {
            'method': 'GET',
            'url': 'https://discordapp.com/api/users/@me',
            'headers': {
                'Authorization': 'Bearer '+getData.access_token,
          }
        };
        request(options, function (error, response) {
            if (error) throw new Error(error);
            console.log(response.body);
            res.send(response.body);
        });
    });
});

app.listen(3000, () => {
  console.info('Running on port 3000');
});
