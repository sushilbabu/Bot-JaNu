const ws3 = require("ws3-fca");
const login = typeof ws3 === "function" ? ws3 : (ws3.default || ws3.login || ws3);
const fs = require("fs");
const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;
app.get("/", (req, res) => res.send("✅ Facebook Bot is active and running..."));
app.listen(PORT, () => console.log(`🌐 HTTP server live on port ${PORT}`));

const BOSS_UID = "610265515";
const OWNER_NAME = "Sushil Yadav 👑";
const appState = JSON.parse(fs.readFileSync("appstate.json", "utf-8"));

let GROUP_THREAD_ID = null;
let LOCKED_GROUP_NAME = null;
let nickLockEnabled = false;
let originalNicknames = {};
let currentLockNick = null;

const loginOptions = {
  appState,
  userAgent:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 FBAV/350.0.0.8.103",
};

// 🔁 Delay helper
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// 🔐 Human-style Nick Change
async function humanStyleNickChange(api, threadID, newNick, threadInfo) {
  const botID = api.getCurrentUserID();

  for (const user of threadInfo.userInfo) {
    const userID = user.id;
    if (userID === botID) continue;

    const randomDelay = Math.floor(Math.random() * 4000) + 3000; // 3s - 7s
    await delay(randomDelay);

    try {
      await api.changeNickname(newNick, threadID, userID);
      originalNicknames[userID] = newNick;
      console.log(`✅ Changed: ${user.name} (${userID})`);
    } catch (err) {
      console.warn(`❌ Failed: ${user.name} (${userID}) → ${err.message}`);
    }
  }

  api.sendMessage(`🔐 Nickname locked as "${newNick}" for all members.\n👑 Locked by ${OWNER_NAME}`, threadID);
}

try {
  login(loginOptions, (err, api) => {
    if (err) {
      console.error("❌ Login failed:", err?.error || err);
      return;
    }

    api.setOptions({ listenEvents: true });
    console.log("🤖 Bot is online...");

    api.listenMqtt(async (err, event) => {
      if (err) return console.error("❌ Listen error:", err);

      const senderID = event.senderID;
      const threadID = event.threadID;
      const body = (event.body || "").toLowerCase();

      if (event.logMessageType === "log:thread-admins" && event.logMessageData?.TARGET_ID === api.getCurrentUserID()) {
        api.sendMessage("👑 Thank you janeman 💖 ab admin ban gaya hu!", threadID);
      }

      if (event.type === "message" && body.startsWith("/gclock")) {
        if (senderID !== BOSS_UID)
          return api.sendMessage(`⛔ Sirf ${OWNER_NAME} command chala sakte hain.`, threadID);

        try {
          const args = event.body.split(" ").slice(1).join(" ").trim();
          GROUP_THREAD_ID = threadID;

          if (args.length > 0) {
            LOCKED_GROUP_NAME = args;
            await api.setTitle(LOCKED_GROUP_NAME, threadID);
          } else {
            const info = await api.getThreadInfo(threadID);
            LOCKED_GROUP_NAME = info.name;
          }

          api.sendMessage(
            `🔒 Group name locked as: "${LOCKED_GROUP_NAME}"\n👑 Locked by ${OWNER_NAME}`,
            threadID
          );
        } catch (e) {
          api.sendMessage("❌ Failed to lock group name.", threadID);
        }
      }

      if (event.logMessageType === "log:thread-name" && event.threadID === GROUP_THREAD_ID) {
        const changedName = event.logMessageData.name;
        if (LOCKED_GROUP_NAME && changedName !== LOCKED_GROUP_NAME) {
          try {
            await api.setTitle(LOCKED_GROUP_NAME, GROUP_THREAD_ID);
            api.sendMessage(
              `⚠️ Group name changed to "${changedName}". Reverting to "${LOCKED_GROUP_NAME}" ✅\n👑 Locked by ${OWNER_NAME}`,
              GROUP_THREAD_ID
            );
          } catch (e) {
            api.sendMessage(`❌ Couldn't revert group name. Bot may not be admin.`, GROUP_THREAD_ID);
          }
        }
      }

      if (event.type === "message" && body.startsWith("/nicklock ")) {
        if (senderID !== BOSS_UID)
          return api.sendMessage(`⛔ Sirf ${OWNER_NAME} command chala sakte hain.`, threadID);
        try {
          const lockNick = event.body.split(" ").slice(1).join(" ").trim();
          if (!lockNick)
            return api.sendMessage("❌ Nickname missing! Use: /nicklock YourNickName", threadID);

          const threadInfo = await api.getThreadInfo(threadID);
          originalNicknames = {};
          nickLockEnabled = true;
          currentLockNick = lockNick;

          api.sendMessage(`🔧 Applying nickname lock manually... Please wait...`, threadID);

          await humanStyleNickChange(api, threadID, lockNick, threadInfo);

        } catch (err) {
          api.sendMessage("❌ Failed to apply nickname lock.", threadID);
        }
      }

      if (event.type === "message" && body === "/nicklock off") {
        if (senderID !== BOSS_UID)
          return api.sendMessage(`⛔ Sirf ${OWNER_NAME} command chala sakte hain.`, threadID);
        nickLockEnabled = 