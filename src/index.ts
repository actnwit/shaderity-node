import { PreProcessor } from "./PreProcessor";

var isNode=new Function("try {return this===global;}catch(e){return false;}");

if(isNode()) {
  var path = require('path');
  var fs = require('fs');
}

function isVertexShader(path: string) {
  if (includeWordsInFileExtension(path, ['vs', 'vert'])) {
    return true;
  } else {
    return false;
  }
}

function includeWordsInFileExtension(path: string, words: string[]) {
  const splitted = path.split('.');
  if (splitted.length >= 2) {
    for (let i = 0; i < words.length; i++) {
      if (splitted[splitted.length - 1].includes(words[i])) {
        return true;
      }
      if (splitted.length >= 3) {
        if (splitted[splitted.length - 2].includes(words[i])) {
          return true;
        }
      }
    }
  }
  return false;
}

/**
 * Determine which shader stage is used, vertex or fragment, from the file extension.
 * If the extension is 'vs' or 'vert', this method returns 'vertex', otherwise returns 'fragment'.
 */
export function shaderStage(resourcePath: string) {
  if (isVertexShader(resourcePath)) {
    return 'vertex';
  } else {
    return 'fragment';
  }
}

/**
 * Expand the shader code.
 *
 * If there is a description "#pragma shaderity: require(path)",
 * substitute the contents of the file in (argument resourcePath)/(path) into it.
 */
export function requireFile(source: string, resourcePath: string) {
  const basePath = path.dirname(resourcePath) + '/';
  const arr = source.split(/\r\n|\n/);

  const newArr = [];
  for (let i = 0; i < arr.length; i++){
    const row = arr[i];
    const match = row.match(/^(?![\/])[\t ]*#pragma[\t ]+shaderity:[\t ]*(\S*)[\t ]*=?[\t ]*require\([\t ]*(\S+)[\t ]*\)/);
    if (match != null) {
      const filePath = path.resolve(basePath + match[2]);
      let extShader = fs.readFileSync(filePath, {encoding: 'utf-8'});
      newArr.push(extShader);
    } else {
      newArr.push(row);
    }
  }

  const processedShaderTextArr = PreProcessor.process(newArr);

  const requredShaderText = processedShaderTextArr.join('\n');

  return requredShaderText;
}
