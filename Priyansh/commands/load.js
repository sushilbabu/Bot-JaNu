module.exports.config = {
	name: "reload",
	version: "1.0.0",
	hasPermssion: 2,
	credits: "𝐏𝐫𝐢𝐲𝐚𝐧𝐬𝐡 𝐑𝐚𝐣𝐩𝐮𝐭",
	description: "reload config file data",
	commandCategory: "Admin",
	usages: "[]",
	cooldowns: 30
};
module.exports.run = async function({ api, event, args,Threads, Users }) {
delete require.cache[require.resolve(global.client.configPath)];
global.config = require(global.client.configPath);
return api.sendMessage("[OK] BOSS SUSHIL RELOAD HORE HE JUST WAIT 😚...", event.threadID, event.messageID);    
} 