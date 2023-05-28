import { moduleNoStyle } from '../module-no-style';
import { module0 } from '../module0';
import { module1 } from '../module1/module1';
import { sharedModule } from '../shared';
import './module2.less';

export const module2 = () => {
  module0();
  module1();
  moduleNoStyle();
  sharedModule();
  console.log('module2....');
};
