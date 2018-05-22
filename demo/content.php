<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>content</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">
</head>
<body>

<p>
    Item:<?= isset($_GET['id'])?$_GET['id']:'' ?>
</p>

现在已经来到一个新列表内容页，展示你的新闻内容，商品详情。
<br>
这个页面你可以完全自由发挥，不需要引入插件支持。
<div>
    <a href="javascript:history.go(-1);">返回</a>
</div>
</body>
</html>