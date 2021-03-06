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
    'name': 'Message Wizard',
    'sequence': 1,
    'summary': 'To show messages/warnings in OpenERP',
    'version': '1.0',
    'category': 'POS',
    'description': """
Message Wizard
===========================================================


To show messages/warnings in OpenERP
    

For any doubt or query email us at support@webkul.com or raise a Ticket on http://webkul.com/ticket/
    """,
    'author': 'Webkul Software Pvt. Ltd.',
    'depends': [],
    'website': 'http://www.webkul.com',
    'data': ['wizard/wizard_message_view.xml'],
    'installable': True,
    'active': True,
    
}
# vim:expandtab:smartindent:tabstop=4:softtabstop=4:shiftwidth=4:
