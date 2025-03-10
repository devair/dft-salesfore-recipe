import { LightningElement, api } from 'lwc';
import { log } from 'lightning/logger';

export default class AccountOnePageHeader extends LightningElement {
    @api recordData;
    
    connectedCallback(){
        console.log(this.recordData);        
    }

    handleClick(event) {
        const buttonName = event.target.name;
        

        let msg = {
            type: "click",
            action: buttonName
        }
        log(msg);

        console.info(`handleClick: ${msg}`);
    }
}