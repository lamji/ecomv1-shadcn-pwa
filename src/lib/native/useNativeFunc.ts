import { setExternalUserId, getPlayerId, removeExternalUserId } from 'webtonative/OneSignal';

export default function useNativeFunc() {
  return{
    setExternalUserId,
    getPlayerId,
    removeExternalUserId
  }
}
