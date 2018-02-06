<?php
sleep(1);
?>

    <?php for ($i=$_GET['skip'];$i<$_GET['skip']+$_GET['limit'];$i++): ?>
        <li class="list-group-item"><?= $i ?> <a href="content.html"><?php if (!empty($_GET['model'])): ?>[search:<?php echo $_GET['model']; ?>]<?php endif; ?>PList</a></li>
    <?php endfor; ?>
