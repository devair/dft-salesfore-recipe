import { LightningElement, api, wire } from 'lwc';
import { IsConsoleNavigation, getFocusedTabInfo, closeTab } from 'lightning/platformWorkspaceApi';

import NAME_FIELD from '@salesforce/schema/Contact.Name';

export default class RecordEditForm extends LightningElement {


    @api recordId;
    @api objectApiName = 'Contact';

    contactNameField = NAME_FIELD;

    @wire(IsConsoleNavigation) isConsoleNavigation;

    @api handleSubmit(event){
        event.preventDefault();       // stop the form from submitting
        const fields = event.detail.fields;              
        console.log('onsubmit: ', fields);
        this.template.querySelector('lightning-record-edit-form').submit(fields);
    }

    handleSuccess(event){
        const updatedRecord = event.detail.id;
        console.log('onsuccess: ', updatedRecord);
    }

    @api handleClose() {        
        if (this.isConsoleNavigation) {
            getFocusedTabInfo().then((tabInfo) => {
                closeTab(tabInfo.tabId);
            }).catch(function(error) {
                console.log(error);
            });
        }
    }
}