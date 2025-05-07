# Wagtail Shiki

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

<img src="https://github.com/user-attachments/assets/2f042cff-926d-4126-b66e-347665196ca2" alt="add code block" />

\
\
Then you can edit the code block.

<img src="https://github.com/user-attachments/assets/a384b955-7033-462e-9e26-227306b2591d" alt="edit view" />

## Various settings

### WAGS_LINE_NUMBERS (deault = True)

If true, line numbers will be displayed. You can set the starting line number by inputting "Start number" field in the code block editing screen.

### WAGS_COPY_TO_CLIPBOARD (deault = True)

If true, copy to clipboard button will be displayed.

### WAGS_THEME (deault = 'everforest-dark')

The theme for light mode.

### WAGS_DARK_THEME (deault = 'everforest-light')

The theme for dark mode.

### WAGS_SKIP_LEADING_SPACES (deault = True)

If true, the decoration of the leading spaces will be skipped to show.

### WAGS_DECORATONS_REMOVE_FRONT_SPAACE (deault = True)

If true, the decoration of the front side leading spaces will be deleted.

### WAGS_DECORATONS_REMOVE_REAR_SPAACE (deault = True)

If true, the decoration of the rear side leading spaces will be deleted.

### WAGS_HIDE_HIGHLIGHTWORDS_INPUT (default = True)

If true, the "Highlight Words" field(uneditable) will be hidden.
This is for debugging.

### WAGS_CLASS_PREFIX (default = 'wags')

The prefix for the CSS class name for decorations.
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

* These five kind ofcharacters `<`, `>`, `'`, `"`, `&` in the string of each value of keys 'value' and 'text' are removeed.
* The last option `{'value': '', 'text': 'Remove decoration(s)', 'style': ''}` is for Remove decoration(s)s.
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

### WAGS_LANGUAGES

A list of languages ​​to enable. 'ansi' and 'text' are always enabled.

```python
  deault= (
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

## Usage


<video src="https://github.com/user-attachments/assets/89d0c6d7-24b4-44c9-874e-ce2f48bc7c65" type="video/webm" controls>
</video>




