<?php if($_GET['skip']>=40) exit(); ?>

    <?php for ($i=$_GET['skip'];$i<$_GET['skip']+$_GET['limit'];$i++): ?>
        <li class="list-group-item"><?= $i ?> <a href="content.html"><?php if (!empty($_GET['search'])): ?>[search:<?php echo $_GET['search']; ?>]<?php endif; ?>SC</a></li>
    <?php endfor; ?>
