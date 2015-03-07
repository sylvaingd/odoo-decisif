	module = instance.point_of_sale;
	 _t = instance.web._t;



    var _load_server_data_ = module.PosModel.prototype.load_server_data;
    module.PosModel.prototype.load_server_data = function(){
        var self = this;
        var load_def = _load_server_data_.call(self).done(self.load_loyalty_data());
        return load_def;
    },

   

   




 

    

        module.Order = module.Order.extend({
        initialize: function(attributes){
            Backbone.Model.prototype.initialize.apply(this, arguments);
            this.set({
                creationDate:   new Date(),
                orderLines:     new module.OrderlineCollection(),
                paymentLines:   new module.PaymentlineCollection(),
                name:           "Order " + this.generateUniqueId(),
                client:         null,
                redeemTaken:    false,
                totalEarnedPoint: 0,
                voucherProductId: 0,
                discount_offer:   0,
            });
            this.pos =     attributes.pos; 
            this.selected_orderline = undefined;
            this.screen_data = {};  // see ScreenSelector
            this.receipt_type = 'receipt';  // 'receipt' || 'invoice'
            return this;
        },
        removeOrderline: function( line ){
            var product_id = line.get_product().get('id');
            if(product_id == this.get('voucherProductId')) {
                this.set('redeemTaken',false);
            }
            this.get('orderLines').remove(line);
            this.selectLine(this.getLastOrderline());
        },
        exportAsJSON: function() {
            var orderLines, paymentLines;
            var currentOrder = this.pos.get('selectedOrder');
            var total_earned_point = currentOrder.get('totalEarnedPoint');
            var redeemtaken_value = currentOrder.get('redeemTaken');
            orderLines = [];
            (this.get('orderLines')).each(_.bind( function(item) {
                return orderLines.push([0, 0, item.export_as_JSON()]);
            }, this));
            paymentLines = [];
            (this.get('paymentLines')).each(_.bind( function(item) {
                return paymentLines.push([0, 0, item.export_as_JSON()]);
            }, this));
            var client = this.pos.get('selectedOrder').get('client');
            return {
                name: this.getName(),
                amount_paid: this.getPaidTotal(),
                amount_total: this.getTotalTaxIncluded(),
                amount_tax: this.getTax(),
                amount_return: this.getChange(),
                lines: orderLines,
                statement_ids: paymentLines,
                pos_session_id: this.pos.get('pos_session').id,
                partner_id: client ? client.id : undefined,
                user_id: this.pos.get('cashier') ? this.pos.get('cashier').id : this.pos.get('user').id,
                tpoints:total_earned_point,
                redeemtaken:redeemtaken_value,
            };
        },

    });