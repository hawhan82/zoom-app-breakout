import {
  connect,
  getMeetingParticipants,
  assignParticipantsToBreakoutRooms
} from "https://cdn.jsdelivr.net/npm/@zoom/appssdk/+esm";

connect().then(() => {
  console.log("Zoom App connected.");
  const btn = document.getElementById("assign");
  if (btn) {
    btn.addEventListener("click", assignHH8Only);
  }
});

async function assignHH8Only() {
  const log = document.getElementById("log");

  try {
    const { participants } = await getMeetingParticipants();

    // Filter only new participants with [HH8] in their display name
    const hh8Participants = participants.filter(p => {
      return p.displayName?.includes("[HH8]");
    });

    if (hh8Participants.length === 0) {
      log.textContent = "No [HH8] participants found.";
      return;
    }

    // Extract userIds
    const userIds = hh8Participants.map(p => p.userId);

    // Assign them to breakout room "HH8 禅修班"
    const breakoutRoomPayload = {
      rooms: [
        {
          name: "HH8 禅修班",
          participants: userIds
        }
      ]
    };

    await assignParticipantsToBreakoutRooms(breakoutRoomPayload);

    log.textContent = `✅ Assigned ${userIds.length} participants to 'HH8 禅修班'`;
  } catch (err) {
    console.error("Error:", err);
    log.textContent = `❌ Error: ${err.message}`;
  }
}
