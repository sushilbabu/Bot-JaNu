const fs = require("fs");
module.exports.config = {
  name: "SHAAN",
    version: "2.1.1",
  hasPermssion: 0,
  credits: "𝐒𝐇𝐀𝐀𝐍 𝐊𝐇𝐀𝐍", 
  description: "Just Respond",
  commandCategory: "no prefix",
    cooldowns: 5, 
};

module.exports.handleEvent = async ({ api, event, Users, Currencies, args, utils, client, global }) => {
  var name = await Users.getNameUser(event.senderID);
  var { threadID, messageID } = event;
  let react = event.body.toLowerCase();
  if(react.includes("shan khan") ||
     react.includes("Sushil Yadav") || react.includes("SUSHIL") || react.includes("sushil") ||
react.includes("sushilkumaryadav") ||
react.includes("SUSHIL KUMAR YADAV") ||     
react.includes("@sushilkumaryadav")) {
    var msg = {
        body: `${name} 𝑻𝑼𝑴 𝑵𝑬 𝑩𝑯𝑼𝑳𝑨𝒀𝑨 𝑶𝑼𝑹 𝑯𝑼𝑴 𝑪𝑯𝑨𝑳𝑬 𝑨𝑨𝒀𝑬💞✿`,attachment: fs.createReadStream(__dirname + `/noprefix//received_1236460420763390.jpeg`)
      }
      api.sendMessage(msg, threadID, messageID);
    api.setMessageReaction("💋", event.messageID, (err) => {}, true)
    }
  }
  module.exports.run = async ({ api, event, Currencies, args, utils, client, global }) => {

  }
