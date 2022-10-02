# Super-Thumbnail-Generator

去年为了解决展览排厅时录入作品的重复劳动设计了一个processing软件，可以根据作品信息的表格，直接生成和作品大小等比例附带信息注释的pdf文件，然后在ai里导出成dwg的文件就可以放进三维软件里做效果图了。

现在这个processing被我重新写成了一个JavaScript的2.0版本，并且根据反馈做了很多调整：1.基本解决了文字转曲不能搜索的问题；2.作品信息模块一个一个生成，一旦遇到bug就可以立即停止，能够更方便的找到是那一行表格信息有问题；3.改用正则表达式查找尺寸信息，对尺寸的录入格式没有那么严格了。
然后增加了几个小功能：1.可以通过滑块自由控制文字的大小。之前有展览遇到年纪比较大的艺术家，为了给他们看效果图需要把文字调大，耗费了很多时间，于是加上这个功能；2.点击作品可以删除，这样在网页里查找之后能即时做出调整；3.可以更换字体，但目前只有两个，因为我目前找到的避免导出成pdf之后文字转曲的唯一方法就是使用华文黑体，但是又感觉不太好看，所以留了一个旗黑供不需要转曲的场合使用，之后再增加一些别的字。

总体来说现在应该可以满足原美术馆的使用了，不过还有很多想做到的功能我依然不会写，而且我很想让它变成一个真正的网站，这些就留给3.0版本来实现吧。总之我打算整理一下做一个使用说明，然后把代码放在GitHub上，希望能帮到更多苦于重复劳动的排厅人。



另外，我还没有想到一个好的名字，现在它叫Super Thumbnail Generator2.0，对这个名字不是很满意。