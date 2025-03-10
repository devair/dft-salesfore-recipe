import { LightningElement, api, wire, track } from 'lwc';
import { log } from 'lightning/logger';
import { pedidos, colunasPedido, colunasItemMae, colunasPedidoFilhoMae, colunasNfItemMae  } from './dataSamples';
import { getRecord } from 'lightning/uiRecordApi';
import { NavigationMixin } from 'lightning/navigation';

export default class AccountOnePage extends NavigationMixin(LightningElement) {

    @api recordId;
    objectApiName = 'Account';
    
    @track mainRecords ;
    @track recordData;

    @wire(getRecord, {recordId: '$recordId',fields: ["Account.Name", "Account.LastModifiedDate"]})
    wiredAccount
    ({ error, data }){
        if(data){
            console.debug('wiredAccount:', data);  
            this.recordData = data;
        }
        else if(error){
            console.error('Erro ao carregar contas:', error);  
        }
    }
    
    connectedCallback(){
        console.debug("connectedCallback", JSON.stringify(this.recordData)); 
        this.mainRecords = pedidos();
    }

    handleDetailsClick(event) {
        let msg = {
            type: "click",
            action: "Details"
        }
        log(msg);
    }
   
    navigateToPage(event) {
        const { recordId, fieldName } = event.detail;
        
        let direction
        let encodeDef

        switch (fieldName) {            
            case 'invoices':

                direction = {
                    componentDef: 'c:orderOnePage', 
                    attributes: {
                        recordId: recordId
                    }               
                }
    
                encodeDef = btoa(JSON.stringify(direction));
    
                this[NavigationMixin.Navigate]({
                    type: 'standard__webPage',
                    attributes: {url: '/one/one.app#'+encodeDef}
                });

                break;            
        
            default:
                break;
        }
    }

    handleButtonClick(event){
        console.debug('accountOnePage - handleButtonClick', JSON.stringify(event));
    }
}