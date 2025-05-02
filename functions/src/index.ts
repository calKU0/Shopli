import {onSchedule} from "firebase-functions/v2/scheduler";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";

admin.initializeApp();

export const notifyUpcomingShopping = onSchedule(
  {
    schedule: "every day 09:00",
    timeZone: "Europe/Warsaw",
  },
  async () => {
    const db = admin.firestore();
    const now = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(now.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split("T")[0];
    const snapshot = await db.collection("shoppingLists")
      .where("plannedDate", "==", tomorrowStr)
      .get();


    const messages = snapshot.docs.map(async (docSnap) => {
      const list = docSnap.data();
      const userId = list.userId;

      const userDoc = await db.collection("users").doc(userId).get();
      const fcmToken = userDoc.data()?.fcmToken;

      if (fcmToken) {
        await admin.messaging().send({
          token: fcmToken,
          notification: {
            title: "🛒 Reminder: Shopping Planned Tomorrow",
            body: `Your shopping list "${list.name}" 
            is scheduled for tomorrow.`,
          },
        });
      }
    });

    await Promise.all(messages);
    logger.info("Notifications sent");
  }
);
