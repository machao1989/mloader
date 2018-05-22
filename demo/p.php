<?php
@sleep(1);
?>
<?php for ($i=$_GET['skip'];$i<$_GET['skip']+$_GET['limit'];$i++): ?>
    <li class="list-group-item">
        <?= $i ?>
        <a href="content.php?id=<?= $i ?>">
            <?php foreach ($_GET as $k => $v): ?>
                [<?php echo $k ?>:<?php echo $v; ?>]
            <?php endforeach; ?>
        </a>
    </li>
<?php endfor; ?>