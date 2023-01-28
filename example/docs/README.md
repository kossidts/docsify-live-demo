# Headline

> An awesome project.

<code class="live-demo" data-height=700>

<div id="main-container"></div>
<script>
    const $mainConteainer = document.querySelector('#main-container');
    const $hTag = document.createElement("h2");
    $hTag.textContent = 'Hello World';
    const $pTag = document.createElement("p");
    $pTag.textContent = 'This is a simple Live Demo. You can make live changes and they will reflect hier.';
    const $time = document.createElement("time");
    $mainConteainer.append($hTag, $pTag, $time);
    $time.textContent = (new Date()).toISOString();
    // Update the time using requestAnimationFrame
    function update(){
        $time.textContent = (new Date()).toISOString();
        window.requestAnimationFrame(update);
    }
    window.requestAnimationFrame(update);
</script>

</code>
