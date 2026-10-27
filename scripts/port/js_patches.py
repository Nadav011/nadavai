"""Exact (old, new) replacements applied to a prototype module before the automatic string pass.

Use them only where the prototype assumes static .html pages or builds markup with Hebrew inside a longer string.
A patch that no longer applies stops the sync, so a prototype change cannot silently skip one.
"""
JS_PATCHES: dict[str, list[tuple[str, str]]] = {}
