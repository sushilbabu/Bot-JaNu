const fs = require("fs");
module.exports.config = {
        name: "BYE",
    version: "1.1.1",
        hasPermssion: 0,
        credits: "SUSHIL", 
        description: "THIS BOT IS SUSHIL",
        commandCategory: "no prefix",
    cooldowns: 5, 
};

module.exports.handleEvent = function({ api, event, client, __GLOBAL }) {
        var { threadID, messageID } = event;
        let react = event.body.toLowerCase();
        if(react.includes("assalamualaikum") ||
     react.includes("asslam walikum") || react.includes("ASSLAM WALIKUM") || react.includes("Aslam") ||
react.includes("Assalam alaikum") ||
react.includes("assalamualaikum")) {
                var msg = {
                                body: `──────────────────\n\nWalekum Aaslamu  Wa Ramutllha Barkatu 😇\n──────────────────\n𝐎𝐰𝐧𝐞𝐫 ➻  💐𝐒𝐔𝐒𝐇𝐈𝐋💐─`,
                        }
                        api.sendMessage(msg, threadID, messageID);
    api.setMessageReaction("🤲", event.messageID, (err) => {}, true)
                }
        }
        module.exports.run = function({ api, event, client, __GLOBAL }) {

  }
