import { LightningElement, wire, track, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { RefreshEvent } from 'lightning/refresh';
import { NavigationMixin } from 'lightning/navigation';
import { IsConsoleNavigation, getFocusedTabInfo, closeTab, openTab, focusTab  } from 'lightning/platformWorkspaceApi';
import getSubSubjectField from '@salesforce/apex/CaseFormController.getSubSubjectField';

export default class CaseFormLayout extends NavigationMixin(LightningElement) {
    @track fields = [];
    @track error;
    @api recordId;
    @api recordTypeId;
    @api accountId;
    @api recordTypeName;
        
    @track caseOrign;
    @track additionalFields;
    
    objectApiName = 'Case';
    mainTabId
    
    @track title

    @track AT_BankingProduct__c;
    @track AT_BankingSubject__c;
    @track BankingSubSubject__c;

    connectedCallback(){
        this.title = `Novo Caso ${this.recordTypeName}`  
        this.addEventListener('submitform', this.handleFormSubmit.bind(this));    
        
        if(this.isConsoleNavigation)
        {
            getFocusedTabInfo().then((tabInfo) => {
                this.mainTabId = tabInfo.tabId;
            }).catch(function(error) {
                console.log(error);
            });            
        }
    }

    @wire(IsConsoleNavigation) isConsoleNavigation;

    async handleProductChange(event){
        const recordId = event.detail.recordId;
        this.AT_BankingProduct__c = recordId;                    
    }

    async handleSubjectChange(event){
        const recordId = event.detail.recordId;
        this.AT_BankingSubject__c = recordId;                    
    }
    
    async handleSubSubjectChange(event){
        const recordId = event.detail.recordId;
        this.BankingSubSubject__c = recordId;

        let additionalFIelds = await getSubSubjectField({recordId });
        this.additionalFields = undefined;
        
        if(additionalFIelds){            
            this.additionalFields = additionalFIelds            
        }                
    }
           
    handleSubmit(event){
        
        event.preventDefault();       // stop the form from submitting
        const fields = event?.detail?.fields; 
        console.log('onsubmit: ', JSON.stringify(fields));        
        
        fields['AT_BankingProduct__c'] = this.AT_BankingProduct__c;
        fields['AT_BankingSubject__c'] = this.AT_BankingSubject__c;
        fields['BankingSubSubject__c'] = this.BankingSubSubject__c;
        
        this.template.querySelector('lightning-record-edit-form').submit(fields);
    }
   
    handleSuccess(event) {                   
        this.recordId = event.detail.id;   
        this.caseNumber = event?.detail?.fields?.CaseNumber?.value;     
        this.showNotification('Sucesso', `Caso "${this.caseNumber}" criado com sucesso.`,'success', 'dismissible ');            
        this.dispatchEvent(new RefreshEvent());   
        this.navigateToRecord(event.detail.id);    
        this.handleClose();                             
                             
    } 

    handleError(event) {                   
        console.log(JSON.stringify(event.detail));
        const { message, errors, detail } = event.detail;
        this.showNotification('Erro', `${message}. Detalhe: ${detail}` ,'error', 'sticky');
    } 

    @api async handleClose() {        
        if (this.isConsoleNavigation) {            
            await closeTab(this.mainTabId);
            return;            
        }
    }

    async navigateToRecord(id) {                
        if (this.isConsoleNavigation) {
            const tabId = await openTab({
                url: `/lightning/r/Case/${id}/view`,   //usar o recordId não estava focando a tab             
                focus: true           
            });            
            await focusTab(tabId);
        }
    }

    showNotification(title, message, variant, mode) {
        const evt = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
            mode: mode
        });
        this.dispatchEvent(evt);  
    } 

    handleFormSubmit() {        
        this.refs.hiddenSubmit.click();
    }
}
