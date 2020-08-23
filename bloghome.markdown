---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

title: techdude Blog
layout: home
---

<section id="intro" class="main">
    <div class="spotlight">
        <div class="content">
            <header class="major">
                {% for blogpost in site.blogposts %}
                    <h2>{{ blogpost.title }}</h2>
            </header>
                <p>{{ blogpost.content }}</p>
            {% endfor %}
        </div>
        <span class="image"><img src="images/board-blickpixel-pixabay.jpg" alt="" /></span>
    </div>
</section>
