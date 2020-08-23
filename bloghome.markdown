---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

title: techdude Blog
layout: post
---

{% for blogpost in site.blogposts %}
<header class="major">
    <h2>{{ blogpost.title }}</h2>
</header>
{{ blogpost.content }}
<header class="major">
{% endfor %}
