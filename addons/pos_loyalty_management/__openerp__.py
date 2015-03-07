# -*- coding: utf-8 -*-
##############################################################################
#
#    OpenERP, Open Source Management Solution
#    Copyright (C) 2004-2010 Tiny SPRL (<http://tiny.be>).
#
#    This program is free software: you can redistribute it and/or modify
#    it under the terms of the GNU Affero General Public License as
#    published by the Free Software Foundation, either version 3 of the
#    License, or (at your option) any later version.
#
#    This program is distributed in the hope that it will be useful,
#    but WITHOUT ANY WARRANTY; without even the implied warranty of
#    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#    GNU Affero General Public License for more details.
#
#    You should have received a copy of the GNU Affero General Public License
#    along with this program.  If not, see <http://www.gnu.org/licenses/>.
#
##############################################################################
{
    'name':'Loyalty & Rewards with POS',
    'version':'1.0',
    'category':'Point Of Sale',
    'author': 'Webkul Software Pvt. Ltd.',
    'description' : """

Loyalty & Rewards with POS
==========================
This module will Provide a loyalty program to your customers. Also Very Easy Steps For Point Redemption in Point Of Sale for your Customers.

NOTE: In Order To Assign Loyalty To Customer, You need to install Our POS Customer Module.

CHARACTERISTICS:
* Loyalty Rule Generation.
* Manage Different-2 Redemption Rules.
* Assign loyalty points to customers using Rules Version.
* redeemed points to give benefits of these loyality points to corresponding customers.
* Customer And Total Earned Points Will be Printed inside POS Receipt.

For any doubt or query email us at support@webkul.com or raise a Ticket on http://webkul.com/ticket/
    """,
    
    'depends': [
        'point_of_sale',
        'wk_wizard_messages',
        ],
    'website': 'http://www.webkul.com',
    'data': [
                'security/loyalty_management_security.xml',
                'rule_sequence.xml',
                'loyalty_management_view.xml',
                'security/ir.model.access.csv',
                'data/product.xml',
                'views/templates.xml',
            ],
    'qweb': [
        'static/src/xml/*.xml',
    ],
    'installable': True,
    'auto_install': False,
    'active': False,
}
