import { create } from 'zustand'
import { sendRequest } from '../utils/invoke'

interface AppStoreState {
  init: boolean
  connections: any[]
}

const appStore = create<AppStoreState>(() => ({
  init: false,
  connections: [],
}))

export const queryConnections = async () => {
  return sendRequest({
    url: '/api/connections',
    method: 'GET',
  }).then((res) => {
    changeConnections(res)
  })
}

export const changeConnections = (
  connections: AppStoreState['connections']
) => {
  appStore.setState({ connections })
}

export { appStore as useAppStore }
