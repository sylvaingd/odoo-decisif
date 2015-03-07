openerp.wk_pos_extra_header = function (instance) {
	var module = instance.point_of_sale;
	var _t = instance.web._t;

	module.POSExtraHeaderWidget = module.PosBaseWidget.extend({
        template: 'POSExtraHeaderWidget',

        init: function(parent, options){
            this._super(parent,options);
        },
    });

    module.PosWidget = module.PosWidget.extend({
        build_widgets: function(){
            this._super();
            this.pos_extra_header = new module.POSExtraHeaderWidget(this,{});
            this.pos_extra_header.insertAfter(this.$('.pos-topheader'));
            // this.pos_extra_header.insertBefore(this.$('.pos-content'));
            // .appendTo(this.$('#rightheader'));
        },
    });

};