---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

title: techdude Index
layout: home
---

<section id="intro" class="main">
    <div class="spotlight">
        <div class="content">
            <header class="major">
                <h2>I do computers for a living</h2>
            </header>
            <p>You want your laptop to make you a sandwich? You need a website? You need help getting your man-cave rigged? Oh, you can't get into your e-mail...<br /><br /> 

                Whatever--I can help (see a full list of <a href="#services">services here</a>). Give me a shout at <a href="mailto:{{ site.email }}">{{ site.email }}</a> or <a href="#footer">call me</a>.<br /><br />
            </p>
        </div>
        <span class="image"><img src="images/board-blickpixel-pixabay.jpg" alt="" /></span>
    </div>

    <div id="services">
        {% include services.html %}
    </div>
</section>
