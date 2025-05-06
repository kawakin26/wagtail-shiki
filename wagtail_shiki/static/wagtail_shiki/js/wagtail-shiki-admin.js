
class CodeBlockDefinition extends window.wagtailStreamField.blocks
  .StructBlockDefinition {
  render(placeholder, prefix, initialState, initialError) {
    const block = super.render(
      placeholder,
      prefix,
      initialState,
      initialError,
    );

    let languageFieldElement = document.getElementById(prefix + '-language');
    let codeTextFieldElement = document.getElementById(prefix + '-code');
    let showLineNumbersFieldElement = document.getElementById(prefix + '-show_line_numbers');
    let startNumberFieldElement = document.getElementById(prefix + '-start_number');
    let titleFieldElement = document.getElementById(prefix + '-title');
    let highlightWordsFieldElement = document.getElementById(prefix + '-highlight_words');
    let highlightWordsBlockElement = highlightWordsFieldElement.closest('div.field');
    highlightWordsBlockElement.hidden = shikiSet.hideHighlightWordsInput;

    let shikiWrapperElement = document.createElement('div');
    shikiWrapperElement.classList.add('shiki-wrapper');
    shikiWrapperElement.id = prefix + '-shiki-wrapper';
    highlightWordsBlockElement.parentElement.insertBefore(shikiWrapperElement, highlightWordsBlockElement.nextElementSibling);

    shikiWrapperElement.addEventListener('contextmenu', (e) => {
      let selection = document.getSelection();
      let anchorNode = selection.anchorNode;
      let focusNode = selection.focusNode;

      if (selection.type == 'Range' && shikiWrapperElement.contains(anchorNode) && shikiWrapperElement.contains(focusNode)) {
        e.preventDefault();
        if (window.decorationSelectDialog) {
          window.selection_start = selection.anchorOffset + getPreviousTextCount(anchorNode);
          window.selection_end = selection.focusOffset + getPreviousTextCount(focusNode);
          window.selection_anchorNode = anchorNode;
          window.decorationSelectDialog.showModal();
        } else {
          alert('Dialog not found');
        }
      }
    });

    if (languageFieldElement.value == 'django') {
      languageFieldElement.value = 'jinja';
    }


    function updatePreviewBlock() {
      let code = encodeURIComponent(codeTextFieldElement.value);
      let lang = languageFieldElement.value;
      let title = titleFieldElement.value;
      let showLineNumbers = showLineNumbersFieldElement.checked;
      let startNumber = startNumberFieldElement.value || 1;
      let highlightWordsStr = highlightWordsFieldElement.value;
      import('./wagtail-shiki.js').then(async (mod) => {
        await mod.renderPreviewBlock(title, code, lang, shikiSet.theme, shikiSet.darkTheme, shikiWrapperElement, showLineNumbers, startNumber, highlightWordsStr);
      });
    }

    updatePreviewBlock();

    // Events for field change.
    async function updatCodeText() {
      updatePreviewBlock();
    }
    async function updateLanguage() {
      updatePreviewBlock();
    }
    async function updateTitle() {
      updatePreviewBlock();
    }
    async function updateShowLineNumbers() {
      updatePreviewBlock();
    }
    async function updateStartNumber() {
      updatePreviewBlock();
    }
    async function updateHighlightWords() {
      updatePreviewBlock();
    }
    languageFieldElement.addEventListener('change', updateLanguage);
    codeTextFieldElement.addEventListener('keyup', updatCodeText);
    showLineNumbersFieldElement.addEventListener('change', updateShowLineNumbers);
    startNumberFieldElement.addEventListener('change', updateStartNumber);
    highlightWordsFieldElement.addEventListener('change', updateHighlightWords);
    titleFieldElement.addEventListener('change', updateTitle);
    return block;
  }
}
window.telepath.register('wagtail_shiki.blocks.CodeBlock', CodeBlockDefinition);

/**
 * Add or delete highlighted syntax definition data according to the selection in the select box.
 * 
 * If an empty string is provided as the classname, any decoration on that range will be removed.
 * 
 * @param {integer} start start point of decoration
 * @param {integer} end end point of decoration
 * @param {string} className class name for decoration
 * @param {Node} target any node in target code block
 */
async function addHighlightWord(start, end, className, target) {
  let codeBlockRootElement = getCodeBlockRootElement(target);
  let languageFieldElement = getLanguageFieldElement(codeBlockRootElement);
  let lang = languageFieldElement.value;      // language apply to
  let showLineNumberFieldElement = getShowLineNumbersFieldElement(codeBlockRootElement);
  let show_line_numbers = showLineNumberFieldElement.checked;   // never show line number if turu
  let startNumberFieldElement = getStartNumberFieldElement(codeBlockRootElement);
  let startNumber = startNumberFieldElement.value || 1;   // starting line number
  let titleFieldElement = getTitleFieldElement(codeBlockRootElement);
  let title = titleFieldElement.value;   // title, etc.
  let codeFieldElement = getCodeFieldElement(codeBlockRootElement);
  let code = codeFieldElement.value;          // source code (plain text)
  let highlightWordsFieldElement = getHighlightWordsFieldElement(codeBlockRootElement);
  let highlightWordsStr = highlightWordsFieldElement.value;   // syntax highlighting definition data string (uneditable)
  let shikiWrapperElement = await getShikiWrapperElement(codeBlockRootElement);   // container element for shiki highlighted <pre> 

  import('./wagtail-shiki.js').then(async (mod) => {
    let highlightWords = await mod.restructHighlightWord(code, start, end, className, highlightWordsStr);
    highlightWordsStr = JSON.stringify(highlightWords).replace("[", "").replace("]", "");
    highlightWordsFieldElement.value = highlightWordsStr;
    code = encodeURIComponent(code);
    await mod.renderPreviewBlock(title, code, lang, shikiSet.theme, shikiSet.darkTheme, shikiWrapperElement, show_line_numbers, startNumber, highlightWords);
  });
}

/**
 * Get the length of the text content of the previous sibling element.
 * 
 * @param {HTMLElement} baseElement 
 * @returns 
 */
function getPreviousTextCount(baseElement) {
  let crlf = 0;
  let previousSibling = baseElement.previousElementSibling;
  if (previousSibling) {
    if (previousSibling.classList.contains("line")) {
      crlf = 1;
    }
    return previousSibling.textContent.length + getPreviousTextCount(previousSibling) + crlf;
  } else {
    let parent = baseElement.parentElement;
    if (parent && parent.tagName == "SPAN") {
      return getPreviousTextCount(parent) + crlf;
    }
  }
  return 0;
}

/**
 * Create a dialog element for decoration selection.
 * 
 * @returns 
 */
function createDecorationSelectDialog() {
  if (!document.getElementById('highlight_words_dialog')) {
    var highlight_words_dialog = document.createElement('dialog');
    highlight_words_dialog.id = 'highlight_words_dialog';
    document.body.appendChild(highlight_words_dialog);

    let innerDiv = document.createElement('div');
    innerDiv.id = 'highlight_words_inner';
    innerDiv.className = 'inner';
    highlight_words_dialog.appendChild(innerDiv);

    let headerDiv = document.createElement('div');
    headerDiv.id = 'highlight_words_header';
    headerDiv.className = 'header';
    headerDiv.innerText = 'Select decoration style';
    innerDiv.appendChild(headerDiv);

    let form = document.createElement('form');
    form.id = 'highlight_words_form';
    form.setAttribute('method', 'dialog');
    innerDiv.appendChild(form);

    let bodyDiv = document.createElement('div');
    bodyDiv.id = 'highlight_words_body';
    bodyDiv.className = 'body';
    form.appendChild(bodyDiv);

    let selectBox = document.createElement('select');
    selectBox.id = 'highlight_words_style';
    bodyDiv.appendChild(selectBox);

    let footerDiv = document.createElement('div');
    footerDiv.id = 'highlight_words_footer';
    footerDiv.className = 'footer';
    form.appendChild(footerDiv);

    let cancelButton = document.createElement('button');
    cancelButton.type = 'submit';
    cancelButton.textContent = 'Cancel';
    cancelButton.value = 'Cancel';
    cancelButton.id = 'highlight_words_cancel';
    cancelButton.classList.add('button', 'cancel');
    footerDiv.appendChild(cancelButton);

    let okButton = document.createElement('button');
    okButton.type = 'submit';
    okButton.textContent = 'OK';
    okButton.value = 'OK';
    okButton.id = 'highlight_words_ok';
    okButton.classList.add('button', 'ok');
    footerDiv.appendChild(okButton);

    let options = shikiSet.decorationOptions;
    options.forEach((option) => {
      let optionElement = document.createElement('option');
      optionElement.value = option.value;
      optionElement.text = option.text;
      selectBox.appendChild(optionElement);
    });

    highlight_words_dialog.addEventListener("close", (e) => {
      if (highlight_words_dialog.returnValue == "OK") {
        let start = window.selection_start;
        let end = window.selection_end;
        let target = window.selection_anchorNode;
        if (start != end) {
          let style = document.getElementById('highlight_words_style').value;
          addHighlightWord(start, end, style, target);
        }
      }
    });
    return highlight_words_dialog;
  }
}

/**
 * Get the root element of the code block.
 * 
 * @param {Node} anyChildNode 
 * @returns 
 */
function getCodeBlockRootElement(anyChildNode) {
  if (anyChildNode.nodeType !== Node.ELEMENT_NODE && anyChildNode != null) {
    anyChildNode = anyChildNode.parentElement;
  }

  if (anyChildNode) {
    return anyChildNode.closest('.code-block');
  } else {
    return null;
  }
}

/**
 * 
 * @param {*} codeBlockRootElement 
 * @returns 
 */
function getCodeFieldElement(codeBlockRootElement) {
  return codeBlockRootElement.querySelector('textarea[id$="-code"]');
}

/**
 * 
 * @param {*} codeBlockRootElement 
 * @returns 
 */
function getHighlightWordsFieldElement(codeBlockRootElement) {
  return codeBlockRootElement.querySelector('textarea[id$="-highlight_words"]');
}

/**
 * 
 * @param {*} codeBlockRootElement 
 * @returns 
 */
function getLanguageFieldElement(codeBlockRootElement) {
  return codeBlockRootElement.querySelector('select[id$="-language"]');
}

/**
 * 
 * @param {*} codeBlockRootElement 
 * @returns 
 */
function getShowLineNumbersFieldElement(codeBlockRootElement) {
  return codeBlockRootElement.querySelector('input[id$="-show_line_numbers"]');
}

/**
 * 
 * @param {*} codeBlockRootElement 
 * @returns 
 */
function getStartNumberFieldElement(codeBlockRootElement) {
  return codeBlockRootElement.querySelector('input[id$="-start_number"]');
}

/**
 * 
 * @param {*} codeBlockRootElement 
 * @returns 
 */
function getTitleFieldElement(codeBlockRootElement) {
  return codeBlockRootElement.querySelector('input[id$="-title"]');
}

/**
 * 
 * @param {*} codeBlockRootElement 
 * @returns 
 */
function getShikiWrapperElement(codeBlockRootElement) {
  return codeBlockRootElement.getElementsByClassName("shiki-wrapper")[0];
}