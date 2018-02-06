<?php error_reporting(0); if ($_GET['skip']>=20){header("Content-type: application/json"); echo json_encode(['end'=>true]);exit;} ?>
<?php for ($i=$_GET['skip'];$i<$_GET['skip']+$_GET['limit'];$i++): ?>
    <li class="list-group-item"><?= $i ?> <a href="content.html">
            <?php foreach ($_GET as $k => $v): ?>
            [<?php echo $k ?>:<?php echo $v; ?>]
            <?php endforeach; ?>
            Item</a>
    </li>
<?php endfor; ?>
