import { combineReducers } from '@reduxjs/toolkit';
import tagsViewReducer from './tags-view.store';
import globalReducer from './global.store';
import enterpriseReducer from './enterprise.store';
import userReducer from './user.store';
import contactReducer from './contact.store';
import businessAreaReducer from './businessArea.store';
import productReducer from './product.store';

const rootReducer = combineReducers({
  enterprise: enterpriseReducer,
  tagsView: tagsViewReducer,
  user: userReducer,
  global: globalReducer,
  contact: contactReducer,
  businessArea: businessAreaReducer,
  product: productReducer,
});

export default rootReducer;
