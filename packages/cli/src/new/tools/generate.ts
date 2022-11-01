import { generateTemplateFiles } from '@armit/generate-template-files';
import { items } from './items.js';

// Note: In your file it will be like this:
// const {generateTemplateFiles} = require('generate-template-files');

generateTemplateFiles(items);
