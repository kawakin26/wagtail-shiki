/**
 * wagtail-shiki.js
 * 
 * This module provides functions for syntax highlighting and rendering code blocks.
 * 
 * @module syntax-highlight
 * 
 * @requires shiki
 * @requires wagtai-lshiki
 * 
 * @author kawakin
 * @license MIT
 * 
 * @version 1.0.0
 */
import { createHighlighter } from 'https://esm.run/shiki@3.0.0'

/**
 * 
 * Get the HTML format string from the syntax highlighting configuration data. (pre element is root)
 * 
 * @param {string} code source code (plain text)
 * @param {string} lang language apply to
 * @param {string} theme the theme to use
 * @param {string} darkTheme the dark theme to use
 * @param {Array} highlightWords an array of objects containing start and end positions and style for highlighting
 * @returns {Promise<string>} highlighted code text (HTML Formatting) 
 */
export async function highlightCode(code, lang, theme, darkTheme, highlightWords) {

  code = decodeURIComponent(code).replace(/\r\n/g, '\n');

  if (shikiSet.skipLeadingSpaces) {
    let len = code.length;
    let leader = true;
    let start = -1;
    let leadingSpaces = [];

    for (let i = 0; i < len; i++) {
      let chr = code[i];
      if (leader) {
        if (chr == '\n' || chr == '\r') {
          ;
        } else if (start < 0) {
          if (chr == ' ' || chr == '　' || chr == '\t') {
            start = i;
          } else {
            leader = false;
          }
        } else {
          if (!(chr == ' ' || chr == '　' || chr == '\t')) {
            leader = false;
            leadingSpaces.push({ start: start, end: i });
            start = -1;
          }
        }
      } else {
        if (chr == '\n' || chr == '\r') {
          leader = true;
          if (start < 0) {
            start = i;
          }
        }
      }

    }
    highlightWords = await removeDecoration(code, highlightWords, leadingSpaces);
  }

  if (!lang) {
    lang = 'ansi';
  } else if (lang == "django") {
    lang = 'jinja';
  }

  const highlighter = await createHighlighter({
    themes: [theme, darkTheme],
    langs: [lang],
  })

  let html_code = await highlighter.codeToHtml(code, {
    lang: lang,
    themes: {
      light: theme,
      dark: darkTheme
    },
    transformers: [
      {
        line(node, line) {
          node.properties['data-line'] = line;
        },
      },
    ],
    decorations: highlightWords,
  });
  highlighter.dispose();

  return html_code;
}

/**
 * Render a code block with syntax highlighting and optional features.(wrapper <div> element is required.)
 * 
 * Internally calls the highlightCode function.
 * 
 * @param {string} title title of the code block (file name, etc.)
 * @param {string} code source code (plain text)
 * @param {string} lang language apply to
 * @param {string} theme the theme to use
 * @param {string} darkTheme the dark theme to use
 * @param {HTMLElement} shikiWrapper the wrapper <div> elment for code block elements
 * @param {boolean} show_line_numbers whether to display line numbers
 * @param {integer} startNumber the starting line number
 * @param {array or string} highlightWordsArg syntax highlighting definition data (both array and string formats accepted)
 * @see highlightCode
 */
export async function renderPreviewBlock(title, code, lang, theme, darkTheme, shikiWrapper, show_line_numbers, startNumber, highlightWordsArg) {
  let highlightWords = [];
  if (typeof highlightWordsArg === 'string') {
    highlightWords = await highlightWordsStringToArray(highlightWordsArg);
  } else {
    highlightWords = highlightWordsArg;
  }

  if (!lang) {
    lang = 'ansi';
  } else if (lang == "django") {
    lang = 'jinja';
  }

  await highlightCode(code, lang, theme, darkTheme, highlightWords).then((htmlCode) => {
    let CodeToorbars = shikiWrapper.getElementsByClassName('code-toolbar');
    let preContainer;
    if (CodeToorbars.length > 0) {
      preContainer = CodeToorbars[0];
    } else {
      preContainer = shikiWrapper;
    }
    preContainer.innerHTML = htmlCode;
    let preElement = preContainer.children[0];
    preElement.classList.add(lang);
    if (title) {
      let titleElement = document.createElement('h3');
      titleElement.classList.add("code-title");
      titleElement.classList.add("mt-7");
      titleElement.textContent = title;
      shikiWrapper.insertBefore(titleElement, preElement);
    }

    if (show_line_numbers && shikiSet.enableLineNumbers) {
      preElement.classList.add('line-numbers');
      preElement.dataset['start'] = startNumber;
      preElement.style.counterReset = 'linenumber ' + (startNumber - 1);
    }
    if (shikiSet.enableCopyButton) {
      const btn = document.createElement('button'); // create copy button
      btn.setAttribute('type', 'button');
      btn.setAttribute('title', 'Copy');
      btn.classList.add('copy-button');
      let innerSvg = '<svg width="24px" height="24px" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path fill="white" d="M768 832a128 128 0 0 1-128 128H192A128 128 0 0 1 64 832V384a128 128 0 0 1 128-128v64a64 64 0 0 0-64 64v448a64 64 0 0 0 64 64h448a64 64 0 0 0 64-64h64z"/>'
        + '<path fill="white" d="M384 128a64 64 0 0 0-64 64v448a64 64 0 0 0 64 64h448a64 64 0 0 0 64-64V192a64 64 0 0 0-64-64H384zm0-64h448a128 128 0 0 1 128 128v448a128 128 0 0 1-128 128H384a128 128 0 0 1-128-128V192A128 128 0 0 1 384 64z"/></svg>';
      btn.innerHTML = innerSvg;
      shikiWrapper.insertBefore(btn, shikiWrapper.firstChild);
      const txt = preElement.textContent; // get etxt content
      btn.addEventListener('click', () => {
        navigator.clipboard.writeText(txt); // copy to clipboard     
        btn.innerHTML = 'copied!'; // change button caption
        setTimeout(() => (btn.innerHTML = innerSvg), 2000); // restore button caption
      });
    }

    /*
    If you apply the same decoration to an entire line with no leading whitespace, 
    then in the case of 'border' or 'background-color', the decoration will extend
    to the line number.
    In this case, Shiki add decoreation class to the span element that represents
    an entire line(it is including 'line' class).
    As a result, the decoration may extend all the way to the line number.
    To prevent this, add an intermediate span element and transfer the decoration
    class to it.
    This problem does not occur when using the original Shiki because of the 
    addition of the line number feature.
    */
    let regStr = 'span.line[class*="' + window.shikiSet.classPrefix + '-"]';
    let entireLineSpans = preElement.querySelectorAll(regStr);
    for (let span of entireLineSpans) {
      let reg = new RegExp(window.shikiSet.classPrefix + "-[\\w\\-]+", "g");
      let regResult = span.className.match(reg);
      if (regResult) {
        let decorationClasname = regResult[0];
        let middleSpan = document.createElement('span');
        middleSpan.classList.add(decorationClasname);
        span.classList.remove(decorationClasname);
        while (span.firstChild) {
          middleSpan.appendChild(span.firstChild);
        }
        span.appendChild(middleSpan);
      }
    }
  });
}

/**
 * A function that determines the order to sort of highlithing definition data. 
 * 
 * * A negative value indicates that 'a' should come before 'b'.
 * 
 * * A positive value indicates that 'a' should come after 'b'.
 * 
 * * Zero or NaN indicates that a and b are considered equal.
 * 
 * @param {Object} a 
 * @param {Object} b 
 * @returns 
 */
function compareFn(a, b) {
  if (a.start < b.start) {
    return -1;
  } else if (a.start > b.start) {
    return 1;
  }
  // a = b
  return 0;
}

/**
 * highlighting definition string convert to arry.
 * 
 * @param {string} str 
 * @returns 
 */
export async function highlightWordsStringToArray(str) {
  let highlightWords = [];
  if (str) {
    let regex = /(\{\"start\":\d+\,\"end\":\d+\,\"properties\":\{\"class\":\".*?\"\}\})/;
    let array = str.split(regex);
    for (let a of array) {
      if (regex.test(a)) {
        highlightWords.push(JSON.parse(a));
      }
    }
  }
  return highlightWords;
}

/**
 * Restructure the highlighting definition data. (add a new highlighting definition data or delete a indicated range)
 * If 'className' is null or "" then demove decorations in the range of start to end.
 * 
 * @param {string} textCode source code (plain text)
 * @param {integer} start start pointer for decoration
 * @param {integer} end end pointer for decoration
 * @param {string} className class name for decoration. (if "" is provided, the range will be deleted)
 * @param {array or string} highlightWordsArg syntax highlighting definition data (both array and string formats accepted)
 * @returns 
 */
export async function restructHighlightWord(textCode, start, end, className, highlightWordsArg) {

  let highlightWords = [];
  let newHighlightWords = [];
  if (typeof highlightWordsArg === 'string') {
    highlightWords = await highlightWordsStringToArray(highlightWordsArg);
  } else {
    highlightWords = highlightWordsArg;
  }

  if (start > end) {
    let temp = start;
    start = end;
    end = temp;
  }

  for (let existingSpan of highlightWords) {
    if (existingSpan.start > existingSpan.end) {
      let temp = existingSpan.start;
      existingSpan.start = existingSpan.end;
      existingSpan.end = temp;
    }

    if (existingSpan.start < start && existingSpan.end <= end) {
      // If the start and end of the new range are after the each correspond start and end of the target range.
      if (start < existingSpan.end) {
        // When there is some overlap.
        existingSpan.end = start;
      }
      newHighlightWords.push(existingSpan);

    } else if (existingSpan.start >= start && existingSpan.end <= end) {
      // If the new range completely obscures the target ranges.
      // Target ranges will be removed.
      // Nothing to add to new list as a updated target range.
      ;
    } else if (existingSpan.start < start && existingSpan.end > end) {
      // If the new range is completely contained within the target range.
      // The target range will be divided.
      let tempEnd = existingSpan.end;
      existingSpan.end = start;
      newHighlightWords.push(existingSpan);
      newHighlightWords.push({
        start: end,
        end: tempEnd,
        properties: { class: existingSpan.properties.class }
      });
    } else if (existingSpan.start >= start && existingSpan.end > end) {
      // If the start and end of the new range are before the each correspond start and end of the target range.
      if (end > existingSpan.start) {
        // When there is some overlap.
        existingSpan.start = end;
      }
      newHighlightWords.push(existingSpan);
    }
  }

  if (className) {
    newHighlightWords.push({
      start: start,
      end: end,
      properties: { class: className }
    });
  }

  if (shikiSet.previewMode && (shikiSet.removeDecorationsFrontSpaces || shikiSet.removeDecorationsRearSpaces)) {
    newHighlightWords = await removeEndsSpaces(textCode, newHighlightWords, shikiSet.removeDecorationsFrontSpaces, shikiSet.removeDecorationsRearSpaces);
  }
  newHighlightWords.sort(compareFn);

  return newHighlightWords;
}

/**
 * Remove fornt and end spaces from the specified range of highlightWords.
 * 
 * @param {string} textCode source code (plain text)
 * @param {array} highlightWords syntax highlighting definition array
 * @param {boolean} front if true, front end spaces will be removed
 * @param {boolean} rear if true, rear end spaces will be removed
 * @returns 
 */
async function removeEndsSpaces(textCode, highlightWords, front, rear) {
  let newHighlightWords = [];

  highlightWords.forEach((span) => {
    if (span.start < 0 || span.end > textCode.length || span.start >= span.end) {
      return highlightWords;
    }
    if (front) {
      for (let start = span.start; start < span.end; start++) {
        if (textCode[start] != ' ' && textCode[start] != '\r' && textCode[start] != '\n') {
          span.start = start;
          break;
        }
      }
    }
    if (rear) {
      for (let end = span.end - 1; end >= span.start; end--) {
        if (textCode[end] != ' ' && textCode[end] != '\r' && textCode[end] != '\n') {
          span.end = end + 1
          break;
        }
      }
    }
    if (span.start < span.end) {
      newHighlightWords.push(span);
    }
  })
  return newHighlightWords;
}

/**
 * Remove decoration(s) according to the specified ranges from highlightWords.
 * 
 * @param {*} textCode source code (plain text)
 * @param {Array} highlightWords syntax highlighting definition array
 * @param {Array}removeSpanArray ranges of array to Remove decoration(s)
 * @returns 
 */
async function removeDecoration(textCode, highlightWords, removeSpanArray) {
  for (let span of removeSpanArray) {
    highlightWords = await restructHighlightWord(textCode, span.start, span.end, "", highlightWords);
  }
  return highlightWords;
}

export function setCSSStyleSheets(decorationStyles) {
  let styleSheet = null;

  for (let i = 0; i < document.styleSheets.length; i++) {
    let sh = document.styleSheets[i];
    if (sh.title === 'WAGSDecorationsStyleRules') {
      styleSheet = sh;
      break;
    }
  }

  if (styleSheet) {
    for (let rule of decorationStyles) {
      let cls = rule.class;
      if (cls.replace(" ", "")) {
        let style = rule.style;
        styleSheet.insertRule(
          `pre.shiki > code span.${cls} {${style}}`,
          styleSheet.cssRules.length
        );
      }
    }
  }
}
