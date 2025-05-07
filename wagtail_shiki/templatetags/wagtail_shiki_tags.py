from django import template
from django.utils.safestring import mark_safe
from django.conf import settings
from ..settings import DEFAULT_DECORATION_OPTIONS, DEFAULT_CLASS_PREFIX

import re

register = template.Library()


class SetVarNode(template.Node):

    def __init__(self, var_name, var_value):
        self.var_name = var_name
        self.var_value = var_value

    def render(self, context):
        try:
            value = template.Variable(self.var_value).resolve(context)
        except template.VariableDoesNotExist:
            value = ""
        context[self.var_name] = value
        return ""


@register.tag(name='set')
def set_var(parser, token):
    """
        {% set <var_name>  = <var_value> %}
    """
    parts = token.split_contents()
    if len(parts) < 4:
        raise template.TemplateSyntaxError(
            "'set' tag must be of the form:  {% set <var_name>  = <var_value> %}")
    return SetVarNode(parts[1], parts[3])


@register.simple_tag
def theme():
    return getattr(settings, "WAGS_THEME", "dark-plus")


@register.simple_tag
def dark_theme():
    return getattr(settings, "WAGS_DARK_THEME", theme())


@register.simple_tag
def plugin_line_numbers():
    return getattr(settings, "WAGS_LINE_NUMBERS", True)


@register.simple_tag
def plugin_copy_to_clipboard():
    return getattr(settings, "WAGS_COPY_TO_CLIPBOARD", True)


@register.simple_tag
def skip_leading_spaces():
    return getattr(settings, "WAGS_SKIP_LEADING_SPACES", True)


@register.simple_tag
def remove_decorations_front_spaces():
    return getattr(settings, "WAGS_DECORATONS_REMOVE_FRONT_SPAACE", True)


@register.simple_tag
def remove_decorations_rear_spaces():
    return getattr(settings, "WAGS_DECORATONS_REMOVE_REAR_SPAACE", True)


@register.simple_tag
def decoration_options():
    select_options = []
    options = getattr(
        settings, "WAGS_DECORATION_OPTIONS", DEFAULT_DECORATION_OPTIONS)

    for opt in options:
        if opt['value'] != '':
            prefix = class_prefix() + '-'
        else:
            prefix = ''

        select_options.append({
            'value': prefix + re.sub('[\<\>\'\"\&]', '', opt['value']),
            'text': re.sub('[\<\>\'\"\&]', '', opt['text'])
        })

    return mark_safe(str(select_options))


@register.simple_tag
def decoration_styles():
    style_rules = []
    options = getattr(
        settings, "WAGS_DECORATION_OPTIONS", DEFAULT_DECORATION_OPTIONS)

    for opt in options:
        if opt['value'] != '':
            prefix = class_prefix() + '-'
        else:
            prefix = ''

        style_rule = {
            'class': prefix + re.sub('[\<\>\'\"\&]', '', opt['value']),
            'style': re.sub('[\<\>\'\"\&]', '', opt['style'])
        }
        style_rules.append(style_rule)

    return mark_safe(str(style_rules))


@register.simple_tag
def hide_highlightwords_input():
    return getattr(settings, "WAGS_HIDE_HIGHLIGHTWORDS_INPUT", True)


@register.simple_tag
def class_prefix():
    return getattr(settings, "WAGS_CLASS_PREFIX", DEFAULT_CLASS_PREFIX)
