const express = require('express');
const { Client } = require('@line/bot-sdk');

require('dotenv').config();

const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
};

const app = express();
app.use(express.json());

const client = new Client(config);

// Function to create the flex message
// Function to create the flex message
function createFlexMessage() {
    return {
      type: 'flex',
      altText: 'Emi_Lab',
      contents: {
        "type": "bubble",
        "hero": {
          "type": "image",
          "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/01_1_cafe.png",
          "size": "full",
          "aspectRatio": "20:13",
          "aspectMode": "cover",
          "action": {
            "type": "uri",
            "uri": "http://linecorp.com/"
          }
        },
        "body": {
          "type": "box",
          "layout": "vertical",
          "contents": [
            {
              "type": "text",
              "text": "Emi_Lab",
              "weight": "bold",
              "size": "xl"
            },
            {
              "type": "box",
              "layout": "baseline",
              "margin": "md",
              "contents": [
                {
                  "type": "icon",
                  "size": "sm",
                  "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png"
                },
                {
                  "type": "icon",
                  "size": "sm",
                  "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png"
                },
                {
                  "type": "icon",
                  "size": "sm",
                  "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png"
                },
                {
                  "type": "icon",
                  "size": "sm",
                  "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png"
                },
                {
                  "type": "icon",
                  "size": "sm",
                  "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gray_star_28.png"
                },
                {
                  "type": "text",
                  "text": "4.0",
                  "size": "sm",
                  "color": "#999999",
                  "margin": "md",
                  "flex": 0
                }
              ]
            },
            {
              "type": "box",
              "layout": "vertical",
              "margin": "lg",
              "spacing": "sm",
              "contents": [
                {
                  "type": "box",
                  "layout": "baseline",
                  "spacing": "sm",
                  "contents": [
                    {
                      "type": "text",
                      "text": "Place",
                      "color": "#aaaaaa",
                      "size": "sm",
                      "flex": 1
                    },
                    {
                      "type": "text",
                      "text": "Nagano-ken, Suwa-gun, Fujimi-cho, Fujimi 3785-3",
                      "wrap": true,
                      "color": "#666666",
                      "size": "sm",
                      "flex": 5
                    }
                  ]
                },
                {
                  "type": "box",
                  "layout": "baseline",
                  "spacing": "sm",
                  "contents": [
                    {
                      "type": "text",
                      "text": "Time",
                      "color": "#aaaaaa",
                      "size": "sm",
                      "flex": 1
                    },
                    {
                      "type": "text",
                      "text": "10:00 - 23:00",
                      "wrap": true,
                      "color": "#666666",
                      "size": "sm",
                      "flex": 5
                    }
                  ]
                }
              ]
            }
          ]
        },
        "footer": {
          "type": "box",
          "layout": "vertical",
          "spacing": "sm",
          "contents": [
            {
              "type": "button",
              "style": "link",
              "height": "sm",
              "action": {
                "type": "uri",
                "label": "CALL",
                "uri": "https://linecorp.com"
              }
            },
            {
              "type": "button",
              "style": "link",
              "height": "sm",
              "action": {
                "type": "uri",
                "label": "WEBSITE",
                "uri": "https://emi-lab.jp/"
              }
            }
          ],
          "flex": 0
        }
      }
    };
  }
  

// Function to handle Line events
function handleEvent(event) {
  if (event.type === 'follow') {
    // Send the flex message when a user follows the bot
    const flexMessage = createFlexMessage();
    return client.replyMessage(event.replyToken, flexMessage);
  } else if (event.type === 'message' && event.message.type === 'text') {
    // Handle messages from the frontend
    const message = event.message.text;
    if (message === 'Option 1') {
      // Implement logic for Option 1 here (if needed)
    } else if (message === 'Option 2') {
      // Implement logic for Option 2 here (if needed)
    } else if (message === 'Option 3') {
      // Implement logic for Option 3 here (if needed)
    } else {
      // Handle other messages here if needed
      const unknownMessage = {
        type: 'text',
        text: 'Sorry, I don\'t understand that command.',
      };
      return client.replyMessage(event.replyToken, unknownMessage);
    }
  }
}

// Webhook endpoint for Line Messaging API
app.post('/webhook', lineMiddleware, (req, res) => {
  Promise.all(req.body.events.map(handleEvent))
    .then((result) => {
      console.log('Handled events successfully:', result);
      res.json(result);
    })
    .catch((err) => {
      console.error('Error handling events:', err);
      res.status(500).end();
    });
});

const { validateSignature } = require('@line/bot-sdk');

// Middleware to validate the request signature
function lineMiddleware(req, res, next) {
  const signature = req.headers['x-line-signature'];
  if (validateSignature(JSON.stringify(req.body), config.channelSecret, signature)) {
    next();
  } else {
    res.status(400).send('Invalid signature');
  }
}

// Route to render the frontend page with options
app.get('/', (req, res) => {
  res.render('index');
});

// Route to handle button clicks and send data to your bot backend
app.post('/sendMessage', express.json(), (req, res) => {
  // Extract the option from the request body
  const { option } = req.body;

  // Here, you can send the 'option' to your bot backend and handle the logic
  // For demonstration purposes, we'll just log the option on the server-side
  console.log('Selected Option:', option);

  // Respond with a success message (optional)
  res.json({ message: 'Option received successfully!' });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});



