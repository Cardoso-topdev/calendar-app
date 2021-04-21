import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import { eventsById, examsReducer } from './reducers/examReducer'
import { usersLoginReducer } from './reducers/usersReducer'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
import { tasktypesReducer } from './reducers/tasktypesReducer'
import { tasksReducer } from './reducers/tasksReducer'
import { scheduleReducer } from './reducers/scheduleReducer'
import { userSettingReducer } from './reducers/userSettingReducer'
import { messageReducer } from './reducers/messageReducer'

const persistConfig = {
  key: 'root',
  storage,
} 

const rootReducer = combineReducers({
  // eventsById: eventsById,
  exams: examsReducer,
  userLogin: usersLoginReducer,
  taskTypes: tasktypesReducer,
  tasks: tasksReducer,
  schedule: scheduleReducer,
  userSetting: userSettingReducer,
  message: messageReducer
})

const persistedReducer = persistReducer(persistConfig, rootReducer)


const middleware = [thunk];

let store = createStore(persistedReducer, composeWithDevTools(applyMiddleware(...middleware)));
let persistor = persistStore(store)

export default () => {
  return {store, persistor}
};
