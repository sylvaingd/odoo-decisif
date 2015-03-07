# -*- coding: utf-8 -*-
##############################################################################
#
#    OpenERP, Open Source Management Solution
#    Copyright (C) 2011-2014 Webkul Software Pvt Ltd (<http://webkul.com>).
#	 Author : Mohit Chandra (mohit@webkul.com)
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
    'name': 'POS - Extra Header',
    'summary': 'Add an extra header in the Point Of Sale',
    'version': '0.1',
    'category': 'POS',
    'description': """
Add an extra header in the Point Of Sale
====================================================

Functionality:
--------------
    * Add an extra header in the point of sale page under the the first one, 
    for showing extra-information of the current pos order.

""",
    'author': 'Webkul Software Pvt Ltd.',
    'website': 'http://www.webkul.com',
    'depends': [
        'point_of_sale',
        ],
    'data': [
        'views/templates.xml'
    ],
    'qweb': [
        'static/src/xml/*.xml',
    ]
}