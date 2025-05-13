![PyPI - Version](https://img.shields.io/pypi/v/wagtail-shiki) ![GitHub License](https://img.shields.io/github/license/kawakin26/wagtail-shiki) [![Supported Python versions](https://img.shields.io/pypi/pyversions/wagtail-shiki.svg?style=flat-square)](https://pypi.org/project/wagtail-shiki) ![Static Badge](https://img.shields.io/badge/shiki-3.4.0-blue)

__Wagtail Shiki__ is based on [Wagtail Code Block](https://github.com/FlipperPA/wagtailcodeblock).

Wagtail Code Block is a syntax highlighter block for source code for the Wagtail CMS. It features real-time highlighting in the Wagtail editor, the front end, line numbering, and support for [PrismJS](https://prismjs.com/) themes.

__Wagtail Shiki__ uses the [Shiki](https://github.com/shikijs/shiki) library instead of PrismJS library both in Wagtail Admin and the website.
 Required files for Shiki are loaded on demand using [esm.run](https://esm.run).

Additionally, __Wagtail Shiki__ provides text decoration functions (underlining, borders, and more, extensible with CSS styles) within the syntax highlighting.

You can set each themes for light and dark modes.

## Instalation

```bash
pip install wagtail-shiki
```

And add `wagtail_shiki` to `INSTALLED_APPS` in mysite/settings/base.py.

```python
INSTALLED_APPS = [
    "home",
    "search",
    "wagtail.contrib.forms",
    "wagtail.contrib.redirects",
    "wagtail.embeds",
    "wagtail.sites",
    "wagtail.users",
    #... other packages
    "wagtail_shiki",   # <- add this.
]
```

## Trial Run

Install new wagtail for trial run.

```bash
mkdir mysite
python -m venv mysite/env
source mysite/env/bin/activate

pip install wagtail
wagtail start mysite mysite

cd mysite
pip install -r requirements.txt
pip install wagtail-shiki
```
\
\
Edit files bellow:
\
_mysite/settings/base.py_

```python
INSTALLED_APPS = [
    #... other packages
    "wagtail_shiki",   # <- add this.
]
```
\
 _home/models.py_

```python
from wagtail.blocks import TextBlock
from wagtail.fields import StreamField
from wagtail.models import Page
from wagtail.admin.panels import FieldPanel

from wagtail_shiki.blocks import CodeBlock


class HomePage(Page):
    body = StreamField([
        ("heading", TextBlock()),
        ("code", CodeBlock(label='Code')),
    ], blank=True)

    content_panels = Page.content_panels + [
        FieldPanel("body"),
    ]
```

\
_home/templates/home/home_page.html_

```django
    ...

{% load wagtailcore_tags wagtailimages_tags %}

    ...

<!-- {% include 'home/welcome_page.html' %} -->
{% include_block page.body %}

    ...
```

\
\
run:

```bash
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

After the server starts, go to http://127.0.0.1:8000/admin" .
\
Clicking the "+" Add button in the body section, and click "Code" to add a code block.

![](https://github.com/user-attachments/assets/6a00eaf2-25b3-4f54-8992-18f482c4a879)

\
\
Then you can edit the code block.

![](https://github.com/user-attachments/assets/d3defd10-f877-4f46-acf2-556e9adbf742)

## Various settings

### WAGS_LINE_NUMBERS (default = True)

If true, line numbers will be displayed.

You can set the starting line number by inputting "Start number" field in the code block editing screen.

### WAGS_COPY_TO_CLIPBOARD (default = True)

If true, copy to clipboard button will be displayed.

### WAGS_THEME (default = 'nord')

The theme for light mode.

Please refer to https://shiki.matsu.io/themes for a list of available themes.

[Samples](#themes-gallery) of each theme are provided at the end of this document.

### WAGS_DARK_THEME (default = WAGS_THEME)

The theme for dark mode.If this is not set, it will map the light theme to the dark theme.\
As a result, the same theme will be assigned to light mode and dark mode.

### WAGS_SKIP_LEADING_SPACES (default = True)

If true, the decoration of the leading spaces will be skipped to show.

### WAGS_DECORATONS_REMOVE_FRONT_SPAACE (default = True)

If true, the decoration of the front side leading spaces will be deleted.

### WAGS_DECORATONS_REMOVE_REAR_SPAACE (default = True)

If true, the decoration of the rear side leading spaces will be deleted.

### WAGS_SHOW_HIGHLIGHTWORDS_INPUT (default = False)

If true, the "Highlight Words" field(uneditable) will be shown.\
This is only for debugging.

### WAGS_CLASS_PREFIX (default = 'wags')

The prefix for the CSS class name for decorations.\
This parameter and the following "-" will be prepended to the value of the "value" key in "WAGS_DECORATION_OPTIONS" and used as a CSS class.

### WAGS_DECORATION_OPTIONS

```python
default = [
    {
        'value': 'underline-red',
        'text': 'underline red',
        'style': 'text-decoration: red underline;'
    },
    {
        'value': 'underline-blue',
        'text': 'underline blue',
        'style': 'text-decoration: blue underline;'
    },
    {
        'value': 'underline-green',
        'text': 'underline green',
        'style': 'text-decoration: green underline;'
    },
    {
        'value': 'underline-yellow',
        'text': 'underline yellow',
        'style': 'text-decoration: yellow underline;'
    },
    {
        'value': 'wavyunderline-red',
        'text': 'wavy underline red',
        'style': 'text-decoration: red wavy underline;'
    },
    {
        'value': 'wavyunderline-blue',
        'text': 'wavy underline blue',
        'style': 'text-decoration: blue wavy underline;'
    },
    {
        'value': 'wavyunderline-green',
        'text': 'wavy underline green',
        'style': 'text-decoration: green wavy underline;'
    },
    {
        'value': 'wavyunderline-yellow',
        'text': 'wavy underline yellow',
        'style': 'text-decoration: red wavy underline;'
    },
    {
        'value': 'dashedborder-red',
        'text': 'dashed border red',
        'style': 'border: dashed red; border-width: 1px; border-radius: 3px; padding: 0px;'
    },
    {
        'value': 'dashedborder-blue',
        'text': 'dashed border blue',
        'style': 'border: dashed blue; border-width: 1px; border-radius: 3px; padding: 0px;'
    },
    {
        'value': 'dashedborder-green',
        'text': 'dashed border green',
        'style': 'border: dashed green; border-width: 1px; border-radius: 3px; padding: 0px;'
    },
    {
        'value': 'dashedborder-yellow',
        'text': 'dashed border yellow',
        'style': 'border: dashed yellow; border-width: 1px; border-radius: 3px; padding: 0px;'
    },
    {
        'value': '',
        'text': 'Remove decoration(s)',
        'style': ''
    }
]

```

* These five kind ofcharacters `<`, `>`, `'`, `"`, `&` in the string of each value of keys 'value', 'text' and 'style' are removeed.
* The last option `{'value': '', 'text': 'Remove decoration(s)', 'style': ''}` is for Remove decoration(s).\
If valu of 'value' is empty string, the decoration will be removed.(The value of 'value' will be the CSS class name for the selected span.)

Some utility functions for creating CSS styles are provided in the module to ease the creation of decoration options in `basy.py`.

To use these functions, import them from the module:

```python
from wagtail_shiki.settings import (
    css_style_underline as underline,
    css_style_dashedborder as dashedborder,
    css_style_bg_colored as bg_colored,
)
```

And then use it like following:

```python
WAGS_DECORATION_OPTIONS = [
    ...
    {'value': 'underline-red', 'text': 'underline red', 'style': underline('red')},
    ...
    {'value': 'wavyunderline-red', 'text': 'wavy underline red', 'style': underline('red', 'wavy')},
    ...
    {'value': 'dashedborder-red', 'text': 'dashed border red', 'style': dashedborder('red')},
    ...
    {'value': 'bg_colored-red', 'text': 'ba-colored', 'style': bg_colored('red')},
    ...
]
```

It will expanded to:

```python
WAGS_DECORATION_OPTIONS = [
    ...
    {'value': 'underline-red', 'text': 'underline red', 'style': 'text-decoration: red underline;'},
    ...
    {'value': 'wavyunderline-red', 'text': 'wavy underline red', 'style': 'text-decoration: red wavy underline;'},
    ...
    {'value': 'dashedborder-red', 'text': 'dashed border red', 'style': 'border: dashed red; border-width: 1px; border-radius: 3px; padding: 0px;'},
    ...
    {'value': 'bg_colored-red', 'text': 'ba-colored', 'style': 'background-color: red;'},
    ...
]
```

Not only color names, you can also use color specifications that are generally available in style sheets, such as '#00a400', 'rgb(214, 122, 127)' for these utility functions.

#### customizing decoration settings

Add new options to `WAGS_DECORATION_OPTIONS` in your Django settings and add CSS styles for the new options.

If you want to add orange under line decoration, add the following option to `WAGS_DECORATION_OPTIONS` in your Django settings.(class name is for example)

```python
WAGS_DECORATION_OPTIONS = [
    ...
    {'value': 'underline-orange', 'text': 'underline orange', 'style': underline('orange')},
    ...
]
```

>[!NOTE]
WAGS_DECORATION_OPTIONS overrides the default settings, if you want to keep them, you have to add default settings along with your custom settings.

#### base settings for customize

```python
from wagtail_shiki.settings import (
    css_style_underline as underline,
    css_style_dashedborder as dashedborder,
    css_style_bg_colored as bg_colored,
)

WAGS_DECORATION_OPTIONS = [
    {
        'value': 'underline-red',
        'text': 'underline red',
        'style': underline('red')
    },
    {
        'value': 'underline-blue',
        'text': 'underline blue',
        'style': underline('blue')
    },
    {
        'value': 'underline-green',
        'text': 'underline green',
        'style': underline('green')
    },
    {
        'value': 'underline-yellow',
        'text': 'underline yellow',
        'style': underline('yellow')
    },
    {
        'value': 'wavyunderline-red',
        'text': 'wavy underline red',
        'style': underline('red', 'wavy')
    },
    {
        'value': 'wavyunderline-blue',
        'text': 'wavy underline blue',
        'style': underline('blue', 'wavy')
    },
    {
        'value': 'wavyunderline-green',
        'text': 'wavy underline green',
        'style': underline('green', 'wavy')
    },
    {
        'value': 'wavyunderline-yellow',
        'text': 'wavy underline yellow',
        'style': underline('yellow', 'wavy')},
    {
        'value': 'dashedborder-red',
        'text': 'dashed border red',
        'style': dashedborder('red')
    },
    {
        'value': 'dashedborder-blue',
        'text': 'dashed border blue',
        'style': dashedborder('blue')
    },
    {
        'value': 'dashedborder-green',
        'text': 'dashed border green',
        'style': dashedborder('green')
    },
    {
        'value': 'dashedborder-yellow',
        'text': 'dashed border yellow',
        'style': dashedborder('yellow')
    },
    {
        'value': '',
        'text': 'Remove decoration(s)',
        'style': ''
    }
]
```

### WAGS_INITIAL_LANGUAGE (default = 'text')

Specifies the initial Language for new added code block.

If this value is not specified or the specified value does not exist in WAGS_LANGUAGES or the default selection list, Plain Text ('text') will be selected.


### WAGS_LANGUAGES

A list of languages ​​to enable. Don't add 'ansi'(Ansi) and 'text'(Plain Text) here.\
They are automatically enabled.

```python
  default= (
    ("bash", "Bash/Shell"),
    ("css", "CSS"),
    ("diff", "diff"),
    ('jinja', 'Django/Jinja'),
    ("html", "HTML"),
    ("javascript", "Javascript"),
    ("json", "JSON"),
    ("python", "Python"),
    ("scss", "SCSS"),
    ("yaml", "YAML"),
  )
```

Please refer to https://shiki.matsu.io/languages for a list of available languages.

## Usage

Here's how to use this block in the editing screen of the admin site.

### Language

Open the pull-down selector box in the Language field and select the language to use for syntax highlighting.

![](https://github.com/user-attachments/assets/6099df30-08ef-4578-a9b4-2184b1791eae)

### Show line numbers

Check the "Show line numbers" checkbox to show line numbers.

![](https://github.com/user-attachments/assets/d3defd10-f877-4f46-acf2-556e9adbf742)

### Start number

If you need to specify the starting line number, please enter it here.
If this field is blank, start from line number "1".

### Title

If you want to display the file name, title, etc., enter it here.
If nothing is entered, the title block will not be displayed.

### Code

Enter the code text here that you want to apply syntax highlighting to.


### Applying text decorations

![](https://github.com/user-attachments/assets/2dc472a4-e3c0-4657-bb06-4cad5538e3c7)

Select the range you want to decorate in the preview box of syntax highlighting, click the right button of the mouse, select decoration (or remove), and press the "OK" button to apply.

Click the "Cancel" button to cancel the operation.

A pop-up menu will be displayed when both the start and end points of the selection are in the same preview box and you right-click inside that preview box.

The menu does not appear if the selection includes the outside of the preview box, or if you right-click outside of the preview box which the range was selected.

## Themes Gallery

<img src="https://github.com/user-attachments/assets/78e38bcb-0f9f-46ff-aeaa-c7f6a7840b73" alt="andromeeda" width="320">

<img src="https://github.com/user-attachments/assets/3b149641-aa6a-41fc-a105-6825a34a9a42" alt="aurora-x" width="320">

<img src="https://github.com/user-attachments/assets/a5625baf-6f25-4a2d-8ca5-d560ecc4eebe" alt="ayu-dark" width="320">

<img src="https://github.com/user-attachments/assets/d2fd7083-fbec-4815-8b79-399d359a193c" alt="catppuccin-frappe" width="320">

<img src="https://github.com/user-attachments/assets/78fceeb4-3167-4b5d-a2b8-e184c00f634a" alt="catppuccin-latte" width="320">

<img src="https://github.com/user-attachments/assets/e2bbdafa-c52c-40a0-93e2-aeb8cd0b5f38" alt="catppuccin-macchiato" width="320">

<img src="https://github.com/user-attachments/assets/3869ba55-2eb4-4a23-aadd-f96ee3b1889c" alt="catppuccin-mocha" width="320">

<img src="https://github.com/user-attachments/assets/b63242e6-a025-4d05-a8bd-bffe949c7091" alt="dark-plus" width="320">

<img src="https://github.com/user-attachments/assets/715bdf67-9395-48e6-9694-e1b3facbdfbb" alt="dracula" width="320">

<img src="https://github.com/user-attachments/assets/6299ae1a-8751-4e1a-a366-520c8297c994" alt="dracula-soft" width="320">

<img src="https://github.com/user-attachments/assets/0abd93a2-b669-49b1-b502-e4da9d18248a" alt="everforest-dark" width="320">

<img src="https://github.com/user-attachments/assets/631e58fd-4f0e-48b1-8e31-aed665708494" alt="everforest-light" width="320">

<img src="https://github.com/user-attachments/assets/5c0e3707-362a-4b48-91fe-31bf590096a7" alt="github-dark" width="320">

<img src="https://github.com/user-attachments/assets/faaaf21c-228a-4a3b-919d-30756e362ede" alt="github-dark-default" width="320">

<img src="https://github.com/user-attachments/assets/e26fe849-d2e1-4449-8324-d6bd4ab31147" alt="github-dark-dimmed" width="320">

<img src="https://github.com/user-attachments/assets/cf5fb035-cd73-474e-a9ef-238f9f83fe4d" alt="github-dark-high-contrast" width="320">

<img src="https://github.com/user-attachments/assets/d7a0c522-e75f-41d7-91de-e188bb5ab0ef" alt="github-light" width="320">

<img src="https://github.com/user-attachments/assets/95e739b6-7813-438b-b129-ed1ed2d29255" alt="github-light-default" width="320">

<img src="https://github.com/user-attachments/assets/38c2d453-d985-4e0e-9840-4668db4660e5" alt="github-light-high-contrast" width="320">

<img src="https://github.com/user-attachments/assets/1e1f9fb6-7755-4fa5-8865-28d77d175a19" alt="gruvbox-dark-hard" width="320">

<img src="https://github.com/user-attachments/assets/b677d85c-388a-41f1-816c-51966debafbb" alt="gruvbox-dark-medium" width="320">

<img src="https://github.com/user-attachments/assets/df014744-8ec8-4bcd-9055-bcc6cda614ef" alt="vitesse-light" width="320">

<img src="https://github.com/user-attachments/assets/8d2a6164-539f-448d-9455-1ebede3659b7" alt="vitesse-dark" width="320">

<img src="https://github.com/user-attachments/assets/cc0e576d-f269-4d62-b3df-b25b6e974b63" alt="vitesse-black" width="320">

<img src="https://github.com/user-attachments/assets/c57f7e2f-f985-41a8-bcd4-48386c9c0cf0" alt="vesper" width="320">

<img src="https://github.com/user-attachments/assets/1fa0bffc-d118-4777-a7bb-e11535c1a923" alt="tokyo-night" width="320">

<img src="https://github.com/user-attachments/assets/34b8ef91-5743-442d-913e-1caad5bb587e" alt="synthwave-84" width="320">

<img src="https://github.com/user-attachments/assets/c59ecc5d-e7cb-4a1a-b86d-dddfe796bda7" alt="solarized-light" width="320">

<img src="https://github.com/user-attachments/assets/ba3b9767-6440-4040-953e-a906709439e8" alt="solarized-dark" width="320">

<img src="https://github.com/user-attachments/assets/d65e4137-3eb7-4629-9399-8bf379cf44a1" alt="snazzy-light" width="320">

<img src="https://github.com/user-attachments/assets/540b867a-48cd-4d86-a111-cf6cad30e6f1" alt="slack-ochin" width="320">

<img src="https://github.com/user-attachments/assets/6c7c1cc7-4f36-439e-80a9-e41c5f8276d3" alt="slack-dark" width="320">

<img src="https://github.com/user-attachments/assets/3453a9ad-28e4-4d1a-be32-c007ac1ee7b6" alt="rose-pine-moon" width="320">

<img src="https://github.com/user-attachments/assets/cda28fc3-c271-4b7f-992b-f5b3a943dbe2" alt="rose-pine-dawn" width="320">

<img src="https://github.com/user-attachments/assets/23be88bb-a747-4dd9-b3eb-49f42d0f1ce7" alt="rose-pine" width="320">

<img src="https://github.com/user-attachments/assets/ce9a5795-3664-4e12-b421-ff3b2c51fc19" alt="red" width="320">

<img src="https://github.com/user-attachments/assets/becf2793-50cd-4442-9ce1-3d15207e0b36" alt="poimandres" width="320">

<img src="https://github.com/user-attachments/assets/1866c53a-c5db-404c-8424-692a8d348ee9" alt="plastic" width="320">

<img src="https://github.com/user-attachments/assets/b14e7869-423d-4a86-8764-2442dfc9507d" alt="one-light" width="320">

<img src="https://github.com/user-attachments/assets/c17e1f65-daaa-4f3a-99bf-a2bd32fff176" alt="one-dark-pro" width="320">

<img src="https://github.com/user-attachments/assets/0a241ae0-c003-4d21-ad77-1a7cbecb886d" alt="nord" width="320">

<img src="https://github.com/user-attachments/assets/e5a308a2-7a50-4199-b9d1-ac6643e7e4fd" alt="night-owl" width="320">

<img src="https://github.com/user-attachments/assets/f77763f2-9b60-46d1-9c90-de2e4f875a25" alt="monokai" width="320">

<img src="https://github.com/user-attachments/assets/4e5734a6-0427-4f35-9903-bda6cb434793" alt="min-light" width="320">

<img src="https://github.com/user-attachments/assets/db6b4ecf-c403-45e2-8fa4-0e4eba55cde6" alt="min-dark" width="320">

<img src="https://github.com/user-attachments/assets/d435243c-6278-45aa-9edd-2b09f939a910" alt="material-theme-palenight" width="320">

<img src="https://github.com/user-attachments/assets/05aa18f3-3f98-4c70-be0b-0761292f7eb7" alt="material-theme-ocean" width="320">

<img src="https://github.com/user-attachments/assets/23215290-1b56-40f6-a533-af5ec0d06c79" alt="material-theme-lighter" width="320">

<img src="https://github.com/user-attachments/assets/dd230fc2-1ce9-4845-a1b2-f838d9638074" alt="material-theme-darker" width="320">

<img src="https://github.com/user-attachments/assets/37d2371c-7489-4d4c-9eb0-b6441adebfa5" alt="material-theme" width="320">

<img src="https://github.com/user-attachments/assets/e09a151a-651c-4046-ae10-b82b4806a019" alt="light-plus" width="320">

<img src="https://github.com/user-attachments/assets/c57b0169-6566-4c43-914f-b559f5020120" alt="laserwave" width="320">

<img src="https://github.com/user-attachments/assets/0d3f9879-df76-416d-b4fd-cde4cd912cab" alt="kanagawa-wave" width="320">

<img src="https://github.com/user-attachments/assets/bfbfd3d7-330c-4320-83eb-8601faa39f7d" alt="kanagawa-lotus" width="320">

<img src="https://github.com/user-attachments/assets/5307e4a9-c973-40ab-bc3f-e7d6a3185e76" alt="kanagawa-dragon" width="320">

<img src="https://github.com/user-attachments/assets/a920e639-c02a-48c2-88b4-5face75bbd05" alt="houston" width="320">

<img src="https://github.com/user-attachments/assets/ee696c85-69a5-4138-b77a-7fbdfbe63cc6" alt="gruvbox-light-soft" width="320">

<img src="https://github.com/user-attachments/assets/75d4d5aa-fe75-4389-a038-ca0081258977" alt="gruvbox-light-medium" width="320">

<img src="https://github.com/user-attachments/assets/f51825b2-f3d2-4cbb-90fc-0f6288902130" alt="gruvbox-light-hard" width="320">

<img src="https://github.com/user-attachments/assets/0e48cbaf-7401-4b5c-97f7-ac2f7cc940fb" alt="gruvbox-dark-soft" width="320">
