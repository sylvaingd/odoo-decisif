openerp.pos_loyalty_management = function(instance){
    var module   = instance.point_of_sale;
    var round_di = instance.web.round_decimals;
    var round_pr = instance.web.round_precision;
    var QWeb = instance.web.qweb;
    _t = instance.web._t;

     module.CustomerRedeemWidget = module.PosBaseWidget.extend({
        template: 'CustomerRedeemWidget',

        /* Overload Section */
        init: function(parent, options){
            this._super(parent,options);
            this.pos.bind('change:selectedOrder', this.refresh, this);
        },

        start: function(){
            this._super();
            this._build_widgets();
        },

        /* Custom Section */
        refresh: function(){
            this.renderElement();
            this._build_widgets();
        },

        _build_widgets: function(){
            var current = this;
            this.customer_redeem_button = new module.HeaderButtonWidget(this,{
                label:_t('Redemption'),
                action: function(){
                    currentOrder = current.pos.get('selectedOrder');
                    client = currentOrder.get_client();
                    if (client){
                        if (currentOrder.getTotalTaxExcluded() > 0)
                        {
                        if(!currentOrder.get('redeemTaken')){
                            var loyalty_model = new instance.web.Model('loyalty.management');
                            loyalty_model.call('get_voucher_product_id').fail(function(unused, event){
                                //don't show error popup if it fails 
                                event.preventDefault();
                                msg = 'Failed to fetch Vouchser Product, Configure Loyalty Rules!!!'
                                console.error(msg);
                                alert(msg);
                            }).done(function(product_id){
                                currentOrder.set('voucherProductId',product_id);
                                loyalty_model.call('get_customer_loyality',[client.id] )
                                .fail(function(unused, event){
                                    //don't show error popup if it fails 
                                    event.preventDefault();
                                    msg = 'Failed to fetch customer loyalty points';
                                    console.error(msg);
                                    alert(msg);
                                }).done(function(result){
                                    tpoints = result.points;
                                    discount  = result.discount;
                                    if(discount != -1 ){
                                        if(discount != 0 ){
                                            if(tpoints > 0 && client.wk_loyalty_points > 0){
                                                // dueTotal = currentOrder.getTotalTaxIncluded();
                                                dueTotal = currentOrder.getTotalTaxExcluded();
                                                discount_offer = dueTotal > discount ? discount : dueTotal;
                                                discount_offer = round_di(parseFloat(discount_offer) || 0, current.pos.dp['Product Price']);
                                                currentOrder.set('discount_offer',discount_offer);
                                                currentOrder.set('total_points',tpoints);
                                                message = "Welcome "+client.name+"<br/><br/>Your Total Earned Points: "+tpoints+"<br/>The Total Discount:  "+discount_offer;
                                                current.pos_widget.screen_selector.show_popup('pos-customer-redemption');
                                                $("#pos-customer-redemption-summary").html(message);    
                                            }else{
                                                alert(_t('Sorry You Cannot Redeem, Because Customer Has 0 Points!!!'));
                                            }
                                        }else{
                                        alert(_t('Sorry, You don`t have enough points to redeem !!!'));
                                    }

                                    }else{
                                        alert(_t('Sorry No Redemption Calculation Found in Loyalty Rule. Please Add Redemption Rule First !!!'));
                                    }
                                });
                            }); 
                        }else{
                            alert(_t('Sorry You Have Already Redeemed Fidelity points for this customer!!!'));
                        }
                        }
                        else{
                        alert(_t('Please add some Product(s) First !!!'));
                        }
                    }
                    else{
                        alert(_t('Please select Customer First !!!'));
                    }
                },
            });
            this.customer_redeem_button.replace($('.placeholder-RedeemButtonWidget'));
            this.customer_redeem_button.renderElement();
        },
    });

    module.PosRedeemPopupWidget = module.PopUpWidget.extend({
        template:'PosRedeemPopupWidget',
        
        start: function(){
            this._super();
            var self = this;
            client = self.pos.get('selectedOrder').get_client();
            this.redeem_summary_screen_widget = new module.RedeemSummaryScreenWidget(this,{'client':client});
        },

        show: function(){
            this._super();
            var self = this;
            this.redeem_summary_screen_widget.replace($('.placeholder-RedeemSummaryScreenWidget'));
        },
    });

       module.RedeemSummaryScreenWidget = module.ScreenWidget.extend({
        template:'RedeemSummaryScreenWidget',

        init: function(parent, options) {
            this._super(parent,options);
            this.pos.bind('change:selectedOrder', this.refresh, this);
        },

        refresh: function(){
            this.renderElement();
        },

        start: function(parent,options) {
            this._super();
            var self = this;
        },

        renderElement: function() {
            this._super();
            var self = this;
            var db = this.pos.db;
            this.$('#redeem-now').click(function(){
                currentOrder = self.pos.get('selectedOrder');
                discount_offer = currentOrder.get("discount_offer")
                voucher_product_id = currentOrder.get("voucherProductId");
                var product = self.pos.db.get_product_by_id(voucher_product_id);
                var client = currentOrder.get('client');
                client.wk_loyalty_points = 0;
                currentOrder.addProduct(product, {price: -discount_offer});
                currentOrder.set('redeemTaken',true);
                self.pos_widget.screen_selector.close_popup();
            });
            this.$('#redeem-cancel').click(function(){
              self.pos_widget.screen_selector.close_popup();
            });
        },
    });

    /*************************************************************************
        Overload : PosWidget to include button in PosOrderHeaderWidget widget
        to select or unselect customers
    */
    module.PosWidget = module.PosWidget.extend({

        build_widgets: function(){
            this._super();
            var self = this;

            // Add a widget to manage customer
            this.manage_redemptions = new module.CustomerRedeemWidget(this,{});
            this.manage_redemptions.appendTo(this.$('#pos_extra_header'));

            // create a pop up 
            this.pos_customer_redemtion_popup = new module.PosRedeemPopupWidget(this, {});
            this.pos_customer_redemtion_popup.appendTo(this.$el);
            this.pos_customer_redemtion_popup.hide();
            this.screen_selector.popup_set['pos-customer-redemption'] = this.pos_customer_redemtion_popup;

        },
    });


    var _super_PosModel = module.PosModel;
    var models = _super_PosModel.prototype.models;
    for(var i = 0; i < models.length; i++){
        var model = models[i];
        if(model.model === 'product.product'){
            model.fields.push('wk_point_for_loyalty');
        }else if(model.model === 'res.partner'){
            model.fields.push('wk_loyalty_points');
        }
    }

    module.PosModel = module.PosModel.extend({

        on_removed_order: function(removed_order,index,reason){
                
            if( (reason === 'abandon')){
                // when we intentionally remove an unfinished order, and there is another existing one
                var currentOrder = this.get('selectedOrder');
                var client = currentOrder.get_client();
                if (client)
                {
                    if(currentOrder.get('redeemTaken'))
                    {
                    	// console.log('sadsadsa');
                    	// console.log(currentOrder.get("total_points"));
                        client.wk_loyalty_points = currentOrder.get("total_points");
                    }
                }
            }
            _super_PosModel.prototype.on_removed_order.apply(this,arguments);
        },
    });

    var _super = module.Order;
    module.Order = module.Order.extend({
        initialize: function(attributes){
            _super.prototype.initialize.apply(this,arguments);
            this.set({
                redeemTaken:    false,
                totalEarnedPoint: 0,
                voucherProductId: 0,
                discount_offer:   0,
                total_points:   0,
            });
        },
        removeOrderline: function(line){
            var product_id = line.product.id;
            if(product_id == this.get('voucherProductId')) {
                this.get('client').wk_loyalty_points = this.get("total_points");
                this.set('redeemTaken',false);
                this.set('total_points',0);
                this.set('discount_offer',0);
            }
            _super.prototype.removeOrderline.apply(this,arguments);
        },
        get_loyalty_points: function(){
            var orderLines = this.get('orderLines').models;
            var total_loyalty   = 0;
            for(var i = 0; i < orderLines.length; i++){
                var line = orderLines[i];
                if (line.product.wk_point_for_loyalty > 0){               
                    total_loyalty += round_pr( line.get_quantity() * line.product.wk_point_for_loyalty,1);
                }
            }
            return total_loyalty;
        },
        validate: function(){
            var client = this.get('client');
            if( client ){
                client.wk_loyalty_points += this.get_loyalty_points();
            }
            _super.prototype.validate.apply(this,arguments);
        },
        export_for_printing: function(){
            var currentOrder = this.pos.get('selectedOrder');
            var json = _super.prototype.export_for_printing.apply(this,arguments);
            json.wk_loyalty_points = this.get_loyalty_points();
            json.tpoints = currentOrder.get('totalEarnedPoint');
            json.redeemTaken = currentOrder.get('redeemTaken');
            // console.log('a');
            return json;
        },
        export_as_JSON: function(){
            var currentOrder = this.pos.get('selectedOrder');
            var json = _super.prototype.export_as_JSON.apply(this,arguments);
            json.wk_loyalty_points = this.get_loyalty_points();
            json.tpoints = currentOrder.get('totalEarnedPoint');
            json.redeemTaken = currentOrder.get('redeemTaken');
            // console.log('b');
            return json;
        },
    });
    
    var _super_OrderWidget = module.OrderWidget;
    module.OrderWidget = module.OrderWidget.extend({
        update_summary: function(arguments){
            // this._super();

            var order = this.pos.get('selectedOrder');

            var $loypoints = $(this.el).find('.summary .loyalty-points');

            if(order.get_client()){
                var points        = order.get_loyalty_points();
                var points_total  =  order.get_client().wk_loyalty_points + points; 
                var points_str    = this.format_pr(points,1); 
                var total_str     = this.format_pr(points_total, 1);
                if( points && points > 0 ){
                    points_str = '+' + points_str;
                }
                $loypoints.replaceWith($(QWeb.render('LoyaltyPoints',{ 
                    widget: this, 
                    totalpoints: total_str, 
                    wonpoints: points_str 
                })));
                $loypoints = $(this.el).find('.summary .loyalty-points');
                $loypoints.removeClass('oe_hidden');
            }else{
                $loypoints.empty();
                $loypoints.addClass('oe_hidden');
            }
            _super_OrderWidget.prototype.update_summary.apply(this,arguments);
        },
    });
};

    
