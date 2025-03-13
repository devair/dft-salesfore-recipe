import { LightningElement, api, track, wire } from 'lwc';
import getOrders from '@salesforce/apex/OrdersController.getOrders';
import getOrderItens from '@salesforce/apex/OrdersController.getOrderItens';

import { getRecord } from 'lightning/uiRecordApi';
const COLUMNS = [
    { label: 'Pedido', fieldName: 'orderNumber', type: 'text'},
    { label: 'Cliente', fieldName: 'customerName', type: 'text'},
    { label: 'Tipo', fieldName: 'type', type: 'text'},
    { label: 'Valor', fieldName: 'totalAmount', type: 'currency',        
        cellAttributes: {
            currencyCode: { fieldName: 'currencyCode'} , 
            currencyDisplayAs: 'symbol',              
        }
    },   
    { label: 'Status', fieldName: 'status', type: 'text'},
]

const CHILDREN_COLUMNS = [
    { label: 'Produto', fieldName: 'productName', type: 'text'},    
    { label: 'Quantidade', fieldName: 'quantity', type: 'number'}    
]

export default class OrderOnePage extends LightningElement {

    @api recordId;    
    @track orders;
    columns = COLUMNS
    childrenColumns = CHILDREN_COLUMNS;

    accountRecord

    @wire(getRecord, {recordId: '$recordId',fields: ["Account.Name", "Account.LastModifiedDate"]})
    wiredAccount
    ({ error, data }){
        if(data){
            console.debug('wiredAccount:', data);  
            this.accountRecord = data;
        }
        else if(error){
            console.error('Erro ao carregar contas:', error);  
        }
    }

    @wire(getOrders, { parentId: '$recordId'})
    wiredAccounts({ error, data }) {
        if (data) {                        
            this.orders = this.formatDataGrid(data);                        
            
        } else if (error) {
            console.error('Erro ao carregar contas:', error);            
        }        
    }
    
    // Monta os dados do nivel 1
    formatDataGrid(orders){

        const data = orders.map(order => {                        
            return { 
                id: order.Id,
                orderNumber: order.OrderNumber,
                customerName: order.Account.Name,
                parentName: order.ParentAccount__r.Name,
                type: order.Type,
                totalAmount: order.TotalAmount,
                status: order.Status,
                hasChildren: order.ItemCount__c > 0,
                children: null
            }
        });

        return { data, columns: this.columns}
    }

    async handleExpand(event){
        const record = event.detail.record;
        console.debug(JSON.stringify(event.detail));
        
        switch (record.type) {
            case 'Mãe':
                this.getParentOrderItens(record)                
                break;
            case 'Filho':
            case 'Normal':
                // metodo para itens do pedido filho  e normal      
                break;
            default:
                break;
        }

    }

    // Obtém os dados do nivel
    async getParentOrderItens(record){
        try {
            // Obtém os itens do pedido
            const orderItems = await getOrderItens({ orderId: record.id });            
            const data = orderItems.map(item => {
                return {
                    id: item.Id,
                    productName: item.Product2.Name,
                    quantity: item.Quantity
                }
            });                        
            
            // Atualiza o children o nivel
            const children = { data , columns: this.childrenColumns };
            record.children =  children;
            record.hasDataChildren = true;                        
            console.debug(JSON.stringify(this.orders));

        } catch (error) {
            console.error(JSON.stringify(error));
        }        
    }   
}