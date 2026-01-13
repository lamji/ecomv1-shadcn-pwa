import { setExternalUserId, getPlayerId } from 'webtonative/OneSignal';

export default function useNativeFunc() {
  return{
    setExternalUserId,
    getPlayerId
  }
}
