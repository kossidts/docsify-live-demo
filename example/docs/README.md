# Live Demo

> Using <code>requestAnimationFrame</code> to update the time

<code class="live-demo" data-height=650>
<!-- Make your modifications here to test this library -->
<div id="main-container">
</div>

<script>
    const $mainContainer = document.querySelector('#main-container');
    const $hTag = document.createElement("h2");
    $hTag.textContent = 'Hello World';

    const $pTag = document.createElement("p");
    $pTag.textContent = 'This is a simple Live Demo. You can make live changes and they will reflect here.';


    const $time = document.createElement("time");
    $time.textContent = (new Date()).toISOString();

    $mainContainer.append($hTag, $pTag, $time);


    // Update the time using requestAnimationFrame
    function update(){
        $time.textContent = (new Date()).toISOString();


        window.requestAnimationFrame(update);
    }
    window.requestAnimationFrame(update);

</script>
</code>
