from django.conf import settings


# CSS class creater


def css_style_underline(color, style="solid"):
    """_summary_
    Create a CSS class for underline with the given color and style.

    Args:
        color (str): line color
        style (str, optional): optional style. Defaults to "solid".

    Returns:
        str: CSS class string
    """

    return f"text-decoration: {color} {style} underline;"


def css_style_dashedborder(color):
    """_summary_
    Create a CSS class for dashed border with the given color.

    Args:
        color  (str): line color

    Returns:
        _type_: CSS class string
"""

    return f"border: dashed {color}; border-width: 1px; border-radius: 3px; padding: 0px;"


def css_style_bg_colored(color):
    """_summary_
    Create a CSS class for background color with the given color.

    Args:
        color (str): line color

    Returns:
        str: CSS class string
    """

    return f"background-color: {color};"


DEFAULT_LANGUAGES = (
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

DEFAULT_DECORATION_OPTIONS = [
    {
        'value': 'underline-red',
        'text': 'underline red',
        'style': css_style_underline('red')
    },
    {
        'value': 'underline-blue',
        'text': 'underline blue',
        'style': css_style_underline('blue')
    },
    {
        'value': 'underline-green',
        'text': 'underline green',
        'style': css_style_underline('green')
    },
    {
        'value': 'underline-yellow',
        'text': 'underline yellow',
        'style': css_style_underline('yellow')
    },
    {
        'value': 'wavyunderline-red',
        'text': 'wavy underline red',
        'style': css_style_underline('red', 'wavy')
    },
    {
        'value': 'wavyunderline-blue',
        'text': 'wavy underline blue',
        'style': css_style_underline('blue', 'wavy')
    },
    {
        'value': 'wavyunderline-green',
        'text': 'wavy underline green',
        'style': css_style_underline('green', 'wavy')
    },
    {
        'value': 'wavyunderline-yellow',
        'text': 'wavy underline yellow',
        'style': css_style_underline('yellow', 'wavy')},
    {
        'value': 'dashedborder-red',
        'text': 'dashed border red',
        'style': css_style_dashedborder('red')
    },
    {
        'value': 'dashedborder-blue',
        'text': 'dashed border blue',
        'style': css_style_dashedborder('blue')
    },
    {
        'value': 'dashedborder-green',
        'text': 'dashed border green',
        'style': css_style_dashedborder('green')
    },
    {
        'value': 'dashedborder-yellow',
        'text': 'dashed border yellow',
        'style': css_style_dashedborder('yellow')
    },
    {
        'value': '',
        'text': 'Remove decoration(s)',
        'style': ''
    }
]

DEFAULT_CLASS_PREFIX = "wags"


def get_language_choices():
    """
    Default list of language choices, if not overridden by Django.
    """

    return getattr(settings, "WAGS_LANGUAGES", DEFAULT_LANGUAGES)
