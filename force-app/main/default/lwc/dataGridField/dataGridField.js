import { LightningElement, api} from 'lwc';

export default class DataGridField extends LightningElement {
    @api recordData;
    @api cell;    

    handleButtonLinkClick(event){        
        const recordId = event.currentTarget.dataset.id;      
        const fieldName = event.currentTarget.dataset.field;
        const fieldValue = event.currentTarget.dataset.value;
        console.debug('dataGridFields - handleButtonLinkClick', JSON.stringify(recordId));
        
        
        const actionClickEvent = new CustomEvent('localnavigate', {
            detail: { recordId, fieldName, fieldValue },
            bubbles: true,
            composed: true
        });
        this.dispatchEvent(actionClickEvent);
        
    }

}