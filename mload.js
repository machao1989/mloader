/**
 * Created by SNQU on 2017/9/5.
 * Author:machao
 * 移动端异步列表加载插件
 */
(function($){
    //单例原型
    var n='mload'
    var m=[];
    //默认选项
    var r = {
        filter:{},
        beforeLoad:function () {},//加载之前 return false可阻止加载
        completed:function (n) {},//全部加载完成后回调
        protect:null,
        mab:50,//预加载高度(px)
        //pull:50//顶部下拉刷新(px)
    };
    var on=false,eon=false,pon=false
    function sbtm(e) {
        var self=e.data[0]
        var awb = $(self.doc).height() - $(self.c).scrollTop() - $(self.c).height();
        on = awb <= self.option.mab?true:false;
        pon=(on!=eon)?true:false;
        eon = awb <= self.option.mab?true:false;
        //滑动到窗口底部事件
        if(pon && on){
            $(self.c).trigger('unenough',[self])
        }
    }

    var i = function (e,n,i) {
        this.target=e //容器
        this.idx=i //单例标识
        this.offset=0 //加载偏移
        this.end=false //内容是否全部加载完毕
        this.option = $.extend({}, r, n);

        this.init()

        if(typeof this.option.filter ==='function'){
            f=this.option.filter(this);
            if(f instanceof Array){
                var $self = this;
                $.each(f,function (i,n) {
                    $self.option.filter[n.name]=n.value;
                })
            }else{
                this.option.filter = f;
            }
        }

        if(!window.history.state[self.idx]){//如果没有历史过滤值则使用初始过滤值
            this.filter=$.extend({},this.option.filter)//过滤器
        }
        //this.print()
    }
    i.prototype.init=function () {
        var self = this
        self.c = window
        $(self.target).parents().each(function (i,n) {
            if($(n).css('overflow-y')=='scroll' || $(n).css('overflow-y')=='auto'){
                self.c = n;
                return false
            }
        })
        self.doc = (self.c==window)?document:self.target;
        if(window.history.state[self.idx]){
            //恢复回退数据
            self.offset = window.history.state[self.idx].offset
            self.filter = window.history.state[self.idx].filter
            self.end = window.history.state[self.idx].end
            $(self.target).html(window.history.state[self.idx].list)
            $(self.c).scrollTop(window.history.state[self.idx].scorllTop)
            if(window.history.state[self.idx].protect && self.option.protect){
                $(self.option.protect).each(function (i,n) {
                    $(this).html(window.history.state[self.idx].protect[i])
                })
            }
            $(self.c).scroll([this],sbtm);
        }

        $(window).unload(function(){
            $.each(m,function (i,n) {
                var self = n
                var protect = []
                if(self.option.protect){
                    $(self.option.protect).each(function (i,n) {
                        protect[i] = $(this).html()
                    })
                }

                var stateobj={}
                stateobj[self.idx] = {
                    list:$(self.target).html(),
                    offset:self.offset,
                    filter:self.filter,
                    scorllTop:$(self.c).scrollTop(),
                    protect:protect,
                    end:self.end
                }
                stateobj = $.extend(window.history.state,stateobj)
                window.history.replaceState(stateobj,null,window.location.href);//将当前url加入堆栈中
            })
        });

        $(self.c).on('unenough',function (e,n) {
            if(n.end===false && n.option.beforeLoad(n)!==false){
                n.option.loadprocess(n)
            }
            e.stopPropagation()
        })

        var ms = null;
        $(self.c).on('touchend',function (e,n) {
            ms = null;
            setTimeout(function () {
                $(self.target).animate({'margin-top':0},'slow')
            },200)
        })
        $(self.c).on('touchstart',function (e,n) {
            if($(self.c).scrollTop()==0){
                self.st=true;
            }
        })
        $(self.c).on('touchmove',function (e,n) {
            var bst = self.st?self.st:false;

            if($(self.c).scrollTop()==0 && bst){
                ms = e.originalEvent.changedTouches[0].clientY;
            }
            if(ms>0 && e.originalEvent.changedTouches[0].clientY>ms){
                var di = e.originalEvent.changedTouches[0].clientY-ms
                console.log(di)
                $(self.target).css('margin-top',di)

            }
            self.st = $(self.c).scrollTop();
            e.stopPropagation()
        })

    }
    i.prototype.ajax=function (ajaxoption) {
        var self = this
        var optionclone = $.extend({},ajaxoption)
        self.blh = $(self.target).height()
        var ajax = $.extend(ajaxoption,{
            success:function (response,status) {
                optionclone.success(response,status)
                self.loaded(response,status)
            },
            error:function (jqXHR,status,errorThrown) {
                optionclone.error(jqXHR,status)
                self.loaded(jqXHR,status)
            }
        })
        $.ajax(ajax)
    }
    i.prototype.print=function () {
        console.log(this)
    }
    i.prototype.setfilter=function (f) {
        var filter={};
        if(f instanceof Array){
            $.each(f,function (i,n) {
                filter[n.name]=n.value;
            })
        }else{
            filter = f;
        }
        this.filter = $.extend(this.filter,filter)
        return this;
    }
    i.prototype.reload = function () {
        $(this.c).unbind('scroll');
        $(this.target).html('')
        this.offset=0;
        this.end=false;
        $(this.c).trigger('unenough',[this])
        return this;
    }
    i.prototype.loaded=function (response,status) {
        if(this.blh>=$(this.target).height())this.end=true
        if(this.end===false && status=='success' && response){
            this.offset++
            if($(this.doc).height()<=$(this.c).scrollTop()+$(this.c).height()+this.option.mab){
                $(this.c).trigger('unenough',[this])
            }else{
                if(!($._data(this.c,'events') && $._data(this.c,'events')['scroll'])){
                    $(this.c).scroll([this],sbtm);
                }
            }
        }else{
            this.end=true//加载出错或加载全部完成标记end
            this.option.completed(response,status)
        }
    }

    //mload
    $.fn.mload=function (e) {
        window.history.state || window.history.replaceState({},null,window.location.href);
        p = new i(this, e,m.length)
        m.push(p)
        $.data(this, n, p)
        this.mload.prototype.init(p)
        return this.mload.prototype
    }

    $.fn.mload.prototype.filter=function (s) {
        $.each(m,function (i,n) {
            this.setfilter(s);
        })
        return this
    }

    $.fn.mload.prototype.reload=function () {
        $.each(m,function (i,n) {
            this.reload();
        })
        return this
    }

    $.fn.mload.prototype.init=function (self) {
        //注册内容不足事件
        if($(self.doc).height()<=$(self.c).height()+self.option.mab){
            $(self.c).trigger('unenough',[self])
        }else{
            if(!($._data(self.c,'events') && $._data(self.c,'events')['scroll'])){
                $(self.c).scroll([self],sbtm);
            }
        }
    }

})(jQuery);

