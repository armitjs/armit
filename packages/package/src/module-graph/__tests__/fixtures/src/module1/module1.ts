import { moduleNoStyle } from '../module-no-style';
import { module0 } from '../module0';
import { sharedModule } from '../shared';
import { module1Folder } from './folder/folder';
import { module1Folder2 } from './folder2';
import './module1.less';
export const module1 = () => {
  module0();
  sharedModule();
  module1Folder();
  module1Folder2();
  moduleNoStyle();
  console.log('module1....');
};
