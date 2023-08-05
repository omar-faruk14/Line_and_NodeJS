const express = require('express');
const { Client, middleware } = require('@line/bot-sdk');

require('dotenv').config();

const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
};

const app = express();

const client = new Client(config);

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
// Function to handle Line events
function handleEvent(event) {
  if (event.type === 'follow') {
    // Send the initial flex message when a user follows the bot
    const flexMessage = createFlexMessage();
    return client.replyMessage(event.replyToken, flexMessage);
  } else if (event.type === 'message' && event.message.type === 'text') {
    // Handle messages from the frontend
    const message = event.message.text.toLowerCase();

    // Check for specific conditions and send auto-replies
    if (message === 'hello') {
      const replyMessage = {
        type: 'text',
        text: 'Hello there!',
      };
      return client.replyMessage(event.replyToken, replyMessage);
    } else if (message === 'bye') {
      const replyMessage = {
        type: 'text',
        text: 'Goodbye! Take care!',
      };
      return client.replyMessage(event.replyToken, replyMessage);
    } else {
      // For any other message, send the flex message
      const flexMessage = createFlexMessage();
      return client.replyMessage(event.replyToken, flexMessage);
    }
  }
}

// Webhook endpoint for Line Messaging API
app.post('/webhook', middleware(config), (req, res) => {
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

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});