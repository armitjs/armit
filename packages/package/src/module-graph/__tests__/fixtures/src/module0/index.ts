import { moduleNoStyle } from '../module-no-style';
import { sharedModule } from '../shared';
import './module0.less';

export const module0 = () => {
  sharedModule();
  moduleNoStyle();
  console.log('module0');
};
