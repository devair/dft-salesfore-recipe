import { LightningElement, api} from 'lwc';

export default class DataGridFields extends LightningElement {
    @api recordData;
    @api cell;    

    handleButtonLinkClick(event){        
        const recordId = event.currentTarget.dataset.id;      
        const fieldName = event.currentTarget.dataset.field;
        console.debug('dataGridFields - handleButtonLinkClick', JSON.stringify(recordId));
        
        
        const actionClickEvent = new CustomEvent('localnavigate', {
            detail: { recordId, fieldName },
            bubbles: true,
            composed: true
        });
        this.dispatchEvent(actionClickEvent);
        
    }

}