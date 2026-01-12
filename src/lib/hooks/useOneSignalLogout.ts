export function oneSignalLogout() {
  if (typeof window === "undefined") return;

  window.OneSignalDeferred = window.OneSignalDeferred || [];

  window.OneSignalDeferred.push(async (OneSignal) => {
    await OneSignal.logout();
    console.log("[OneSignal] logged out");
  });
}
